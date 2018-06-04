import { ApiAiClient } from 'api-ai-javascript';
import camelCase from 'camelcase';
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
          case 'search':
          case 'change-view':
          case 'sort':
          case 'refresh':
          case 'toggle':
          case 'help':
            executor[ camelCase( strIntentName ) ]( objParameters );

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
