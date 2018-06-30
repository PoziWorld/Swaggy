import { Map, mergeDeep } from 'immutable';
import browser from 'webextension-polyfill';

import logger from 'Shared/logger';
import * as utils from 'Shared/utils';

/**
 * For the calls across the scripts, specify a storage area for each type of data.
 *
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage#Properties
 *
 * @type {Immutable.Map<string, string>}
 */

const STORAGE_AREAS = Map( {
  settings: 'sync',
  listener: 'local',
} );

/**
 * Retrieve the item (settings, listener data) from the Storage.
 *
 * @param {string} itemName
 * @return {Promise<Object>}
 */

export async function getStorageItem( itemName ) {
  if ( utils.isNonEmptyString( itemName ) ) {
    try {
      const itemWrapped = await browser.storage[ getStorageAreaName( itemName ) ].get( itemName );

      if ( utils.isNonEmptyObject( itemWrapped ) ) {
        return itemWrapped[ itemName ];
      }
    }
    catch ( e ) {
      /**
       * @todo
       */
    }
  }
}

/**
 * Save the item (settings, listener data) in the Storage.
 *
 * @param {string} itemName
 * @param {(SettingsWrapped|ListenerWrapped)} itemWrapped
 * @return {Promise<boolean>}
 */

export async function setStorageItem( itemName, itemWrapped ) {
  if ( utils.isNonEmptyObject( itemWrapped ) ) {
    try {
      let newItemWrapped;
      const existingItem = await getStorageItem( itemName );

      if ( utils.isNonEmptyObject( existingItem ) ) {
        const existingItemWrapped = {};

        existingItemWrapped[ itemName ] = existingItem;
        newItemWrapped = mergeDeep( existingItemWrapped, itemWrapped );
      }
      else {
        newItemWrapped = itemWrapped;
      }

      await browser.storage[ getStorageAreaName( itemName ) ].set( newItemWrapped );

      return true;
    }
    catch ( e ) {
      logger.debug( `setStorageItem: fail: %j`, e );

      return false;
    }
  }
}

/**
 * Return the name of a storage area where the settings are kept.
 *
 * @param {string} itemName
 * @return {(string|boolean)}
 */

export function getStorageAreaName( itemName ) {
  if ( utils.isNonEmptyString( itemName ) ) {
    return STORAGE_AREAS.get( itemName );
  }

  return false;
}
