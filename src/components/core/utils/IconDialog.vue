<template>
  <div>
    <draal-tooltip
      v-bind="tooltipConfig"
      :name="tooltipText"
      :icon="icon"
      @clicked="helpDialog=true"
    ></draal-tooltip>

    <draal-dialog
      :model="helpDialog"
      :title="dialogTitle"
      maxWidth="750"
      @close-dialog="helpDialog=false"
    >
      <template v-slot:body>
        <v-card-text
          class="text-left"
          v-html="dialogContent"
        ></v-card-text>
      </template>
    </draal-dialog>
  </div>
</template>

<script>
import DraalTooltip from './Tooltip.vue';
import DraalDialog from './Dialog.vue';

/**
 * Icon that on click opens dialog.
 *
 * @displayName DraalIconDialog
 */
export default {
    name: 'DraalIconDialog',
    components: {
        DraalTooltip,
        DraalDialog
    },
    props: {
        /**
         * Icon name.
         */
        icon: {
            type: String,
            required: false,
            default: 'mdi-information-outline'
        },
        /**
         * Icon tooltip text.
         */
        tooltipText: {
            type: String,
            required: true
        },
        /**
         * DraalTooltip component props can be specified here (excluding
         * 'name' and 'icon' props).
         */
        tooltipConfig: {
            type: Object,
            required: false,
            default: () => ({
                position: 'top'
            })
        },
        /**
         * Dialog title.
         */
        dialogTitle: {
            type: String,
            required: true
        },
        /**
         * Dialog content.
         */
        dialogContent: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            helpDialog: false
        };
    }
};
</script>
