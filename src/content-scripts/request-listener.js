import 'annyang';
import { processor, processResponse, processError } from './request-processor';
import * as utils from '../shared/utils';

let boolHasBeenInitiated = false;

init();

/**
 * Check whether to start listening automatically and add a toggle on the page.
 */

function init() {
  shouldAutostart();
  addToggle();
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
  $$toggle.textContent = chrome.i18n.getMessage( 'voiceControlCta' );
  $$toggle.addEventListener( 'click', handleVoiceControlToggle );

  $$toggleParent.appendChild( $$toggle );
  document.getElementById( 'sbUserMenuList' ).appendChild( $$toggleParent );
}

/**
 * Handle a toggle click.
 *
 * @param {Event} event
 */

function handleVoiceControlToggle( event ) {
  event && event.preventDefault();

  if ( annyang ) {
    if ( annyang.isListening() ) {
      annyang.abort();
      utils.isStorageAccessible() && localStorage.setItem( 'boolShouldVoiceControlAutostart', false );
      console.log( 'component: voice-control: ', 'aborted' );
    }
    else {
      if ( ! boolHasBeenInitiated ) {
        annyang.addCallback( 'result', handleCommands );

        boolHasBeenInitiated = true;
      }

      annyang.start();
      utils.isStorageAccessible() && localStorage.setItem( 'boolShouldVoiceControlAutostart', true );
      console.log( 'component: voice-control: ', 'attempting to start' );
    }
  }
}

/**
 * Act on a received command.
 *
 * @param {string[]} arrCommands - Array of possible commands
 */

function handleCommands( arrCommands ) {
  const strCommand = arrCommands[ 0 ];
  console.log( 'component: voice-control: recognized text: ', strCommand );

  processor.textRequest( strCommand )
    .then( processResponse )
    .catch( processError )
    ;
}
