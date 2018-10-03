import browser from 'webextension-polyfill';

import logger from 'Shared/logger';
import { queries } from 'Shared/messaging';

/**
 * Close the current page/tab.
 */

export async function closeTab() {
  try {
    const response = await browser.runtime.sendMessage( {
      apiRequest: {
        query: queries.tab.mutation,
        data: {
          open: false,
        },
      },
    } );

    logger.verbose( `closeTab: %j`, response );
  }
  catch ( e ) {
    /**
     * @todo
     */
  }
}
