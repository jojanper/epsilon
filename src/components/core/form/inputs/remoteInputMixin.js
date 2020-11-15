import { ValidationProvider } from 'vee-validate';

import InputHelp from './InputHelp.vue';
import DraalFileDrop from '../../utils/FileDrop.vue';

export const remoteInputMixin = {
    components: {
        ValidationProvider,
        InputHelp,
        DraalFileDrop
    },
    props: ['placeholder', 'label', 'name', 'value', 'rules', 'help', 'dropTitle', 'readonly'],
    data() {
        const canDrop = !!window.require;

        return {
            fieldValue: this.value,
            canDrop,
            readOnly: canDrop ? this.readonly || false : false
        };
    },
    methods: {
        onDrop(files) {
            // Set the file name from the dropped target
            this.setInput(files[0].path);
        },

        setInput(fileName) {
            this.fieldValue = fileName;
            this.$emit('input', this.fieldValue);
        }
    }
};
