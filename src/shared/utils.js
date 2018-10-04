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
 * @param {string} key - The query string key to add, remove, or update.
 * @param {string} [value] - The value for the key.
 * @param {string} [url=window.location.href] - The URL to modify.
 * @return {*}
 */

export function updateQueryString( key, value, url ) {
  if ( ! url ) {
    url = window.location.href;
  }

  const regex = new RegExp( '([?&])' + key + '=.*?(&|#|$)(.*)', 'gi' );
  let hash;

  if ( regex.test( url ) ) {
    if ( typeof value !== 'undefined' && value !== null ) {
      return url.replace( regex, '$1' + key + '=' + value + '$2$3' );
    }
    else {
      hash = url.split( '#' );
      url = hash[ 0 ].replace( regex, '$1$3' ).replace( /(&|\?)$/, '' );
      let hashValue = hash[ 1 ];

      if ( typeof hashValue !== 'undefined' && hashValue !== null ) {
        url += '#' + hashValue;
      }

      return url;
    }
  }
  else {
    if ( typeof value !== 'undefined' && value !== null ) {
      const separator = url.indexOf( '?' ) !== -1 ? '&' : '?';
      hash = url.split( '#' );
      url = hash[ 0 ] + separator + key + '=' + value;
      let hashValue = hash[ 1 ];

      if ( typeof hashValue !== 'undefined' && hashValue !== null ) {
        url += '#' + hashValue;
      }

      return url;
    }
    else {
      return url;
    }
  }
}

/**
 * Check whether the element is on the currently visible part of the page.
 *
 * Source: https://stackoverflow.com/a/7557433
 *
 * @param {HTMLElement} element
 * @return {boolean}
 */

export function isElementInViewport( element ) {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= ( window.innerHeight || document.documentElement.clientHeight ) &&
    rect.right <= ( window.innerWidth || document.documentElement.clientWidth )
  );
}
