/**
 * Build browser-specific manifest.json files, as not all manifest.json keys are supported by all browsers.
 * Also, copy over some details from package.json. 
 *
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Browser_compatibility_for_manifest.json
 *
 * Inspired by https://stackoverflow.com/a/44249538
 */

const path = require( 'path' );
const fs = require( 'fs' );

module.exports = function ( source ) {
  const manifestJsonAsJs = JSON.parse( source );
  const packageJsonContents = fs.readFileSync( './package.json', 'utf8' );
  const packageJsonAsJs = JSON.parse( packageJsonContents );
  const newProperties = {
    version: packageJsonAsJs.version,
    author: packageJsonAsJs.author,
    homepage_url: packageJsonAsJs.homepage,
  };

  /**
   * See supportedBrowsers in webpack.config.js.
   *
   * @todo Find a cleaner way.
   */

  const browserName = path.basename( this._compiler.outputPath );

  switch ( browserName ) {
    case 'chromium':
    {
      newProperties.options_ui = {
        page: 'options.html',
        chrome_style: true,
      };

      break;
    }
    case 'firefox':
    {
      newProperties.applications = {
        gecko: {
          id: packageJsonAsJs.name + '@poziworld.com',
        }
      };
      newProperties.options_ui = {
        page: 'options.html',
        browser_style: true,
      };

      break;
    }
    case 'edge':
    {
      newProperties.applications = {
        gecko: {
          id: packageJsonAsJs.name + '@poziworld.com',
        }
      };
      newProperties.background.persistent = false;
      newProperties.options_page = 'options.html';

      break;
    }
  }

  const merged = Object.assign( {}, manifestJsonAsJs, newProperties );
  const mergedJson = JSON.stringify( merged );

  this.emitFile( 'manifest.json', mergedJson );

  return mergedJson;
};
