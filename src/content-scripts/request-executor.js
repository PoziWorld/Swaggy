import logger from 'Shared/logger';
import * as utils from 'Shared/utils';
import HREFS from 'Models/hrefs';

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
    const strChannel = objParameters.channel;

    if ( utils.isNonEmptyString( strChannel ) ) {
      switch ( strChannel ) {
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
          navigateToChannel( strChannel, objParameters );

          break;
        }
      }
    }
    else {
      const strPage = objParameters.page;

      if ( utils.isNonEmptyString( strPage ) ) {
        navigateToPage( strPage );
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
  logger.info( `search: %%j`, objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const strSearchType = objParameters[ 'search-type' ];
    const strSearchTerm = objParameters[ 'search-term' ];

    if ( utils.isNonEmptyString( strSearchType ) && utils.isNonEmptyString( strSearchTerm ) ) {
      switch ( strSearchType ) {
        case 'web':
        {
          navigateToUrl( HREFS.get( `SEARCH_WEB_PREFIX` ) + encodeURIComponent( strSearchTerm ) );

          break;
        }
        case 'shop':
        case 'rewards':
        case 'swagstakes':
        {
          navigateToUrl( HREFS.get( `${ strSearchType.toUpperCase() }_SEARCH_PREFIX` ) + encodeURIComponent( strSearchTerm ) );

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
  logger.info( `view: %%j`, objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const strView = objParameters.view;

    if ( utils.isNonEmptyString( strView ) ) {
      switch ( strView ) {
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
  logger.info( `sort: %%j`, objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const strSort = objParameters.sort;

    if ( utils.isNonEmptyString( strSort ) ) {
      let intIndexToSelect = -1;

      switch ( strSort ) {
        case 'a-z':
        {
          intIndexToSelect = 8;

          break;
        }
        case 'z-a':
        {
          intIndexToSelect = 7;

          break;
        }
        case 'sb min-max':
        {
          intIndexToSelect = 2;

          break;
        }
        case 'sb max-min':
        {
          intIndexToSelect = 1;

          break;
        }
      }

      if ( intIndexToSelect > -1 ) {
        const $$sort = document.getElementById( 'sbShopSort' );

        $$sort.value = intIndexToSelect;
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
  logger.info( `refresh: %%j`, objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const strPageElement = objParameters[ 'page-element' ];

    if ( utils.isNonEmptyString( strPageElement ) ) {
      switch ( strPageElement ) {
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
  logger.info( `toggle: %%j`, objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const strPageElement = objParameters[ 'page-element' ];

    if ( utils.isNonEmptyString( strPageElement ) ) {
      switch ( strPageElement ) {
        case 'swagcode':
        {
          const boolIsShown = $( '#sbGlobalNavSwagCodeDropdown' ).is( ':visible' );

          $( '#sbSwagCodeContainer' ).trigger( boolIsShown ? 'mouseout' : 'mouseover' );

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
  logger.info( `help: %%j`, objParameters );

  navigateToUrl( HREFS.get( `EXTENSION_HELP` ) );
}

/**
 * Go to a page or category of the specified channel.
 *
 * @param {NavigationParameters.channel} strChannel
 * @param {NavigationParameters} objParameters
 */

function navigateToChannel( strChannel, objParameters ) {
  const strCategory = objParameters.category.toLowerCase();
  const strPage = objParameters.page;

  if ( strCategory === '' && strPage === '' || strPage === 'homepage' || strPage === 'home' || strPage === 'main' ) {
    navigateToUrl( HREFS.get( `${ strChannel.toUpperCase() }_HOMEPAGE` ) );
  }
  else if ( strChannel === 'shop' ) {
    if ( strCategory === 'shoes' ) {
      navigateToUrl( HREFS.get( `SHOP_CATEGORY_SHOES` ) );
    }
  }
}

/**
 * Go to a standalone page.
 *
 * @param {NavigationParameters.page} strPage
 */

function navigateToPage( strPage ) {
  const strHref = HREFS.get( strPage.toUpperCase() );

  if ( utils.isNonEmptyString( strHref ) ) {
    navigateToUrl( strHref );
  }
  else {
    const boolGoToPreviousPage = strPage === 'previous';

    if ( boolGoToPreviousPage || strPage === 'next' ) {
      window.history.go( boolGoToPreviousPage ? -1 : 1 );
    }
  }
}

/**
 * Navigate to the specified URL and prepend utm_source=swaggy.
 *
 * @param {string} [strUrl]
 */

function navigateToUrl( strUrl ) {
  location.assign( utils.updateQueryString( 'utm_source', 'swaggy', strUrl ) );
}
