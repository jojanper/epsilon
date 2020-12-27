<script>
import { ValidationProvider } from 'vee-validate';

import InputHelp from './InputHelp.vue';

import {
    placeholder, label, name, value, rules, help, classes
} from './options';

export default {
    name: 'BaseInput',
    components: {
        ValidationProvider,
        InputHelp
    },
    props: {
        placeholder, label, name, value, rules, help, classes
    },
    data() {
        return {
            fieldValue: this.value
        };
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

        // Value is required if input value is not available
        isRequired(required) {
            return required ? !this.fieldValue : false;
        },

        // Value is required if input value is below 0 or value is explicitly null or undefined
        isRequiredRadio(required) {
            const valid = this.fieldValue < 0 || this.fieldValue === null || this.fieldValue === undefined;
            return required ? valid : false;
        }
    }
};
</script>
