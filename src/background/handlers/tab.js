import browser from 'webextension-polyfill';

import logger from 'Shared/logger';
import * as utils from 'Shared/utils';

/**
 * Change the tab state.
 *
 * @param {boolean} open - Whether the tab should remain open or get closed.
 * @param {number} tabId - The ID of the tab.
 * @return {Promise<void>}
 */

export async function setTab( { data: { open }, tab: { id: tabId } } ) {
  logger.verbose( `setTab: %j, %j`, open, tabId );

  if ( utils.is( open, `boolean` ) && ! open ) {
    await closeTab( tabId );
  }
}

/**
 * Close the current page/tab.
 *
 * @param {number} tabId - The ID of the tab.
 */

async function closeTab( tabId ) {
  if ( ! utils.is( tabId, 'number' ) ) {
    logger.error( `closeTab: incorrect tab ID type: %j`, tabId );

    return;
  }

  try {
    browser.tabs.remove( tabId );
  }
  catch ( e ) {
    logger.debug( `closeTab: fail: %o`, e );
  }
}
