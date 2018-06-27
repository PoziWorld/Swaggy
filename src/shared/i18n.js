import { use } from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';
import { reactI18nextModule } from 'react-i18next';
import { List } from 'immutable';
import browser from 'webextension-polyfill';

import logger from 'Shared/logger';

/**
 * https://github.com/i18next/i18next-browser-languageDetector#detector-options
 */

const lngDetectorOptions = {
  order: [
    'browserExtension',
  ],
};

/**
 * https://github.com/i18next/i18next-xhr-backend#backend-options
 */

const xhrOptions = {
  loadPath: '{{lng}}',
  parse: data => data,
  ajax: loadLocales,
};

/**
 * @todo Get dynamically or don't forget to update.
 */

const LOCALES = List( [
  'en-US',
] );

const DEFAULT_LOCALE = LOCALES.get( 0 );

/**
 * https://github.com/i18next/i18next-browser-languageDetector#adding-own-detection-functionality
 */

const browserExtensionDetector = {
  name: 'browserExtension',
  lookup: () => {
    /**
     * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/i18n/getUILanguage
     */

    let languageCode = browser.i18n.getUILanguage();

    if ( languageCode && isSupported( languageCode ) ) {
      return languageCode;
    }
    else {
      /**
       * https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages
       *
       * @type {ReadonlyArray<string>}
       */

      const languageCodes = navigator.languages;

      if ( Array.isArray( languageCodes ) ) {
        for ( const languageCode of languageCodes ) {
          if ( isSupported( languageCode ) ) {
            return languageCode;
          }
        }
      }
    }

    return DEFAULT_LOCALE;
  }
};

const languageDetector = new LngDetector();

languageDetector.addDetector( browserExtensionDetector );

/**
 * https://www.i18next.com/configuration-options.html
 */

const i18nextOptions = {
  /**
   * @todo Make debug configurable.
   */

  debug: process.env.NODE_ENV === 'development',
  initImmediate: false,
  detection: lngDetectorOptions,
  backend: xhrOptions,
  fallbackLng: {
    'default': [
      DEFAULT_LOCALE,
    ],
  },
  load: 'currentOnly',
  ns: 'messages',
  defaultNS: 'messages',
  react: {
    wait: true,
  },
};

// messages.json keys are objects with “message”, “description”, and other optional properties.
// To get translation for “extensionName”, get “message” property of the “extensionName” object.
const translationLookupKeySuffix = '.message';

/**
 * Reference the initialized translation function.
 * https://www.i18next.com/overview/api#t
 *
 * @type {i18next.t}
 */

let _t;

/**
 * Initialize localization module.
 *
 * @type {i18next}
 */

const i18n =
  use( LngDetector )
    .use( XHR )
    .use( reactI18nextModule )
    .init(
      i18nextOptions,
      // Callback
      ( err, t ) => {
        if ( err ) {
          logger.debug( `i18n: init: fail: %j`, err );

          return;
        }

        _t = t;
      },
    );

/**
 * Return an instance.
 *
 * @return {i18next}
 */

function getI18n() {
  return i18n;
}

/**
 * The translation function.
 * https://www.i18next.com/overview/api#t
 *
 * @param {string} key - message.json key.
 * @param {Object} [options] - https://www.i18next.com/translation-function/essentials#overview-options
 * @return {string}
 */

export default function t( key, options ) {
  const translationLookupKey = key + translationLookupKeySuffix;
  const t = _t || getI18n().t;

  return t( translationLookupKey, options );
}

/**
 * Return the current detected or set language.
 * https://www.i18next.com/overview/api#language
 *
 * @return {string} - Current detected or set language.
 */

export function getLanguage() {
  return getI18n().language;
}

/**
 * Avoid loading locales asynchronously.
 *
 * @param {string} languageCode
 * @param {Object} options
 * @param {Function} callback
 * @return {Promise<void>}
 */

async function loadLocales( languageCode, options, callback ) {
  try {
    const locale = await import(
      /* webpackChunkName: "locale" */
      /* webpackMode: "eager" */
      `../_locales/${ convertLanguageCodeToLocale( languageCode ) }/messages.json`
    );

    callback(
      locale,
      {
        status: '200',
      },
    );
  }
  catch ( e ) {
    callback(
      null,
      {
        status: '404',
      },
    );
  }
}

/**
 * Convert the common format returned by APIs (“-” as a separator) to the format used by extensions locales (“_” as a separator).
 * https://developer.chrome.com/extensions/i18n#overview-locales
 *
 * @param {string} languageCode - en-US, en, ru
 * @return {string} - en_US, en, ru
 */

function convertLanguageCodeToLocale( languageCode ) {
  return languageCode.replace( `-`, `_` );
}

/**
 * Check whether there is a locale for the detected language.
 *
 * @param {string} languageCode - en-US, en, ru
 * @return {boolean}
 */

function isSupported( languageCode ) {
  return LOCALES.includes( languageCode );
}
