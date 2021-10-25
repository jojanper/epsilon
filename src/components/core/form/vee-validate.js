/* eslint-disable no-underscore-dangle */
import { extend, configure } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

import { rules } from './rules';

/**
 * Initialize vee-validate.
 *
 * @param {*} i18n Optional localization instance.
 */
export function initialize(i18n) {
    if (i18n) {
        configure({
            defaultMessage: (field, values) => i18n.t(`validation.${values._rule_}`, values)
        });
    }

    // Install library rules
    extend('required', required);

    // Install custom rules
    Object.keys(rules).forEach(rule => extend(rule, rules[rule]));
}
