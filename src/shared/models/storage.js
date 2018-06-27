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
} );

/**
 * Retrieve settings from the Storage.
 *
 * @return {Promise<Object>}
 */

export async function getSettings() {
  try {
    const { settings } = await browser.storage[ getSettingsStorageAreaName() ].get( getSettingsStorageObjectName() );

    if ( utils.isNonEmptyObject( settings ) ) {
      return settings;
    }
  }
  catch ( e ) {
    /**
     * @todo
     */
  }
}

/**
 * Save settings in the Storage.
 *
 * @param {SettingsWrapped} settingsWrapped
 * @return {Promise<boolean>}
 */

export async function setSettings( settingsWrapped ) {
  if ( utils.isNonEmptyObject( settingsWrapped ) ) {
    try {
      let newSettingsWrapped;

      const existingSettings = await getSettings();

      if ( utils.isNonEmptyObject( existingSettings ) ) {
        const existingSettingsWrapped = {
          settings: existingSettings,
        };

        newSettingsWrapped = mergeDeep( existingSettingsWrapped, settingsWrapped );
      }
      else {
        newSettingsWrapped = settingsWrapped;
      }

      await browser.storage[ getSettingsStorageAreaName() ].set( newSettingsWrapped );

      return true;
    }
    catch ( e ) {
      logger.debug( `setSettings (storage): fail: %j`, e );

      return false;
    }
  }
}

/**
 * Return the name of a storage area where the settings are kept.
 *
 * @return {string}
 */

export function getSettingsStorageAreaName() {
  return STORAGE_AREAS.get( `settings` );
}

/**
 * In case the settings object in the Storage ever gets renamed, only one reference needs to be updated.
 *
 * @return {string}
 */

export function getSettingsStorageObjectName() {
  return 'settings';
}
