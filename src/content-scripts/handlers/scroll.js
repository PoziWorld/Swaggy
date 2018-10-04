/**
 * Scroll the current page/tab.
 * window is not scrollable, #sbContent is.
 *
 * @param {Object} parameters
 */

export function scrollPage( parameters ) {
  const element = document.getElementById( 'sbContent' );

  if ( element ) {
    let top = element.scrollTop;
    const scrollDirection = parameters[ 'page-scroll-direction' ];

    // Scroll by half of the page
    if ( scrollDirection === 'up' ) {
      top -= window.innerHeight / 2;
    }
    else {
      top += window.innerHeight / 2;
    }

    element.scrollTo( {
      behavior: 'smooth',
      top,
    } );
  }
}
