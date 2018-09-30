import * as utils from 'Shared/utils';

/**
 * Toggle (show/hide) the Swag Code widget.
 */

export function toggleSwagCodeWidget() {
  const event = document.createEvent( 'Events' );
  const eventName = isVisible( '#sbGlobalNavSwagCodeDropdown' ) ? 'mouseout' : 'mouseover'; 

  event.initEvent( eventName, true, false );
  document.getElementById( 'sbSwagCodeContainer' ).dispatchEvent( event );
}

/**
 * Check whether the element identified by the provided selector is visible on the screen.
 *
 * @param {string} selector - CSS selector
 * @return {boolean}
 */

function isVisible( selector ) {
  if ( utils.isNonEmptyString( selector ) ) {
    const element = document.querySelector( selector );

    if ( document.contains( element ) && element.offsetHeight ) {
      return true;
    }
  }

  return false;
}
