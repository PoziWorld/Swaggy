import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';

import * as utils from 'Shared/utils';
import t, { getLanguage } from 'Shared/i18n';
import { getSettings, setSettings } from 'Models/settings';

import Loading from 'Shared/components/loading';
import View from './view';

export const FIELD_NAME_SEPARATOR = '-';

/**
 * Used to reset setTimeout.
 *
 * @type {number}
 */

let notification;

const NOTIFICATION_DURATION = 2000;
const NOTIFICATION_SUCCESS = 'saveSettingsSuccess';
const NOTIFICATION_PLACEBO_SUCCESS = 'saveSettingsPlaceboSuccess';

class Options extends PureComponent {
  state = {
    loading: true,
    settingsFormMessage: '',
  };

  saveSettingChange = this.saveSettingChange.bind( this );
  placeboSubmitForm = this.placeboSubmitForm.bind( this );

  render() {
    const { loading, settings, settingsFormMessage } = this.state;

    return (
      <div>
        <h1 className="pwVisuallyHidden">
          { t( `extensionName` ) }
        </h1>
        <h2 className="pwVisuallyHidden">
          { t( `optionsPageHeading` ) }
        </h2>
        { loading ?
          <Loading /> :
          <View
            data={ settings }
            message={ settingsFormMessage }
            handleChange={ this.saveSettingChange }
            handleFormSubmit={ this.placeboSubmitForm }
              />
        }
      </div>
    );
  }

  async componentDidMount() {
    this.passSettingsToState();
    this.setPageTitle();
    this.setPageLanguage();
  }

  /**
   * Get settings from the Storage and pass them to the state.
   *
   * @return {Promise<void>}
   */

  async passSettingsToState() {
    try {
      const settings = await getSettings();

      this.setState( {
        loading: false,
        settings,
      } );
    }
    catch ( e ) {
      /**
       * @todo Initially show “Retrieving settings” on the loading screen, then replace with “Settings retrieval failed. Please notify the developer via <a />”.
       */
    }
  }

  /**
   * If the Options page is opened as a standalone page (not within Extensions), set <title />.
   */

  setPageTitle() {
    document.title = t( `optionsPageTitle` );
  }

  /**
   * Set lang attribute on <html />.
   */

  setPageLanguage() {
    document.documentElement.lang = getLanguage();
  }

  /**
   * Update the setting value in the Storage, state, and let user know when done.
   *
   * @param {string} fieldName - The form field name which consists of the Storage group name, setting group name, and setting name.
   * @param {*} settingValue - The new setting value.
   * @return {Promise<void>}
   */

  async saveSettingChange( fieldName, settingValue ) {
    const [ storageGroupName, settingGroupName, settingName ] = fieldName.split( FIELD_NAME_SEPARATOR );
    const toSave = {
      [ storageGroupName ]: {
        [ settingGroupName ]: {
          [ settingName ]: settingValue,
        },
      },
    };

    try {
      const newSavedSettingsWrapped = await setSettings( toSave );

      this.setState( newSavedSettingsWrapped );
      this.notifyUser( NOTIFICATION_SUCCESS );
    }
    catch ( e ) {
      /**
       * @todo
       */
    }
  }

  /**
   * The changes get saved automatically right away without the need to click “Save settings” button.
   * If user clicks the button anyway, let this user know that it's all good. :-)
   *
   * @param {Event} event
   */

  placeboSubmitForm( event ) {
    event.preventDefault();

    this.notifyUser( NOTIFICATION_PLACEBO_SUCCESS );
  }

  /**
   * Assure user the settings have been saved.
   *
   * @param {string} messageKey - The key of the message in the message.json file.
   */

  notifyUser( messageKey ) {
    if ( ! utils.is( messageKey, 'string' ) ) {
      return;
    }

    // If just showed, prevent the new one from disappearing sooner than expected.
    window.clearTimeout( notification );

    this.setState(
      {
        settingsFormMessage: t( messageKey ),
      },
      () => {
        notification = window.setTimeout( () => {
          this.setState( {
            settingsFormMessage: '',
          } );
        }, NOTIFICATION_DURATION );
      }
    );

  }
}

export default translate()( Options );
