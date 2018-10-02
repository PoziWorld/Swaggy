import { ApiAiClient } from 'api-ai-javascript';
import camelCase from 'camelcase';

import logger from 'Shared/logger';
import * as utils from 'Shared/utils';

import * as executor from './request-executor';

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
  logger.verbose( `processResponse: %j`, objResponse );

  if ( utils.isNonEmptyObject( objResponse ) ) {
    const objResult = objResponse.result;

    if ( utils.isNonEmptyObject( objResult ) ) {
      const objMetadata = objResult.metadata;

      if ( utils.isNonEmptyObject( objMetadata ) ) {
        const intentName = objMetadata.intentName;
        const objParameters = objResult.parameters;

        switch ( intentName ) {
          case 'navigate':
          case 'search':
          case 'change-view':
          case 'sort':
          case 'refresh':
          case 'toggle':
          case 'help':
          case 'close':
          {
            executor[ camelCase( intentName ) ]( objParameters );

            break;
          }
        }
      }
    }
  }
}

/**
 * On text-to-intent API failure.
 *
 * @param {Object} objError
 */

export function processError( objError ) {
  logger.error( objError );
}
