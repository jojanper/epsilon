<template>
  <div>
    <v-icon v-if="icon" :color="color" @click="openDialog">{{ icon }}</v-icon>
    <input
      type="file"
      ref="fileDialog"
      v-bind="attrs"
      class="d-none"
      @click="clicked"
      @change="selected"
    />
  </div>
</template>

<script>
/**
 * File dialog launcher.
 *
 * @displayName DraalFileDialog
 */
export default {
    name: 'DraalFileDialog',
    props: {
        /**
         * Icon name.
         */
        icon: {
            type: String,
            required: false,
            default: null
        },
        /**
         * Icon color.
         */
        color: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * File dialog visibility status, value true opens the dialog.
         * Use can use this also as v-model="visibility-status"
         */
        value: {
            type: Boolean,
            required: false,
            default: false
        },
        /**
         * Set to true if multiple files can be selected.
         */
        multiple: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            open: this.value,
            attrs: this.getAttrs()
        };
    },
    created() {
        this.onfocus = null;
    },
    watch: {
        // Watch prop change and show file dialog when needed
        value(newVal) {
            if (newVal) {
                this.openDialog();
            }
        }
    },
    methods: {
        getAttrs() {
            const attrs = {};

            if (this.multiple) {
                attrs.multiple = true;
            }

            return attrs;
        },

        updateState(status) {
            this.open = status;
            this.$emit('input', this.open);
        },

        openDialog() {
            this.$refs.fileDialog.click();
            this.updateState(true);
        },

        clicked() {
            this.onfocus = document.body.onfocus;
            document.body.onfocus = this.canceled;
        },

        canceled() {
            // User canceled file selection
            this.updateState(false);
            document.body.onfocus = this.onfocus;
        },

        selected(event) {
            this.sendEvent(this.getFiles(event));
            this.updateState(false);
        },

        getFiles(event) {
            return event.target.files;
        },

        sendEvent(files) {
            /**
             * File event.
             *
             * @property {array} files Selected files.
             */
            this.$emit('file-select', files);
        }
    }
};
</script>
