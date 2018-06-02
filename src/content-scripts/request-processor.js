import { ApiAiClient } from 'api-ai-javascript';
import * as executor from './request-executor';
import * as utils from '../shared/utils';

import { ACCESS_TOKEN_DEVELOPMENT, ACCESS_TOKEN_PRODUCTION } from '../.privateaccesstoken.js';

export const processor = new ApiAiClient( {
  accessToken: process.env.NODE_ENV === 'development' ? ACCESS_TOKEN_DEVELOPMENT : ACCESS_TOKEN_PRODUCTION,
} );

/**
 * Identify the intent.
 *
 * @param {Object} objResponse
 */

export function processResponse( objResponse ) {
  console.log( 'processResponse', objResponse );

  if ( utils.isNonEmptyObject( objResponse ) ) {
    const objResult = objResponse.result;

    if ( utils.isNonEmptyObject( objResult ) ) {
      const objMetadata = objResult.metadata;

      if ( utils.isNonEmptyObject( objMetadata ) ) {
        const strIntentName = objMetadata.intentName;
        const objParameters = objResult.parameters;

        switch ( strIntentName ) {
          case 'navigate':
            executor.navigate( objParameters );

            break;
          case 'search':
            executor.search( objParameters );

            break;
          case 'change-view':
            executor.changeView( objParameters );

            break;
          case 'sort':
            executor.sort( objParameters );

            break;
          case 'refresh':
            executor.refresh( objParameters );

            break;
          case 'toggle':
            executor.toggle( objParameters );

            break;
        }
      }
    }
  }
}

/**
 *
 * @todo
 * @param {Object} objError
 */

export function processError( objError ) {

}
