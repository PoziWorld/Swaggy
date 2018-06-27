import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';

import t from 'Shared/i18n';
import HREFS from 'Models/hrefs';
import { settingsShape, settingsToViewProperties } from 'Models/settings';

import Setting from './setting';

import './view.css';

/**
 * The screen to show when the required data has been retrieved asynchronously and is now ready.
 */

export default class View extends PureComponent {
  static propTypes = {
    data: PropTypes.shape( settingsShape ).isRequired,
    message: PropTypes.string,
    handleFormSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
  };

  handleSettingChange = this.handleSettingChange.bind( this );

  render() {
    const { data: { voiceControl }, message, handleFormSubmit } = this.props;

    return (
      <div>
        <form id="settingsForm">
          <fieldset className="pwFormGroup">
            <legend className="pwFormGroupCaption">
              <h3 className="pwFormGroupCaptionHeading">
                { t( `voiceControlSettings` ) }
              </h3>
            </legend>
            { settingsToViewProperties.get( `voiceControl` ).map( ( setting ) =>
              <Setting
                key={ setting.settingName }
                data={ setting }
                settingGroupName="voiceControl"
                savedValue={ voiceControl[ setting.settingName ] }
                handleChange={ this.handleSettingChange }
                  />
            ) }
            <p className="pwText">
              <Trans i18nKey="voiceControlSettingsCommands.message">
                <a href={ HREFS.get( `EXTENSION_COMMANDS` ) }>.</a>
                <a href={ HREFS.get( `EXTENSION_COMMANDS_EXAMPLES` ) }>.</a>
              </Trans>
            </p>
          </fieldset>
          <div className="pwFormControls">
            <button
              className="pwCta"
              title={ t( `saveSettingsTooltip` ) }
              onClick={ handleFormSubmit }
                >
              { t( `saveSettings` ) }
            </button>
            <p
              id="settingsFormMessage"
              className="pwText"
              role="status"
              aria-live="polite"
                >
              { message }
            </p>
          </div>
        </form>
        <aside id="copyright">
          <p id="copyrightText">
            { t( `swagbucksCopyright` ) }
          </p>
        </aside>
      </div>
    );
  }

  /**
   * Propagate a setting change to the parent component.
   *
   * @param {Event} event
   */

  handleSettingChange( event ) {
    const { name, value } = event.target;

    this.props.handleChange( name, value );
  }
}