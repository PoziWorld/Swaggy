import annyang from 'annyang';
import browser from 'webextension-polyfill';

import logger from 'Shared/logger';
import * as utils from 'Shared/utils';
import t from 'Shared/i18n';
import { queries } from 'Shared/messaging';
import { getListener, setListener } from 'Models/listener';
import { getSettings } from 'Models/settings';
import { getStorageAreaName } from 'Models/storage';
import getUrl from 'Models/urls';

import { processor, processResponse, processError } from './request-processor';

let initialized = false;
let listening;

const STARTED_LOG_MESSAGE_KEY = 'logListenerStartedEvent';
const STOPPED_LOG_MESSAGE_KEY = 'logListenerStoppedEvent';
const RECOGNIZED_TEXT_LOG_MESSAGE_KEY = 'logListenerRecognizedTextEvent';

/**
 * Speech Recognition engine constantly stops and starts again when ON.
 * Don't change the browser action icon unless it stopped for real.
 *
 * @type {number}
 */

let stoppedListener;
const STOPPED_LISTENER_TIMEOUT = 50;

/**
 * Check whether to start listening automatically, add a toggle on the page, listen for settings changes in the Storage.
 */

export function initVoiceControlListener() {
  shouldAutostart();
  watchForStorageChanges();
}

/**
 * Check whether to start listening automatically.
 *
 * @return {Promise<void>}
 */

async function shouldAutostart() {
  try {
    const { autostart } = await getListener();

    if ( utils.is( autostart, `boolean` ) && autostart ) {
      await handleVoiceControlToggle();
    }
    else {
      await switchListener( false );
    }
  }
  catch ( e ) {
    /**
     * @todo
     */
  }
}

/**
 * Listen for settings changes in the Storage.
 */

function watchForStorageChanges() {
  browser.storage.onChanged.addListener( handleStorageChanges );
}

/**
 * If voice control settings change, we want to automatically apply them without page refresh.
 *
 * @param {Object} changes - This contains one property for each key that changed. The name of the property is the name of the key that changed, and its value is a storage.StorageChange object describing the change to that item.
 * @param {string} areaName - The name of the storage area ("sync", "local" or "managed") to which the changes were made.
 */

function handleStorageChanges( changes, areaName ) {
  if ( utils.isNonEmptyString( areaName ) && areaName === getStorageAreaName( `settings` ) && utils.isNonEmptyObject( changes ) ) {
    const { settings: { newValue, oldValue } } = changes;

    if ( utils.isNonEmptyObject( newValue ) && utils.isNonEmptyObject( oldValue ) ) {
      const { voiceControl: { hotword: newHotword } } = newValue;
      const { voiceControl: { hotword: oldHotword } } = oldValue;

      if ( utils.is( newHotword, `string` ) && utils.is( oldHotword, `string` ) && newHotword !== oldHotword ) {
        setHotword( newHotword );
      }
    }
  }
}

/**
 * Handle a toggle click.
 *
 * @param {Event} [event] *
 * @return {Promise<void>}
 */

export async function handleVoiceControlToggle( event ) {
  if ( event ) {
    event.preventDefault();
  }

  if ( annyang ) {
    if ( annyang.isListening() ) {
      annyang.abort();
      logger.verbose( `stopping...` );
    }
    else {
      if ( ! initialized ) {
        try {
          const { voiceControl: { hotword } } = await getSettings();

          setHotword( hotword );
        }
        catch ( e ) {
          /**
           * @todo
           */
        }

        initialized = true;
      }

      watchForListenerEvents( true );
      annyang.start();
      logger.verbose( `attempting to start...` );
    }
  }
}

/**
 * Set/update the hotword (called “command” in annyang).
 *
 * @param {string} hotword
 */

function setHotword( hotword ) {
  if ( annyang ) {
    annyang.removeCommands();

    const annyangCommand = {};

    annyangCommand[ `${ hotword }*userCommand` ] = handleCommands;

    annyang.addCommands( annyangCommand );
  }
}

/**
 * Act on a command given by user.
 *
 * @param {string} command - The given command.
 */

function handleCommands( command ) {
  if ( utils.isNonEmptyString( command ) ) {
    logRecognizedText( command );

    processor.textRequest( command )
      .then( processResponse )
      .catch( processError )
      ;
  }
}

/**
 * Listen for the listener events to notify user of status changes (ON/OFF).
 *
 * @param {boolean} watch
 */

function watchForListenerEvents( watch ) {
  if ( annyang ) {
    if ( utils.is( watch, `boolean` ) && watch ) {
      /**
       * https://github.com/TalAter/annyang/blob/master/docs/README.md#addcallbacktype-callback-context
       */

      annyang.addCallback( `start`, handleListenerStartedEvent );
      annyang.addCallback( `end`, handleListenerStoppedEvent );

      /**
       * @todo Listen for `error` to help user figure out whether it's a network or permission issue.
       */
    }
    else {
      /**
       * https://github.com/TalAter/annyang/blob/master/docs/README.md#removecallbacktype-callback
       */

      annyang.removeCallback();
    }
  }
}

/**
 * Fired as soon as the browser's Speech Recognition engine starts listening.
 */

async function handleListenerStartedEvent() {
  logger.verbose( `handleListenerStartedEvent` );

  try {
    await switchListener( true );
  }
  catch ( e ) {
    /**
     * @todo
     */
  }
}

/**
 * Fired when the browser's Speech Recognition engine stops.
 */

async function handleListenerStoppedEvent() {
  logger.verbose( `handleListenerStoppedEvent` );

  /**
   * Speech Recognition engine constantly stops and starts again when ON.
   * Don't change the browser action icon unless it stopped for real.
   */

  window.clearTimeout( stoppedListener );

  stoppedListener = window.setTimeout( async () => {
    if ( annyang && ! annyang.isListening() ) {
      await switchListener( false );
      watchForListenerEvents( false );
    }
  }, STOPPED_LISTENER_TIMEOUT );
}

/**
 * If the listener is enabled before window unload, start it automatically next time a supported page is opened.
 * Show the listener status via the browser action icon.
 *
 * @param {boolean} active
 * @return {Promise<void>}
 */

async function switchListener( active ) {
  /**
   * Speech Recognition engine constantly stops and starts again when ON.
   * Don't change the browser action icon unless it stopped for real.
   */

  if ( utils.is( active, `boolean` ) && active !== listening ) {
    listening = active;

    try {
      await setListener( {
        listener: {
          autostart: active,
        },
      } );

      await setBrowserAction( {
        listening: active,
      } );

      logStatusChange( active );
    }
    catch ( e ) {
      /**
       * @todo
       */
    }
  }
}

/**
 * Send a message to the background script to change browser action state for this tab.
 *
 * @param {Object} options
 * @return {Promise<void>}
 */

export async function setBrowserAction( options ) {
  if ( utils.isNonEmptyObject( options ) ) {
    try {
      const response = await browser.runtime.sendMessage( {
        apiRequest: {
          query: queries.browserAction.mutation,
          data: options,
        },
      } );

      logger.verbose( `setBrowserAction: %j`, response );
    }
    catch ( e ) {
      /**
       * @todo
       */
    }
  }
}

/**
 * Notify user of a status change via log.
 *
 * @param {boolean} active
 */

function logStatusChange( active ) {
  if ( utils.is( active, `boolean` ) ) {
    let message;

    if ( active ) {
      message = t(
        STARTED_LOG_MESSAGE_KEY,
        {
          supportedCommandUrl: getUrl( `EXTENSION_COMMANDS` ),
          examplesUrl: getUrl( `EXTENSION_COMMANDS_EXAMPLES` ),
        },
      );
    }
    else {
      message = t( STOPPED_LOG_MESSAGE_KEY );
    }

    logger.info( message );
  }
}

/**
 * Notify user of a recognized text via log.
 *
 * @param {string} text - The recognized text (“command” in annyang terminology).
 */

function logRecognizedText( text ) {
  if ( utils.isNonEmptyString( text ) ) {
    const message = t(
      RECOGNIZED_TEXT_LOG_MESSAGE_KEY,
      {
        text,
        optionsUrl: getUrl( `EXTENSION_OPTIONS_CHROMIUM` ).replace( `EXTENSION_ID`, browser.runtime.id ),
      },
    );

    logger.info( message );
  }
}
