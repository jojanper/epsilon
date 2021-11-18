<script>
import { ValidationProvider } from 'vee-validate';

import InputHelp from './InputHelp.vue';
import {
    placeholder, label, name, value, rules, help, classes, clearable,
    outlined, draggingColor, loadingStatus, dataRelInput, dataRelTarget,
    defaultValue
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
        clearable,
        outlined,
        draggingColor,
        loadingStatus,
        defaultValue,
        dataRelInput,
        dataRelTarget,
        /**
         *
         */
        dataRelTargetHandler: {
            type: Function,
            required: false,
            default: null
        },
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
        const fieldValue = this.getInitialValue(this.value);

        return {
            loading: false,
            dragging: false,
            overlay: false,

            fieldValue,
            inputAttrs: this.getInputAttrs()
        };
    },
    created() {
        // Check if custom data validation is to be triggered on each input change
        const val = Object.keys(validation.rules).filter(key => this.rules.indexOf(key) > -1);
        this.customValidation = val.length > 0;

        this.inputChangeEvent = debounce(this._inputChangeEvent, this.debounce);

        if (this.dataRelTarget.length && this.dataRelTargetHandler) {
            this.dataRelInput.subscribe(({ data }) => {
                this.fieldValue = this.dataRelTargetHandler(data.data);
                this._inputChangeEvent(this.fieldValue);
            });
        }
    },
    destroyed() {
        this.inputChangeEvent.cancel();
    },
    watch: {
        loadingStatus(newVal) {
            if (newVal) {
                this.enableLoading(true);
            } else {
                this.disableLoading();
            }
        }
    },
    methods: {
        getInitialValue(val) {
            let output = val;

            // Select default item if such specified when no input value available
            if ((output === undefined || output === null) && this.defaultValue !== undefined) {
                output = this.defaultValue;
                this.fieldValue = output;
                this.sendChangeEvent(this.fieldValue);
            }

            return output;
        },

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

            this.sendChangeEvent(data);
        },

        sendChangeEvent(data) {
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
        },

        // Return input attributes related to styling of the input
        getInputAttrs() {
            const attrs = {};

            if (this.clearable) {
                attrs.clearable = true;
            }

            if (this.outlined) {
                attrs.outlined = true;
            }

            return attrs;
        },

        getOutlinedStyle() {
            return '--position: 5px';
        },

        getOutlinedClasses(base, errors, required, input = 'radio') {
            const method = input === 'radio' ? this.isRequiredRadio : this.isRequired;
            const cls = this.outlined ? [base] : [];
            if (errors.length || method(required)) {
                cls.push('error--text');
            } else {
                cls.push('primary--text');
            }

            return cls;
        },

        // Set dragging status
        setDragging(status) {
            this.dragging = status;
            this.loading = status ? this.draggingColor : false;

            /**
             * File dragging event.
             *
             * @property {boolean} status Drag status.
             */
            this.$emit('dragging', this.dragging);
        },

        drop(e) {
            e.preventDefault();
            this.setDragging(false);
            this.onDrop(e.dataTransfer.files);
            return false;
        },

        enableLoading(status) {
            this.loading = status ? this.draggingColor : true;
        },

        disableLoading() {
            this.loading = false;
        },

        // Get name for component slot
        getComponentSlotName(prefix, slotName) {
            return `${prefix}${this.name}.${slotName}`;
        }
    }
};
</script>
