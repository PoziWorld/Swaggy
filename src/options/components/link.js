import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import t from 'Shared/i18n';
import getUrl from 'Models/urls';

export default class Link extends PureComponent {
  static propTypes = {
    link: PropTypes.instanceOf( List ).isRequired,
  };

  render() {
    const { link: [ url, text, ...replacements ] } = this.props;

    // { t( `helpTranslate`, { shortName: t( `shortName` ) } ) }
    const replacementsObject = replacements.reduce( ( dictionary, replacement ) => {
      dictionary[ replacement ] = t( `${ replacement }` );

      return dictionary;
    }, {} );

    return (
      <li className="linkWrapper">
        <a href={ getUrl( `${ url }` ) } className="link">
          { t( `${ text }`, replacementsObject ) }
        </a>
      </li>
    );
  }
}
