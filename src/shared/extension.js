import browser from 'webextension-polyfill';

/**
 * Get the complete manifest.json file, serialized to a JSON object.
 *
 * @type {Object} - A JSON object representing the manifest.
 */

const extension = browser.runtime.getManifest();

/**
 * Return the version of the extension, formatted as numbers and ASCII characters separated by dots.
 *
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json/version
 *
 * @return {string}
 */

export function getVersion() {
  return extension.version;
}
