import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLBoolean } from 'graphql';

import logger from 'Shared/logger';
import { getStorageItem, setStorageItem } from 'Models/storage';

/**
 * Default listener data object in the format suited for the shared nature of the Storage:
 * Since the Storage can be used to store other things, wrap the listener data into its own object.
 *
 * @typedef {Object} ListenerWrapped
 * @property {Object} listener
 * @property {boolean} listener.autostart
 */

/**
 * @type {ListenerWrapped}
 */

const defaultListener = {
  listener: {
    autostart: false,
    listening: false,
  },
};

/**
 * Listener queryable and mutable with GraphQL.
 */

const ListenerType = new GraphQLObjectType( {
  name: 'Listener',
  fields: () => ( {
    autostart: {
      type: GraphQLBoolean,
    },
    listening: {
      type: GraphQLBoolean,
    },
  } ),
} );

const schema = new GraphQLSchema( {
  query: new GraphQLObjectType( {
    name: 'RootQueryType',
    fields: () => ( {
      listener: {
        type: ListenerType,
        resolve: () => getStorageItem( `listener` ),
      },
    } ),
  } ),
  mutation: new GraphQLObjectType( {
    name: 'RootMutationType',
    fields: () => ( {
      listener: {
        type: ListenerType,
        resolve: ( options ) => setStorageItem( `listener`, options ),
      },
    } ),
  } ),
} );

/**
 * Query used to retrieve (SELECT) the listener data.
 */

const queryToGet = `{
  listener {
    autostart
    listening
  }
}`;

/**
 * Query used to save (INSERT, UPDATE) the listener data.
 */

const queryToSet = `mutation {
  listener {
    autostart
    listening
  }
}`;

/**
 * Retrieve (SELECT) the stored listener data.
 *
 * @return {Promise<ListenerWrapped.listener>}
 */

export async function getListener() {
  try {
    const { data: { listener } } = await graphql( schema, queryToGet );

    return listener;
  }
  catch ( e ) {
    /**
     * @todo
     */
  }
}

/**
 * Save (INSERT, UPDATE) the listener data.
 *
 * @param {ListenerWrapped} listenerWrapped
 * @return {Promise<ListenerWrapped|boolean>}
 */

export async function setListener( listenerWrapped ) {
  logger.verbose( `setListener: %j`, listenerWrapped );

  try {
    const { data: newSavedListenerWrapped } = await graphql( schema, queryToSet, listenerWrapped );
    logger.verbose( `setListener: result: %j`, newSavedListenerWrapped );

    return newSavedListenerWrapped;
  }
  catch ( e ) {
    logger.debug( `setListener: fail: %j`, e );

    return false;
  }
}

/**
 * Apply the default listener.
 *
 * @return {Promise<ListenerWrapped|boolean>}
 */

export async function setDefaultListener() {
  logger.verbose( `setDefaultListener` );

  try {
    const newSavedListenerWrapped = await setListener( defaultListener );
    logger.verbose( `setDefaultListener: result: %j`, newSavedListenerWrapped );

    return newSavedListenerWrapped;
  }
  catch ( e ) {
    logger.debug( `setDefaultListener: fail: %j`, e );

    return false;
  }
}
