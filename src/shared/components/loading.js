import React, { PureComponent } from 'react';

import t from 'Shared/i18n';

import './loading.css';

/**
 * The loading screen to be displayed while the required data is being retrieved asynchronously.
 */

export default class Loading extends PureComponent {
  render() {
    return (
      <div id="loadingContainer">
        <div id="loading">
          <h1 id="logo">
            <span className="pwVisuallyHidden">
              { t( `extensionAuthor` ) }
            </span>
          </h1>
          <p id="loadingText">
            { t( `loading` ) }
          </p>
        </div>
      </div>
    );
  }
}
