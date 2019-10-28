import { List } from 'immutable';
import browser from 'webextension-polyfill';

import logger from 'Shared/logger';
import * as utils from 'Shared/utils';
import t from 'Shared/i18n';
import { queries } from 'Shared/messaging';
import getUrl from 'Models/urls';

const browserActionStatuses = {
  ON: 'on',
  OFF: 'off',
  ERROR: 'error',
};

/**
 * Other parts of extension (content scripts, browser action, options) might send API requests to the background script because they don't have access to all extension APIs.
 */

/**
 * Browser action icon sizes.
 *
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json/browser_action#Choosing_icon_sizes
 *
 * @type {Immutable.List<number>}
 */

const iconSizes = List( [
  16,
  32,
  64,
] );

/**
 * Use different icons for ON and OFF voice control listener states.
 *
 * @type {(Object|boolean)}
 */

const statusOnIcons = generateStatusIconsDictionary( `on` );
const statusOffIcons = generateStatusIconsDictionary( `off` );

/**
 * Change browser action state depending on voice control listener status.
 *
 * @param {boolean} [listening]
 * @param {boolean} [errorOccurred]
 * @param {number} tabId
 * @return {Promise<void>}
 */

export async function setBrowserAction( { data: { listening, errorOccurred }, tab: { id: tabId } } ) {
  logger.verbose( `setBrowserAction: %j, %j`, listening, errorOccurred, tabId );

  if ( utils.is( listening, `boolean` ) || utils.is( errorOccurred, `boolean` ) ) {
    await requestToEnableBrowserAction( tabId );

    const status = listening ?
      browserActionStatuses.ON :
      errorOccurred ?
        browserActionStatuses.ERROR :
        browserActionStatuses.OFF;

    if ( status !== browserActionStatuses.ERROR ) {
      browser.browserAction.setIcon( {
        path: listening ?
          statusOnIcons :
          statusOffIcons,
        tabId,
      } );
    }

    browser.browserAction.setBadgeText( {
      text: composeBadgeText( status ),
      tabId,
    } );

    browser.browserAction.setTitle( {
      title: composeTitle( status ),
      tabId,
    } );
  }
}

/**
 * Get localized badge text for the browser action. The badge is displayed on top of the icon.
 *
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/browserAction/setBadgeText
 *
 * @param {string} status
 * @return {(string|boolean)}
 */

function composeBadgeText( status ) {
  if ( utils.isNonEmptyString( status ) ) {
    return t( `browserActionBadgeText_${ status }` );
  }

  return false;
}

/**
 * Get localized browser action badge title displayed in a tooltip over the browser action's icon.
 *
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/browserAction/setTitle
 *
 * @param {string} status
 * @return {(string|boolean)}
 */

function composeTitle( status ) {
  if ( utils.isNonEmptyString( status ) ) {
    return t( `browserActionBadgeTitle_${ status }`, {
      extensionName: t( `extensionName` ),
      supportUrl: getUrl( `EXTENSION_SUPPORT_CHROMIUM` ),
    } );
  }

  return false;
}

/**
 * Attempt to enable the browser action if it's not enabled.
 *
 * @param {number} tabId
 * @return {Promise<void>}
 */

async function requestToEnableBrowserAction( tabId ) {
  try {
    const enabled = await browser.browserAction.isEnabled( { tabId } );
    logger.verbose( `setBrowserAction: %s`, enabled );

    if ( ! enabled ) {
      enableBrowserAction( tabId );
    }
  }
  catch ( e ) {
    /**
     * Possible reason: this is Chrome that doesn't have isEnabled method.
     *
     * https://developer.chrome.com/extensions/browserAction
     */

    logger.debug( `setBrowserAction: isEnabled check: fail: %j`, e );

    enableBrowserAction( tabId );
  }
}

/**
 * Enable the browser action for the specified tab and add a browser action click listener.
 *
 * @param {number} tabId
 */

function enableBrowserAction( tabId ) {
  logger.verbose( `enableBrowserAction: %i`, tabId );

  browser.browserAction.enable( tabId );

  browser.browserAction.onClicked.removeListener( requestToSwitchVoiceControlListener );
  browser.browserAction.onClicked.addListener( requestToSwitchVoiceControlListener );
}

/**
 * On browser action click, try to switch the voice control listener ON or OFF depending on the current status.
 *
 * @param {number} tabId
 * @return {Promise<void>}
 */

async function requestToSwitchVoiceControlListener( { id: tabId } ) {
  logger.verbose( `requestToSwitchVoiceControlListener: %i`, tabId );

  try {
    const response = await browser.tabs.sendMessage(
      tabId,
      {
        apiRequest: {
          query: queries.voiceControlListener.mutation,
        },
      },
    );

    logger.verbose( `requestToSwitchVoiceControlListener: %j`, response );
  }
  catch ( e ) {
    logger.debug( `requestToSwitchVoiceControlListener: fail: %j`, e );
  }
}

/**
 * Create an object specifying image paths for icons of different sizes.
 *
 * @param {string} status
 * @return {(Object|boolean)}
 */

function generateStatusIconsDictionary( status ) {
  if ( utils.isNonEmptyString( status ) ) {
    return iconSizes.reduce( ( dictionary, size ) => {
      dictionary[ size ] = `icons/microphone-${ status }-icon-${ size }.png`;

      return dictionary;
    }, {} );
  }

  return false;
}
