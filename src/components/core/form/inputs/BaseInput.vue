<script>
import { ValidationProvider } from 'vee-validate';

import InputHelp from './InputHelp.vue';
import {
    placeholder, label, name, value, rules, help, classes
} from './options';

import * as validation from '@/components/core/form/rules';
import { debounce } from '@/common/utils';

export default {
    name: 'BaseInput',
    components: {
        ValidationProvider,
        InputHelp
    },
    props: {
        placeholder,
        label,
        name,
        value,
        rules,
        help,
        classes,
        /**
         * Delay input data change updates.
         */
        debounce: {
            type: Number,
            required: false,
            default: 250
        }
    },
    data() {
        return {
            fieldValue: this.value
        };
    },
    created() {
        // Check if custom data validation is triggered on each input change
        const data = Object.keys(validation.rules).filter(key => this.rules.indexOf(key) > -1);
        this.customValidation = data.length;

        this.inputChangeEvent = debounce(this._inputChangeEvent, this.debounce);
    },
    methods: {
        inputHelpEvent() {
            /**
             * Request help for input data.
             *
             * @param name Input field name.
             */
            this.$emit('form-input-help', this.name);
        },

        _inputChangeEvent(data) {
            // Custom validation rule requires that data is explicitly validated
            if (this.customValidation) {
                this.validateInput();
            }

            /**
             * Input data change event.
             *
             * @param data Changed input data.
             */
            this.$emit('input', data || this.fieldValue);
        },

        // Value is required if input value is not available
        isRequired(required) {
            return required ? !this.fieldValue : false;
        },

        // Value is required if input value is below 0 or value is explicitly null or undefined
        isRequiredRadio(required) {
            const valid = this.fieldValue < 0 || this.fieldValue === null || this.fieldValue === undefined;
            return required ? valid : false;
        },

        // Trigger cross-field validation
        validateInput() {
            setTimeout(this.$refs.provider.validate, 0);
        }
    }
};
</script>
