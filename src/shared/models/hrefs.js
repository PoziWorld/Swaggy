import { Map } from 'immutable';

const HREFS = Map( {
  // Channel-specific
  ACCOUNT_HOMEPAGE: '/account/settings',
  ANSWER_HOMEPAGE: '/surveys',
  DISCOVER_HOMEPAGE: '/discover',
  HOMEPAGE_HOMEPAGE: '/', // Will there be categories, pages for this channel?
  PLAY_HOMEPAGE: '/games',
  REWARDS_HOMEPAGE: '/rewards-store',
  REWARDS_SEARCH_PREFIX: '/p/category/-3?srt=5&src=',
  SEARCH_HOMEPAGE: 'https://search.swagbucks.com/',
  SEARCH_WEB_PREFIX: '/?q=',
  SHOP_HOMEPAGE: '/shop',
  SHOP_CATEGORY_SHOES: '/shop/stores/1/shoes',
  SHOP_SEARCH_PREFIX: '/shop/search/?shq=',
  SWAGSTAKES_HOMEPAGE: '/swagstakes',
  SWAGSTAKES_SEARCH_PREFIX: '/s/category/-3?srt=5&src=',
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
  EXTENSION_HELP: 'https://github.com/PoziWorld/Swaggy',
  EXTENSION_COMMANDS: 'https://github.com/PoziWorld/Swaggy#supported-commands',
  EXTENSION_COMMANDS_EXAMPLES: 'https://github.com/PoziWorld/Swaggy#examples-of-what-you-can-say',
} );

export default HREFS;
