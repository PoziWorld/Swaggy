import annyang from 'annyang';
import browser from 'webextension-polyfill';

import logger from 'Shared/logger';
import * as utils from 'Shared/utils';
import { queries } from 'Shared/messaging';
import { getListener, setListener } from 'Models/listener';
import { getSettings } from 'Models/settings';
import { getStorageAreaName } from 'Models/storage';

import { processor, processResponse, processError } from './request-processor';

let boolHasBeenInitialized = false;

/**
 * Check whether to start listening automatically, add a toggle on the page, listen for settings changes in the Storage.
 */

export function initVoiceControlListener() {
  shouldAutostart();
  listenForStorageChanges();
}

/**
 * Check whether to start listening automatically.
 *
 * @return {Promise<void>}
 */

async function shouldAutostart() {
  try {
    const { autostart } = await getListener();

    if ( utils.is( autostart, 'boolean' ) && autostart ) {
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

function listenForStorageChanges() {
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

      if ( utils.is( newHotword, 'string' ) && utils.is( oldHotword, 'string' ) && newHotword !== oldHotword ) {
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
      logger.verbose( 'component: voice-control: aborted' );

      await switchListener( false );
    }
    else {
      if ( ! boolHasBeenInitialized ) {
        try {
          const { voiceControl: { hotword } } = await getSettings();

          setHotword( hotword );
        }
        catch ( e ) {
          /**
           * @todo
           */
        }

        boolHasBeenInitialized = true;
      }

      annyang.start();
      logger.verbose( 'component: voice-control: attempting to start' );

      await switchListener( true );
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
    logger.info( `component: voice-control: recognized text:  ${ command }` );

    processor.textRequest( command )
      .then( processResponse )
      .catch( processError )
      ;
  }
}

/**
 * If the listener is enabled before window unload, start it automatically next time a supported page is opened.
 * Show the listener status via the browser action icon.
 *
 * @param {boolean} active
 * @return {Promise<void>}
 */

async function switchListener( active ) {
  try {
    await setListener( {
      listener: {
        autostart: active,
      },
    } );

    await setBrowserAction( {
      listening: active,
    } );
  }
  catch ( e ) {
    /**
     * @todo
     */
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
