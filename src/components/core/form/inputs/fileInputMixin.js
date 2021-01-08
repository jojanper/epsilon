import { ValidationObserver } from 'vee-validate';

import BaseInput from './BaseInput.vue';
import { dropTitle } from './options';
import DraalFileDrop from '../../utils/FileDrop.vue';
import DraalFileDialog from '@/components/core/utils/FileDialog.vue';

import { getMediaDuration } from '@/common/utils';

export const fileInputMixin = {
    extends: BaseInput,
    components: {
        ValidationObserver,
        DraalFileDrop,
        DraalFileDialog
    },
    props: {
        dropTitle,
        /**
         * Include WAV audio validation rule.
         */
        wavAudioRule: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        const canDrop = !!window.require;
        const fieldValue = this.value ? this.value.fileName || this.value : this.value;
        const mediaDuration = this.value ? this.value.duration || null : null;

        // Include audio duration validator rule if requested
        const inputRules = this.wavAudioRule ? `${this.rules}|wavaudio:@duration` : this.rules;

        return {
            fieldValue,
            canDrop,
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
                if (this.wavAudioRule) {
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
            const value = this.wavAudioRule ? { fileName: this.fieldValue, duration: this.mediaDuration } : this.fieldValue;
            this.inputChangeEvent(value);
        },

        async setMediaDuration({ duration }) {
            this.mediaDuration = parseFloat(duration.toFixed(1), 10);
            this.sendInputEvent();
            this.validateInput();
        },

        // Error in media file parsing, most likely not media file at all
        async setMediaError() {
            this.mediaDuration = null;
            this.sendInputEvent();
            this.validateInput();
        }
    }
};
