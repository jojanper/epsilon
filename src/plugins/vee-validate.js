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

// Custom validator for file input data query
// Input consists of 3 elements
// - File
// - Selection list determined from the file (content etc)
// - Optional text input for manually inputing the value (and overriding the select list values)
extend('filequery', {
    params: ['selected', 'custom'],
    validate(value, { selected, custom }) {
        // File exists, selected data exists and it is not equesting manual input
        if (value && selected && !selected.custom) {
            return true;
        }

        // File exists, selected data exists and it is requesting manual input
        if (value && selected && selected.custom === true) {
            // Manual input exists
            if (custom && custom.length > 0) {
                return true;
            }
        }

        // None of the above
        return false;
    }
});
