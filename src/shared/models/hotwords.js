import { List } from 'immutable';

/**
 * https://github.com/TalAter/annyang/blob/master/docs/README.md#commands-object
 *
 * @todo Add support for hotwords in other languages.
 *
 * @type {Immutable.List<string>}
 */

const HOTWORDS = List( [
  '',
  'hey swaggy',
  'hey swagbucks',
] );

export default HOTWORDS;

/**
 * Not having to say a hotword first might make use of the extension easier.
 * But, on the other hand, it might cause false positives.
 *
 * @type {string}
 */

export const DEFAULT_HOTWORD = HOTWORDS.get( 0 );
