import annyang from 'annyang';
import browser from 'webextension-polyfill';

import logger from 'Shared/logger';
import * as utils from 'Shared/utils';
import { getSettings } from 'Models/settings';
import { getSettingsStorageAreaName } from 'Models/storage';

import { processor, processResponse, processError } from './request-processor';

let boolHasBeenInitialized = false;

init();

/**
 * Check whether to start listening automatically, add a toggle on the page, listen for settings changes in the Storage.
 */

function init() {
  shouldAutostart();
  addToggle();
  listenForStorageChanges();
}

/**
 * Check whether to start listening automatically.
 */

function shouldAutostart() {
  if ( utils.isStorageAccessible() && localStorage.getItem( 'boolShouldVoiceControlAutostart' ) === 'true' ) {
    handleVoiceControlToggle();
  }
}

/**
 * Add a toggle to the page and add a toggle click listener.
 */

function addToggle() {
  const $$toggle = document.createElement( 'button' );
  const $$toggleParent = document.createElement( 'li' );

  $$toggle.id = 'sbVoiceControlCta';
  $$toggle.classList.add( 'sbMenuCta', 'sbCta' );
  $$toggle.textContent = browser.i18n.getMessage( 'voiceControlCta' );
  $$toggle.addEventListener( 'click', handleVoiceControlToggle );

  $$toggleParent.appendChild( $$toggle );
  document.getElementById( 'sbUserMenuList' ).appendChild( $$toggleParent );
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
  if ( utils.isNonEmptyString( areaName ) && areaName === getSettingsStorageAreaName() && utils.isNonEmptyObject( changes ) ) {
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
 * @param {Event} [event]
 */

async function handleVoiceControlToggle( event ) {
  if ( event ) {
    event.preventDefault();
  }

  if ( annyang ) {
    if ( annyang.isListening() ) {
      annyang.abort();

      if ( utils.isStorageAccessible() ) {
        localStorage.setItem( 'boolShouldVoiceControlAutostart', false );
        logger.verbose( 'component: voice-control: aborted' );
      }
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

      if ( utils.isStorageAccessible() ) {
        localStorage.setItem( 'boolShouldVoiceControlAutostart', true );
      }
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
