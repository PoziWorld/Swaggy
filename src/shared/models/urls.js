import { Map } from 'immutable';

import * as utils from 'Shared/utils';

const URL_QUERY = '%s';
const URLS = Map( {
  LOG_IN: '/p/login',
  SIGN_UP: '/p/register?rb=45597732',
  SIGN_UP_FULL: 'https://www.swagbucks.com/p/register?rb=45597732',

  // Channel-specific
  ACCOUNT_HOMEPAGE: '/account/settings',
  ANSWER_HOMEPAGE: '/surveys',
  ANSWER_DAILY_POLL: '/polls',
  DISCOVER_HOMEPAGE: '/discover',
  HOMEPAGE_HOMEPAGE: '/', // Will there be categories, pages for this channel?
  PLAY_HOMEPAGE: '/games',
  REWARDS_HOMEPAGE: '/rewards-store',
  REWARDS_SEARCH: `/p/category/-3?srt=5&src=${ URL_QUERY }`,
  SEARCH_HOMEPAGE: 'https://search.swagbucks.com/',
  SEARCH_WEB: `/?q=${ URL_QUERY }`,
  SHOP_HOMEPAGE: '/shop',
  SHOP_ALL_STORES: '/shop/all-stores-coupons/',
  SHOP_ALL_COUPONS: '/shop/allcoupons/online',
  SHOP_GROCERY_COUPONS: '/shop/allcoupons/grocery',
  SHOP_LOCAL: '/cashback',
  SHOP_IN_STORE: '/shop/in-store',
  SHOP_CATEGORY_SHOES: '/shop/stores/1/shoes',
  SHOP_SEARCH: `/shop/search/?shq=${ URL_QUERY }`,
  SHOP_COUPONS_SEARCH: `/shop/search?shq=${ URL_QUERY }&filter=2`,
  SHOP_INTERSTITIAL: `/g/shopredir?merchant=${ URL_QUERY }`,
  SWAGSTAKES_HOMEPAGE: '/swagstakes',
  SWAGSTAKES_SEARCH: `/s/category/-3?srt=5&src=${ URL_QUERY }`,
  WATCH_HOMEPAGE: '/watch',

  // Standalone pages
  ABOUT: '/g/about',
  INBOX: '/g/inbox',
  INVITE: '/invite',
  MOBILE: '/mobile',
  PRIVACY: 'https://www.prodege.com/privacy/',
  TERMS: 'https://www.prodege.com/terms/',
  SWAGBUTTON: '/swagbutton',

  // External
  EXTENSION_RATE_CHROMIUM: 'https://chrome.google.com/webstore/detail/swaggy-beta/beblcchllamebejoakjbhhajpmlkjoaf/reviews',
  EXTENSION_OPTIONS_CHROMIUM: 'chrome://extensions/?options=EXTENSION_ID',
  EXTENSION_HELP: 'https://goo.gl/forms/5eGwzGnhPOO6C3892',
  EXTENSION_COMMANDS: 'https://github.com/PoziWorld/Swaggy#supported-commands',
  EXTENSION_COMMANDS_EXAMPLES: 'https://github.com/PoziWorld/Swaggy#examples-of-what-you-can-say',
  EXTENSION_TRANSLATION_PORTAL: 'https://www.transifex.com/poziworld/swaggy/',
  EXTENSION_RELEASE_NOTES: 'https://github.com/PoziWorld/Swaggy/releases',

  // Sister projects
  PRINT_WASTE_MINIMIZER: 'https://printwasteminimizer.com',
  SCROLL_TO_TOP_BUTTON: 'https://scroll-to-top-button.com',
  POZIWORLD_ELF: 'https://github.com/PoziWorld/PoziWorld-Elf',
  POZITONE: 'https://pozitone.com',
} );

const SHOP_MERCHANT_IDS = Map( {
  AMAZON: 793,
  AMERICANEAGLE: 1875,
  BESTBUY: 10768,
  EBAY: 1635,
  EXPEDIA: 17,
  GAP: 323,
  GROUPON: 1234,
  MACYS: 135,
  OLDNAVY: 324,
  TARGET: 1637,
  WALMART: 183,
} );

/**
 * Find a URL by the link name.
 *
 * @param {string} linkName
 * @return {(string|boolean)}
 */

export default function getUrl( linkName ) {
  if ( utils.isNonEmptyString( linkName ) ) {
    return URLS.get( formatLinkName( linkName ) );
  }

  return false;
}

/**
 * Find a merchant website URL by the merchant name.
 *
 * @param {string} merchantName
 * @return {(string|boolean)}
 */

export function getMerchantUrl( merchantName ) {
  if ( utils.isNonEmptyString( merchantName ) ) {
    const merchantId = SHOP_MERCHANT_IDS.get( formatMerchantName( merchantName ) );

    if ( Number.isInteger( merchantId ) ) {
      return URLS.get( `SHOP_INTERSTITIAL` ).replace ( URL_QUERY, merchantId );
    }
  }

  return false;
}

/**
 * Convert text to URLS object property.
 *
 * @param {string} linkName
 * @return {string}
 */

function formatLinkName( linkName ) {
  return linkName.toUpperCase().replace( / /g, `_` );
}

/**
 * Normalize the merchant name by removing special characters and upper-casing the letters.
 *
 * @param {string} merchantName
 * @return {string}
 */

function formatMerchantName( merchantName ) {
  return merchantName.toUpperCase().replace( /(.com)|(\s)|([-_.'])/g, `` );
}
