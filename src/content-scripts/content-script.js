import browser from 'webextension-polyfill';

import { handleOnMessageEvent } from 'Shared/messaging';

import { initVoiceControlListener } from './request-listener';

init();

/**
 * Initialize content script.
 */

function init() {
  addListeners();
  initVoiceControlListener();
}

/**
 * Define what events the content script should listen to.
 */

function addListeners() {
  browser.runtime.onMessage.addListener( handleOnMessageEvent );
}
