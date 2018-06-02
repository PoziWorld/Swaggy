import * as utils from '../shared/utils';

/**
 *
 * @typedef {Object} Parameters
 * @property {string} [channel] - Channel of the site (The Homepage, Shop, Discover, Watch, Answer, Rewards, Swagstakes, Search)
 * @property {string} [category] - A particular category of the channel.
 * @property {string} [page] - A particular page of the site or channel.
 */

/**
 * Navigate to a different channel, category, or page of the site.
 *
 * @param {Parameters} objParameters
 */

export function navigate( objParameters ) {
  console.log( 'nav', objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const strChannel = objParameters.channel;

    if ( utils.isNonEmptyString( strChannel ) ) {
      switch ( strChannel ) {
        case 'homepage':
          navigateToHomepage();

          break;
        case 'shop':
          navigateToShop( objParameters );

          break;
      }
    }
  }
}

/**
 * Search on Web, Shop, Rewards Store, Swagstakes.
 *
 * @param {Parameters} objParameters
 */

export function search( objParameters ) {
  console.log( 'search', objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const strSearchType = objParameters[ 'search-type' ];
    const strSearchTerm = objParameters[ 'search-term' ];

    if ( utils.isNonEmptyString( strSearchType ) && utils.isNonEmptyString( strSearchTerm ) ) {
      switch ( strSearchType ) {
        case 'web':
          navigateToUrl( '/?q=' + encodeURIComponent( strSearchTerm ) );

          break;
        case 'shop':
          navigateToUrl( '/shop/search/?shq=' + encodeURIComponent( strSearchTerm ) );

          break;
      }
    }
  }
}

/**
 * Switch between the card and list view.
 *
 * @param {Parameters} objParameters
 */

export function changeView( objParameters ) {
  console.log( 'view', objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const strView = objParameters.view;

    if ( utils.isNonEmptyString( strView ) ) {
      switch ( strView ) {
        case 'card':
          document.getElementById( 'sbViewAsCardsCta' ).click();

          break;
        case 'list':
          document.getElementById( 'sbViewAsListCta' ).click();

          break;
      }
    }
  }
}

/**
 * Sort the cards/offers.
 *
 * @param {Parameters} objParameters
 */

export function sort( objParameters ) {
  console.log( 'sort', objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const strSort = objParameters.sort;

    if ( utils.isNonEmptyString( strSort ) ) {
      let intIndexToSelect = -1;

      switch ( strSort ) {
        case 'a-z':
          intIndexToSelect = 8;

          break;
        case 'z-a':
          intIndexToSelect = 7;

          break;
        case 'sb min-max':
          intIndexToSelect = 2;

          break;
        case 'sb max-min':
          intIndexToSelect = 1;

          break;
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
 * @param {Parameters} objParameters
 */

export function refresh( objParameters ) {
  console.log( 'refresh', objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const strPageElement = objParameters[ 'page-element' ];

    if ( utils.isNonEmptyString( strPageElement ) ) {
      switch ( strPageElement ) {
        case 'page':
          navigateToUrl();

          break;
        case 'balance':
          const $$balanceContainer = document.getElementById( 'sbBalanceContainer' );

          $$balanceContainer.classList.add( 'active' );
          document.getElementById( 'sbBalanceRefresh' ).click();

          setTimeout( function () {
            $$balanceContainer.classList.remove( 'active' );
          }, 3000 );

          break;
      }
    }
  }
}

/**
 * Toggle (show/hide) a page element.
 *
 * @param {Parameters} objParameters
 */

export function toggle( objParameters ) {
  console.log( 'toggle', objParameters );

  if ( utils.isNonEmptyObject( objParameters ) ) {
    const strPageElement = objParameters[ 'page-element' ];

    if ( utils.isNonEmptyString( strPageElement ) ) {
      switch ( strPageElement ) {
        case 'swagcode':
          const boolIsShown = $( '#sbGlobalNavSwagCodeDropdown' ).is( ':visible' );

          $( '#sbSwagCodeContainer' ).trigger( boolIsShown ? 'mouseout' : 'mouseover' );

          break;
      }
    }
  }
}

/**
 * Go to the Homepage.
 */

function navigateToHomepage() {
  navigateToUrl( '/' );
}

/**
 * Go to a page or category of the Shop channel.
 *
 * @param {Parameters} objParameters
 */

function navigateToShop( objParameters ) {
  const strCategory = objParameters.category.toLowerCase();
  const strPage = objParameters.page;

  if ( strCategory === '' && strPage === '' || strPage === 'homepage' || strPage === 'home' || strPage === 'main' ) {
    navigateToUrl( '/shop' );
  }
  else if ( strCategory === 'shoes' ) {
    navigateToUrl( '/shop/stores/1/shoes' );
  }
}

/**
 * Navigate to the specified URL and prepend utm_source=swagger.
 *
 * @param {string} [strUrl]
 */

function navigateToUrl( strUrl ) {
  location.assign( utils.updateQueryString( 'utm_source', 'swagger', strUrl ) );
}
