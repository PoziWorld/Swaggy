import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import * as utils from 'Shared/utils';
import t from 'Shared/i18n';
import getUrl from 'Models/urls';

export default class Link extends PureComponent {
  static propTypes = {
    link: PropTypes.oneOfType( [
      PropTypes.instanceOf( List ),
      PropTypes.string,
    ] ).isRequired,
    referrer: PropTypes.string,
  };

  render() {
    const { link, referrer } = this.props;

    let linkName;
    let translationKey;
    let replacements;
    let translation;

    if ( link instanceof List ) {
      [ linkName, translationKey, ...replacements ] = link;

      // { t( `helpTranslate`, { shortName: t( `shortName` ) } ) }
      const replacementsObject = replacements.reduce( ( dictionary, replacement ) => {
        dictionary[ replacement ] = t( `${ replacement }` );

        return dictionary;
      }, {} );

      translation = t( `${ translationKey }`, replacementsObject );
    }
    else if ( utils.isNonEmptyString( link ) ) {
      linkName = translation = link;
    }

    let url = getUrl( `${ linkName }` );

    if ( utils.isNonEmptyString( referrer ) ) {
      url = utils.updateQueryString( `ref`, referrer, url );
    }

    return (
      <li className="linkWrapper">
        <a href={ url } className="link">
          { translation }
        </a>
      </li>
    );
  }
}
