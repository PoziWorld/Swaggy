import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import Link from './link';

export default class Links extends PureComponent {
  static propTypes = {
    links: PropTypes.instanceOf( List ).isRequired,
    referrer: PropTypes.string,
  };

  render() {
    const { links, referrer } = this.props;

    return (
      <nav className="linksWrapper">
        <ul className="links">
          { links.map( ( link, index ) =>
            <Link
              key={ index }
              link={ link }
              referrer={ referrer }
                />
          ) }
        </ul>
      </nav>
    );
  }
}
