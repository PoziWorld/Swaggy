import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import camelCase from 'camelcase';

import * as utils from 'Shared/utils';
import t from 'Shared/i18n';
import { voiceControlViewPropertiesShape } from 'Models/settings';

import { FIELD_NAME_SEPARATOR } from './options';

const STORAGE_GROUP_NAME = 'settings';
const EMPTY_VALUE = 'none';

export default class Setting extends PureComponent {
  static propTypes = {
    data: PropTypes.shape( voiceControlViewPropertiesShape ).isRequired,
    settingGroupName: PropTypes.string.isRequired,
    savedValue: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
  };

  render() {
    const { data: { settingName, i18nKey, optionsList }, settingGroupName, savedValue, handleChange } = this.props;

    return (
      <div className="pwFormRow">
        <label>
          <span className="pwFormRowText">
            { t( i18nKey ) }
          </span>
          <select
            className="settingsFormSelect pwSelect"
            name={ `${ STORAGE_GROUP_NAME }${ FIELD_NAME_SEPARATOR }${ settingGroupName }${ FIELD_NAME_SEPARATOR }${ settingName }` }
            defaultValue={ savedValue }
            onBlur={ handleChange }
            onChange={ handleChange }
              >
            { optionsList.map( ( value ) =>
              <option key={ value || EMPTY_VALUE } value={ value }>
                { t( `${ settingName }_${ utils.isNonEmptyString( value ) ? camelCase( value ) : EMPTY_VALUE }` ) }
              </option>
            ) }
          </select>
        </label>
      </div>
    );
  }
}
