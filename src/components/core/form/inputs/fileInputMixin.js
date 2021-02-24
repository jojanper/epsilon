import { ValidationObserver } from 'vee-validate';

import BaseInput from './BaseInput.vue';
import { dropTitle } from './options';
import DraalFileDrop from '../../utils/FileDrop.vue';
import DraalFileDialog from '@/components/core/utils/FileDialog.vue';

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
        },
        /**
         * Include selected file object if enabled.
         */
        fileObject: {
            type: Boolean,
            required: false,
            default: false
        },
        /**
         * Loading color. Currently used when wave audio rule is enabled.
         */
        loadingColor: {
            type: String,
            required: false,
            default: 'primary'
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
            inputRules,
            fileSrc: null
        };
    },
    created() {
        this.fieldValueInt = this.fieldValue;
    },
    mounted() {
        // Set audio events when WAV audio rule enabled
        if (this.$refs.audio && this.wavAudioRule) {
            // Audio loaded
            this.$refs.audio.onloadeddata = () => {
                if (this.$refs.audio.readyState >= 2) {
                    this.setMediaDuration(this.$refs.audio);
                    URL.revokeObjectURL(this.fileSrc);
                    this.fileSrc = null;
                }
            };

            // Audio loading error
            this.$refs.audio.onerror = () => {
                this.setMediaError();
                URL.revokeObjectURL(this.fileSrc);
                this.fileSrc = null;
            };
        }
    },
    methods: {
        onDrop(files) {
            if (files.length) {
                // Set the file name from the dropped target
                this.setInput(files[0].path || files[0].name, files[0]);

                // Determine duration if needed
                if (this.wavAudioRule) {
                    this.loading = this.loadingColor;
                    this.fileSrc = URL.createObjectURL(files[0]);
                } else {
                    this.sendInputEvent();
                }
            }
        },

        setInput(fileName, file) {
            this.fieldValueInt = fileName;
            this.file = file;
        },

        clicked() {
            this.fileDialog = true;
        },

        sendInputEvent() {
            this.fieldValue = this.fieldValueInt;

            const value = this.wavAudioRule || this.fileObject ? { fileName: this.fieldValue } : this.fieldValue;

            // If WAV validation was requested, send object with duration field
            if (this.wavAudioRule) {
                value.duration = this.mediaDuration;
            }

            // If selected file object was requested, send that one also
            if (this.fileObject) {
                value.file = this.file;
            }

            this.inputChangeEvent(value);
        },

        async setMediaDuration({ duration }) {
            this.loading = false;
            this.mediaDuration = parseFloat(duration.toFixed(1), 10);
            this.sendInputEvent();
            this.validateInput();
        },

        // Error in media file parsing, most likely not media file at all
        async setMediaError() {
            this.loading = false;
            this.mediaDuration = null;
            this.sendInputEvent();
            this.validateInput();
        }
    }
};
