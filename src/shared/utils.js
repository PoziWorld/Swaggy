/**
 * Check whether localStorage is available and accessible.
 *
 * @return {boolean}
 */

export function isStorageAccessible() {
  const test = 'test';

  try {
    localStorage.setItem( test, test );
    localStorage.removeItem( test );

    return true;
  }
  catch (e) {
    return false;
  }
}

/**
 * Check whether the provided value is of 'string' type and non-empty.
 *
 * @param {*} value
 * @return {boolean}
 */

export function isNonEmptyString( value ) {
  return is( value, 'string' ) && value !== '';
}

/**
 * Check whether the provided value is of 'object' type and non-empty.
 *
 * @param {*} value
 * @return {boolean}
 */

export function isNonEmptyObject( value ) {
  return is( value, 'object' ) && ~~ Object.keys( value ).length;
}

/**
 * Check whether the provided value is of the required type.
 *
 * @param {*} value
 * @param {string} type - 'string', 'number', 'boolean', 'object'.
 * @return {boolean}
 */
export function is( value, type ) {
  return Object.prototype.toString.call( value ).slice( 8, -1 ).toLowerCase() === type;
}

/**
 * Add, remove, or update a query string parameter.
 * https://stackoverflow.com/a/11654596
 *
 * @param {string} strKey - The query string key to add, remove, or update.
 * @param {string} [strValue] - The value for the key.
 * @param {string} [strUrl=window.location.href] - The URL to modify.
 * @return {*}
 */

export function updateQueryString( strKey, strValue, strUrl ) {
  if ( ! strUrl ) {
    strUrl = window.location.href;
  }

  const regex = new RegExp( '([?&])' + strKey + '=.*?(&|#|$)(.*)', 'gi' );
  let strHash;

  if ( regex.test( strUrl ) ) {
    if ( typeof strValue !== 'undefined' && strValue !== null ) {
      return strUrl.replace( regex, '$1' + strKey + '=' + strValue + '$2$3' );
    }
    else {
      strHash = strUrl.split( '#' );
      strUrl = strHash[ 0 ].replace( regex, '$1$3' ).replace( /(&|\?)$/, '' );
      let strHashValue = strHash[ 1 ];

      if ( typeof strHashValue !== 'undefined' && strHashValue !== null ) {
        strUrl += '#' + strHashValue;
      }

      return strUrl;
    }
  }
  else {
    if ( typeof strValue !== 'undefined' && strValue !== null ) {
      const strSeparator = strUrl.indexOf( '?' ) !== -1 ? '&' : '?';
      strHash = strUrl.split( '#' );
      strUrl = strHash[ 0 ] + strSeparator + strKey + '=' + strValue;
      let strHashValue = strHash[ 1 ];

      if ( typeof strHashValue !== 'undefined' && strHashValue !== null ) {
        strUrl += '#' + strHashValue;
      }

      return strUrl;
    }
    else {
      return strUrl;
    }
  }
}
