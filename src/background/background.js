import browser from 'webextension-polyfill';

import * as utils from 'Shared/utils';
import { getVersion } from 'Shared/extension';
import { handleOnMessageEvent } from 'Shared/messaging';
import { SETTINGS_INTRODUCED_VERSION, setDefaultSettings } from 'Models/settings';
import { setDefaultListener } from 'Models/listener';

init();

function init() {
  addListeners();
  disableBrowserAction();
}

/**
 * Define what events the background should listen to.
 */

function addListeners() {
  browser.runtime.onInstalled.addListener( handleOnInstalledEvent );
  browser.runtime.onMessage.addListener( handleOnMessageEvent );
}

/**
 * Browser action icon will only be shown for supported pages.
 */

function disableBrowserAction() {
  browser.browserAction.disable();
}

/**
 * Fired when the extension is first installed, when the extension is updated to a new version, and when the browser is updated to a new version.
 *
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onInstalled
 *
 * @param {string} reason - https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/OnInstalledReason
 * @param {string} previousVersion - The previous version of the extension just updated. This is only present if the reason value is update.
 */

async function handleOnInstalledEvent( { reason, previousVersion } ) {
  if ( utils.isNonEmptyString( reason ) && reason === 'install' || utils.isNonEmptyString( previousVersion ) && previousVersion < SETTINGS_INTRODUCED_VERSION && previousVersion < getVersion() ) {
    await initialize();
    openOptionsPage();
  }
}

/**
 * Set up default settings (store them in the Storage for later use) and listener data.
 *
 * @return {Promise<void>}
 */

async function initialize() {
  try {
    await setDefaultSettings();
    await setDefaultListener();
  }
  catch ( e ) {
    /**
     * @todo
     */
  }
}

/**
 * Force-open the Options page on install, as it might serve as an intro page.
 */

function openOptionsPage() {
  try {
    browser.runtime.openOptionsPage();
  }
  catch ( e ) {
    /**
     * @todo
     */
  }
}
