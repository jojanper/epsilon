/* eslint-disable no-underscore-dangle */
import { extend, configure } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

import i18n from '../i18n';

configure({
    defaultMessage: (field, values) => i18n.t(`validation.${values._rule_}`, values)

});

// Install required rule and message.
extend('required', required);

// Custom WAV audio file validation. Duration must be available and file ends with .wav
extend('wavaudio', {
    params: ['target'],
    validate(value, { target }) {
        return target > 0 && value.endsWith('.wav');
    }
});
