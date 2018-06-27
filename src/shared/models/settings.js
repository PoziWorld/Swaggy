import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';

import logger from 'Shared/logger';
import { getSettings as getSettingsFromStorage, setSettings as setSettingsInStorage } from 'Models/storage';
import HOTWORDS, { DEFAULT_HOTWORD } from 'Models/hotwords';
import VOICE_CONTROL_LANGUAGES, { DEFAULT_VOICE_CONTROL_LANGUAGE } from 'Models/voice-control-languages';

export const SETTINGS_INTRODUCED_VERSION = '0.4.0';

/**
 * Default settings object in the format suited for the shared nature of the Storage:
 * Since the Storage can be used to store other things, wrap the settings into its own object.
 *
 * Groups of settings:
 * - Extension (not yet created)
 * - Voice control
 *
 * @typedef {Object} SettingsWrapped
 * @param {Object} settings
 * @param {Object} settings.voiceControl
 * @param {Object} settings.voiceControl.language
 * @param {Object} settings.voiceControl.hotword
 */

/**
 * @type {SettingsWrapped}
 */

const defaultSettings = {
  settings: {
    voiceControl: {
      language: DEFAULT_VOICE_CONTROL_LANGUAGE,
      hotword: DEFAULT_HOTWORD,
    },
  },
};

/**
 * For props checks in React components.
 */

export const voiceControlSettingsShape = {
  language: PropTypes.string.isRequired,
  hotword: PropTypes.string.isRequired,
};

export const settingsShape = {
  voiceControl: PropTypes.shape( voiceControlSettingsShape ).isRequired,
};

/**
 * Settings and their corresponding data (localization keys, available options) helpful for rendering.
 *
 * @type {Immutable.Map<string, Object[]>}
 */

export const settingsToViewProperties = Map( {
  voiceControl: [
    {
      settingName: 'language',
      i18nKey: 'voiceControlSettingsLanguage',
      optionsList: VOICE_CONTROL_LANGUAGES,
    },
    {
      settingName: 'hotword',
      i18nKey: 'voiceControlSettingsHotword',
      optionsList: HOTWORDS,
    },
  ],
} );

/**
 * For props checks in React components.
 */

export const voiceControlViewPropertiesShape = {
  settingName: PropTypes.string,
  i18nKey: PropTypes.string,
  optionsList: PropTypes.instanceOf( List ),
};

/**
 * Settings queryable and mutable with GraphQL.
 */

const VoiceControlSettingsType = new GraphQLObjectType( {
  name: 'VoiceControl',
  fields: {
    language: {
      type: GraphQLString,
    },
    hotword: {
      type: GraphQLString,
    },
  },
} );

const SettingsType = new GraphQLObjectType( {
  name: 'Settings',
  fields: () => ( {
    voiceControl: {
      type: VoiceControlSettingsType,
    },
  } ),
} );

const schema = new GraphQLSchema( {
  query: new GraphQLObjectType( {
    name: 'RootQueryType',
    fields: () => ( {
      settings: {
        type: SettingsType,
        resolve() {
          return getSettingsFromStorage();
        },
      },
    } ),
  } ),
  mutation: new GraphQLObjectType( {
    name: 'RootMutationType',
    fields: () => ( {
      settings: {
        type: SettingsType,
        async resolve( settingsWrapped ) {
          await setSettingsInStorage( settingsWrapped );

          return getSettingsFromStorage();
        },
      },
    } ),
  } ),
} );

/**
 * Query used to retrieve (SELECT) the settings.
 */

const queryToGet = `{
  settings {
    voiceControl {
      language
      hotword
    }
  }
}`;

/**
 * Query used to save (INSERT, UPDATE) the settings.
 */

const queryToSet = `mutation {
  settings {
    voiceControl {
      language
      hotword
    }
  }
}`;

/**
 * Retrieve (SELECT) the stored settings.
 *
 * @return {Promise<SettingsWrapped.settings>}
 */

export async function getSettings() {
  try {
    const { data: { settings } } = await graphql( schema, queryToGet );

    return settings;
  }
  catch ( e ) {
    /**
     * @todo
     */
  }
}

/**
 * Save (INSERT, UPDATE) the settings.
 *
 * @param {SettingsWrapped} settingsWrapped
 * @return {Promise<SettingsWrapped|boolean>}
 */

export async function setSettings( settingsWrapped ) {
  logger.verbose( `setSettings: %j`, settingsWrapped );

  try {
    const { data: newSavedSettingsWrapped } = await graphql( schema, queryToSet, settingsWrapped );
    logger.verbose( `setSettings: result: %j`, newSavedSettingsWrapped );

    return newSavedSettingsWrapped;
  }
  catch ( e ) {
    logger.debug( `setSettings: fail: %j`, e );

    return false;
  }
}

/**
 * Apply the default settings.
 *
 * @return {Promise<SettingsWrapped|boolean>}
 */

export async function setDefaultSettings() {
  logger.verbose( `setDefaultSettings` );

  try {
    const newSavedSettingsWrapped = await setSettings( defaultSettings );
    logger.verbose( `setDefaultSettings: result: %j`, newSavedSettingsWrapped );

    return newSavedSettingsWrapped;
  }
  catch ( e ) {
    logger.debug( `setDefaultSettings: fail: %j`, e );

    return false;
  }
}
