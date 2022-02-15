<template>
  <draal-dialog
    :model="value"
    :title="title"
    :maxWidth="width"
    @close-dialog="$emit('input', false)"
  >
    <template v-slot:body>
      <v-card-text
        class="text-left"
        v-html="content"
      ></v-card-text>
    </template>
  </draal-dialog>
</template>

<script>
import DraalDialog from './Dialog.vue';

/**
 * Wrapper component providing simple use of dialog.
 *
 * @displayName DraalSimpleDialog
 */
export default {
    name: 'DraalSimpleDialog',
    components: {
        DraalDialog
    },
    props: {
        /**
         * Dialog visibility status.
         */
        value: {
            required: true
        },
        /**
         * Dialog title.
         */
        title: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Dialog content.
         */
        content: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Dialog width.
         */
        width: {
            type: String,
            required: false,
            default: '750'
        }
    }
};
</script>
