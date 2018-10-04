import logger from 'Shared/logger';
import * as utils from 'Shared/utils';
import getUrl from 'Models/urls';

import * as clickHandler from './handlers/click';
import * as toggleHandler from './handlers/toggle';
import * as closeHandler from './handlers/close';

/**
 * Parameters for “navigate” intent.
 *
 * @typedef {Object} NavigationParameters
 * @property {string} [channel] - Channel of the site (The Homepage, Shop, Discover, Watch, Answer, Rewards, Swagstakes, Play, Search, Account)
 * @property {string} [category] - A particular category of the channel.
 * @property {string} [page] - A particular page of the site or channel.
 */

/**
 * Navigate to a different channel, category, or page of the site.
 *
 * @param {NavigationParameters} objParameters
 */

export function navigate( objParameters ) {
  logger.info( `nav: %j`, objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const channel = objParameters.channel;

    if ( utils.isNonEmptyString( channel ) ) {
      switch ( channel ) {
        case 'homepage':
        case 'shop':
        case 'discover':
        case 'watch':
        case 'answer':
        case 'rewards':
        case 'swagstakes':
        case 'play':
        case 'search':
        case 'account':
        {
          navigateToChannel( channel, objParameters );

          break;
        }
      }
    }
    else {
      const page = objParameters.page;

      if ( utils.isNonEmptyString( page ) ) {
        navigateToPage( page );
      }
    }
  }
}

/**
 * Search on Web, Shop, Rewards Store, Swagstakes.
 *
 * @param {Object} objParameters
 */

export function search( objParameters ) {
  logger.info( `search: %j`, objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const searchType = objParameters[ 'search-type' ];
    const searchTerm = objParameters[ 'search-term' ];

    if ( utils.isNonEmptyString( searchType ) && utils.isNonEmptyString( searchTerm ) ) {
      switch ( searchType ) {
        case 'web':
        {
          navigateToUrl( getUrl( `SEARCH_WEB` ).replace( `%s`, encodeURIComponent( searchTerm ) ) );

          break;
        }
        case 'shop':
        case 'rewards':
        case 'swagstakes':
        {
          navigateToUrl( getUrl( `${ searchType }_SEARCH` ).replace( `%s`, encodeURIComponent( searchTerm ) ) );

          break;
        }
      }
    }
  }
}

/**
 * Trigger click/tap action on a card, call-to-action, logo, etc.
 *
 * @param {Object} parameters
 */

export function click( parameters ) {
  logger.info( `click: %j`, parameters );

  if ( utils.isNonEmptyObject( parameters ) ) {
    const pageElement = parameters[ 'clickable-page-element' ];

    if ( utils.isNonEmptyString( pageElement ) ) {
      switch ( pageElement ) {
        case 'card':
        {
          clickHandler.clickCard( parameters );

          break;
        }
      }
    }
  }
}

/**
 * Switch between the card and list view.
 *
 * @param {Object} objParameters
 */

export function changeView( objParameters ) {
  logger.info( `view: %j`, objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const view = objParameters.view;

    if ( utils.isNonEmptyString( view ) ) {
      switch ( view ) {
        case 'card':
        {
          document.getElementById( 'sbViewAsCardsCta' ).click();

          break;
        }
        case 'list':
        {
          document.getElementById( 'sbViewAsListCta' ).click();

          break;
        }
      }
    }
  }
}

/**
 * Sort the cards/offers.
 *
 * @param {Object} objParameters
 */

export function sort( objParameters ) {
  logger.info( `sort: %j`, objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const sort = objParameters.sort;

    if ( utils.isNonEmptyString( sort ) ) {
      let indexToSelect = -1;

      switch ( sort ) {
        case 'a-z':
        {
          indexToSelect = 8;

          break;
        }
        case 'z-a':
        {
          indexToSelect = 7;

          break;
        }
        case 'sb min-max':
        {
          indexToSelect = 2;

          break;
        }
        case 'sb max-min':
        {
          indexToSelect = 1;

          break;
        }
      }

      if ( indexToSelect > -1 ) {
        const $$sort = document.getElementById( 'sbShopSort' );

        $$sort.value = indexToSelect;
        $$sort.dispatchEvent( new CustomEvent( 'change' ) );
      }
    }
  }
}

/**
 * Refresh page or SB balance.
 *
 * @param {Object} objParameters
 */

export function refresh( objParameters ) {
  logger.info( `refresh: %j`, objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const pageElement = objParameters[ 'page-element' ];

    if ( utils.isNonEmptyString( pageElement ) ) {
      switch ( pageElement ) {
        case 'page':
        {
          navigateToUrl();

          break;
        }
        case 'balance':
        {
          const $$balanceContainer = document.getElementById( 'sbBalanceContainer' );

          $$balanceContainer.classList.add( 'active' );
          document.getElementById( 'sbBalanceRefresh' ).click();

          setTimeout( () => {
            $$balanceContainer.classList.remove( 'active' );
          }, 3000 );

          break;
        }
      }
    }
  }
}

/**
 * Toggle (show/hide) a page element.
 *
 * @param {Object} objParameters
 */

export function toggle( objParameters ) {
  logger.info( `toggle: %j`, objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const pageElement = objParameters[ 'page-element' ];

    if ( utils.isNonEmptyString( pageElement ) ) {
      switch ( pageElement ) {
        case 'swagcode':
        {
          toggleHandler.toggleSwagCodeWidget();

          break;
        }
      }
    }
  }
}

/**
 * Show the project homepage/readme.
 *
 * @param {Object} objParameters
 */

export function help( objParameters ) {
  logger.info( `help: %j`, objParameters );

  navigateToUrl( getUrl( `EXTENSION_HELP` ) );
}

/**
 * Close a page element (i.e., a modal) or a page (tab) itself.
 *
 * @param {Object} objParameters
 */

export function close( objParameters ) {
  logger.info( `close: %j`, objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const pageElement = objParameters[ 'closable-page-element' ];

    if ( utils.isNonEmptyString( pageElement ) ) {
      switch ( pageElement ) {
        case 'page':
        {
          closeHandler.closeTab();

          break;
        }
      }
    }
  }
}

/**
 * Go to a page or category of the specified channel.
 *
 * @param {NavigationParameters.channel} channel
 * @param {NavigationParameters} objParameters
 */

function navigateToChannel( channel, objParameters ) {
  const category = objParameters.category.toLowerCase();
  const page = objParameters.page;

  if ( category === '' && page === '' || page === 'homepage' || page === 'home' || page === 'main' ) {
    navigateToUrl( getUrl( `${ channel }_HOMEPAGE` ) );
  }
  else if ( utils.isNonEmptyString( channel ) ) {
    let linkName = `${ channel }`;

    if ( utils.isNonEmptyString( category ) ) {
      linkName += `_CATEGORY_${ category }`;
    }

    if ( utils.isNonEmptyString( page ) ) {
      linkName = `_${ page }`;
    }

    navigateToUrl( getUrl( linkName ) );
  }
}

/**
 * Go to a standalone page.
 *
 * @param {NavigationParameters.page} page
 */

function navigateToPage( page ) {
  const url = getUrl( page );

  if ( utils.isNonEmptyString( url ) ) {
    navigateToUrl( url );
  }
  else {
    const toPreviousPage = page === 'previous';

    if ( toPreviousPage || page === 'next' ) {
      window.history.go( toPreviousPage ? -1 : 1 );
    }
  }
}

/**
 * Navigate to the specified URL and prepend utm_source=swaggy.
 *
 * @param {string} [url]
 */

function navigateToUrl( url ) {
  if ( utils.isNonEmptyString( url ) ) {
    location.assign( utils.updateQueryString( 'utm_source', 'swaggy', url ) );
  }
}
