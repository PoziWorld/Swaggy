import { Map } from 'immutable';

import * as utils from 'Shared/utils';

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
  REWARDS_SEARCH: '/p/category/-3?srt=5&src=%s',
  SEARCH_HOMEPAGE: 'https://search.swagbucks.com/',
  SEARCH_WEB: '/?q=%s',
  SHOP_HOMEPAGE: '/shop',
  SHOP_ALL_STORES: '/shop/all-stores-coupons/',
  SHOP_ALL_COUPONS: '/shop/allcoupons/online',
  SHOP_GROCERY_COUPONS: '/shop/allcoupons/grocery',
  SHOP_LOCAL: '/cashback',
  SHOP_IN_STORE: '/shop/in-store',
  SHOP_CATEGORY_SHOES: '/shop/stores/1/shoes',
  SHOP_SEARCH: '/shop/search/?shq=%s',
  SHOP_COUPONS_SEARCH: '/shop/search?shq=%s&filter=2',
  SWAGSTAKES_HOMEPAGE: '/swagstakes',
  SWAGSTAKES_SEARCH: '/s/category/-3?srt=5&src=%s',
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
 * Convert text to URLS object property.
 *
 * @param {string} linkName
 * @return {string}
 */

function formatLinkName( linkName ) {
  return linkName.toUpperCase().replace( / /g, `_` );
}
