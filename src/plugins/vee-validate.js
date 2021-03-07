/* eslint-disable no-underscore-dangle */
import { extend, configure } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

import i18n from '../i18n';

import { rules } from '@/components/core/form/rules';

configure({
    defaultMessage: (field, values) => i18n.t(`validation.${values._rule_}`, values)
});

// Install library rules
extend('required', required);

// Install custom rules
Object.keys(rules).forEach(rule => extend(rule, rules[rule]));
