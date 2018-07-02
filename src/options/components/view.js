import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { List } from 'immutable';

import t from 'Shared/i18n';
import getUrl from 'Models/urls';
import { settingsShape, settingsToViewProperties } from 'Models/settings';

import Setting from './setting';
import Links from './links';

import './view.css';

const helpfulLinks = List( [
  List( [
    'SIGN_UP_FULL',
    'joinSwagbucks',
  ] ),
  List( [
    'EXTENSION_TRANSLATION_PORTAL',
    'helpTranslate',
    'shortName',
  ] ),
  List( [
    'EXTENSION_RELEASE_NOTES',
    'releaseNotes',
  ] ),
] );

const sisterProjects = List( [
  'Print Waste Minimizer',
  'Scroll To Top Button',
  'PoziWorld Elf',
  'PoziTone',
] );

const queryParameterRefValue = 'yepo';

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
            { settingsToViewProperties.get( `voiceControl` ).map( setting =>
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
                <a href={ getUrl( `EXTENSION_COMMANDS` ) }>.</a>
                <a href={ getUrl( `EXTENSION_COMMANDS_EXAMPLES` ) }>.</a>
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
        <aside className="linksContainer">
          <Links links={ helpfulLinks } />
        </aside>
        <aside className="linksContainer">
          <h6 id="sisterProjectsHeading">
            { t( `sisterProjects` ) }
          </h6>
          <Links links={ sisterProjects } referrer={ queryParameterRefValue } />
        </aside>
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
