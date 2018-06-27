import { List } from 'immutable';

/**
 * https://github.com/TalAter/annyang/blob/master/docs/FAQ.md#what-languages-are-supported
 *
 * @type {Immutable.List<string>}
 */

const VOICE_CONTROL_LANGUAGES = List( [
  'en-US',
] );

export default VOICE_CONTROL_LANGUAGES;

/**
 * https://github.com/TalAter/annyang/blob/master/docs/README.md#setlanguagelanguage
 *
 * @type {string}
 */

export const DEFAULT_VOICE_CONTROL_LANGUAGE = VOICE_CONTROL_LANGUAGES.get( 0 );
