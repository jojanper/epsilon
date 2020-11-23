import { ValidationProvider, ValidationObserver } from 'vee-validate';

import InputHelp from './InputHelp.vue';
import DraalFileDrop from '../../utils/FileDrop.vue';
import { getMediaDuration } from '@/common/utils';
import DraalFileDialog from '@/components/core/utils/FileDialog.vue';

export const fileInputMixin = {
    components: {
        ValidationProvider,
        ValidationObserver,
        InputHelp,
        DraalFileDrop,
        DraalFileDialog
    },
    props: [
        'placeholder',
        'label',
        'name',
        'value',
        'rules',
        'help',
        'dropTitle',
        'readonly',
        'duration'
    ],
    data() {
        const canDrop = !!window.require;
        const fieldValue = this.value ? this.value.fileName || this.value : this.value;
        const mediaDuration = this.value ? this.value.duration || null : null;

        // Include audio duration validator rule if requested
        const inputRules = this.duration ? `${this.rules}|wavaudio:@duration` : this.rules;

        return {
            fieldValue,
            canDrop,
            readOnly: canDrop ? this.readonly || false : false,
            mediaDuration,
            fileDialog: false,
            inputRules
        };
    },
    created() {
        this.fieldValueInt = this.fieldValue;
    },
    methods: {
        onDrop(files) {
            if (files.length) {
                // Set the file name from the dropped target
                this.setInput(files[0].path || files[0].name);

                // Determine duration if needed
                if (this.duration) {
                    getMediaDuration(files[0], this.setMediaDuration, this.setMediaError);
                } else {
                    this.sendInputEvent();
                }
            }
        },

        setInput(fileName) {
            this.fieldValueInt = fileName;
        },

        clicked() {
            this.fileDialog = true;
        },

        sendInputEvent() {
            this.fieldValue = this.fieldValueInt;
            const value = this.duration ? { fileName: this.fieldValue, duration: this.mediaDuration } : this.fieldValue;
            this.$emit('input', value);
        },

        async setMediaDuration({ duration }) {
            this.mediaDuration = parseFloat(duration.toFixed(1), 10);
            this.sendInputEvent();
            setTimeout(this.$refs.provider.validate, 0);
        },

        // Error in media file parsing, most likely not media file at all
        async setMediaError() {
            this.mediaDuration = null;
            this.sendInputEvent();
            setTimeout(this.$refs.provider.validate, 0);
        }
    }
};
