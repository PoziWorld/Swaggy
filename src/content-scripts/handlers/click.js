import * as utils from 'Shared/utils';

/**
 * Trigger click/tap action on a card that has particular text in the caption or positioned at a certain place.
 *
 * @param {Object} parameters
 */

export function clickCard( parameters ) {
  let text = parameters[ 'element-text' ];
  const row = parameters[ 'element-position-row' ];
  const column = parameters[ 'element-position-column' ];
  // const tray = parameters[ 'element-position-tray' ];
  // const set = parameters[ 'element-position-set' ];

  // Allow targeting by card caption text or card position
  if ( utils.isNonEmptyString( text ) || ( utils.isNonEmptyString( row ) && utils.isNonEmptyString( column ) ) ) {
    if ( utils.isNonEmptyString( text ) ) {
      text = text.trim().toLowerCase();

      /**
       * @todo When support for other languages is added, find alternative to the translate function.
       */

      const cardsCaptions = document.evaluate(
        // Some cards' captions have links. Don't count caption and link separately.
        `.//
          *[
            contains( @class, 'sbTrayListItemHeaderCaption' ) and
            not( contains( @class, 'sbTrayListItemHeaderCaptionLink' ) ) and
            contains( translate( ., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz' ), '${ text }' )
          ]
        `,
        document.getElementById( 'sbContent' ),
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
      );
      let cardCaption = cardsCaptions.iterateNext();

      /**
       * @todo Account for the card position. For example, “click on the second Take this survey card” should skip the first one.
       */

      while ( cardCaption ) {
        if ( utils.isElementInViewport( cardCaption ) ) {
          cardCaption.closest( '.sbCard' ).click();

          break;
        }

        cardCaption = cardsCaptions.iterateNext();
      }
    }
  }
}
