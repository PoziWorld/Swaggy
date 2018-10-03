import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLBoolean } from 'graphql';

import logger from 'Shared/logger';
import * as utils from 'Shared/utils';
import * as backgroundHandlers from 'Background/messaging';
import { switchVoiceControlListener } from 'ContentScripts/messaging';

/**
 * Cross-script (background, content scripts, browser action, options) API queryable and mutable with GraphQL.
 */

const BrowserActionType = new GraphQLObjectType( {
  name: 'BrowserAction',
  fields: () => ( {
    listening: {
      type: GraphQLBoolean,
    },
  } ),
} );

const VoiceControlListenerType = new GraphQLObjectType( {
  name: 'VoiceControlListener',
  fields: () => ( {
    listening: {
      type: GraphQLBoolean,
    },
  } ),
} );

const TabType = new GraphQLObjectType( {
  name: 'Tab',
  fields: () => ( {
    open: {
      type: GraphQLBoolean,
    },
  } ),
} );

const schema = new GraphQLSchema( {
  query: new GraphQLObjectType( {
    name: 'RootQueryType',
    fields: () => ( {
      browserAction: {
        type: BrowserActionType,
      },
      voiceControlListener: {
        type: VoiceControlListenerType,
      },
      tab: {
        type: TabType,
      },
    } ),
  } ),
  mutation: new GraphQLObjectType( {
    name: 'RootMutationType',
    fields: () => ( {
      browserAction: {
        type: BrowserActionType,
        resolve: ( options ) => backgroundHandlers.setBrowserAction( options ),
      },
      voiceControlListener: {
        type: VoiceControlListenerType,
        resolve: ( options ) => switchVoiceControlListener( options ),
      },
      tab: {
        type: TabType,
        resolve: ( options ) => backgroundHandlers.setTab( options ),
      },
    } ),
  } ),
} );

/**
 * Queries used to save (INSERT, UPDATE) the browser action and voice control listener state.
 */

export const queries = {
  browserAction: {
    mutation: `mutation {
      browserAction {
        listening
      }
    }`,
  },
  voiceControlListener: {
    mutation: `mutation {
      voiceControlListener {
        listening
      }
    }`,
  },
  tab: {
    mutation: `mutation {
      tab {
        open
      }
    }`,
  },
};

/**
 * Listen for messages from other parts of the extension.
 *
 * @param {Object} apiRequest
 * @param {string} apiRequest.query - The GraphQL query to execute.
 * @param {Object} [apiRequest.data] - Mutation parameters.
 * @param {Object} tab
 * @return {Promise<void>}
 */

export async function handleOnMessageEvent( { apiRequest }, { tab } ) {
  logger.verbose( `handleOnMessageEvent: %j, %j`, apiRequest, tab );

  if ( utils.isNonEmptyObject( apiRequest ) ) {
    try {
      await handleApiRequest( apiRequest, tab );
    }
    catch ( e ) {
      /**
       * @todo
       */
    }
  }
}

/**
 * If the received message is an API request, execute the specified query with optional parameters against the specified tab.
 *
 * @param {string} query - The GraphQL query to execute.
 * @param {Object} [data] - Mutation parameters.
 * @param {Object} tab
 */

export async function handleApiRequest( { query, data }, tab ) {
  logger.verbose( `handleApiRequest: %s, %j, %j`, query, data, tab );

  if ( utils.isNonEmptyString( query ) ) {
    try {
      await graphql( schema, query, { data, tab } );
    }
    catch ( e ) {
      /**
       * @todo
       */
    }
  }
}
