<template>
  <v-dialog v-model="showDialog" :max-width="maxWidth">
    <v-card>
      <slot name="header">
        <v-card-title class="headline">{{ title }}</v-card-title>
      </slot>
      <slot name="body">
        <v-card-text :class="bodyCls">{{ text }}</v-card-text>
      </slot>
      <v-card-actions v-if="hasActions">
        <v-btn
          v-if="!hasOk || !hasCancel"
          class="mx-auto dialog-close"
          color="green darken-1"
          text
          @click.native="showDialog=false"
        >{{ closeText }}</v-btn>
        <v-btn
          v-if="hasOk"
          class="mx-auto dialog-close"
          color="green darken-1"
          text
          @click.native="ok()"
        >{{ okText }}</v-btn>
        <v-btn
          v-if="hasCancel"
          class="mx-auto dialog-close"
          color="green darken-1"
          text
          @click.native="cancel()"
        >{{ cancelText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * Application dialog.
 *
 * @displayName DraalDialog
 */
export default {
    name: 'DraalDialog',
    props: {
        /**
         * Dialog visibility.
         */
        model: {
            required: true
        },
        /**
         * Dialog title.
         */
        title: {
            type: String,
            required: false
        },
        /**
         * Dialog content text.
         */
        text: {
            type: String,
            required: false
        },
        /**
         * Text for dialog cancel button.
         */
        cancelText: {
            type: String,
            required: false
        },
        /**
         * Text for dialog success button.
         */
        okText: {
            type: String,
            required: false
        },
        /**
         * Text for dialog close button.
         */
        closeText: {
            type: String,
            required: false,
            default: 'Close'
        },
        /**
         * Maximum dialog width.
         */
        maxWidth: {
            type: String,
            required: false,
            default: '290'
        },
        /**
         * CSS classes for the body scoped slot.
         */
        bodyCls: {
            type: String,
            required: false,
            default: ''
        }
    },
    data() {
        return {
            hasCancel: !!this.cancelText,
            hasOk: !!this.okText,
            hasActions: this.hasOk || this.hasCancel || this.closeText
        };
    },
    computed: {
        showDialog: {
            get() {
                return this.model;
            },
            set() {
                /**
                 * Close event.
                 */
                this.$emit('close-dialog');
            }
        }
    },
    methods: {
        cancel() {
            /**
             * Cancel event.
             */
            this.$emit('cancel-dialog');
            this.showDialog = false;
        },

        ok() {
            /**
             * Success event.
             */
            this.$emit('ok-dialog');
            this.showDialog = false;
        }
    }
};
</script>
