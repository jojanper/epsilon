<template>
  <div>
    <draal-tooltip
      v-bind="tooltipConfig"
      :name="tooltipText"
      :icon="icon"
      @clicked="helpDialog=true"
    ></draal-tooltip>

    <draal-simple-dialog
      v-model="helpDialog"
      :title="dialogTitle"
      :content="dialogContent"
      width=500
    ></draal-simple-dialog>
  </div>
</template>

<script>
import DraalTooltip from './Tooltip.vue';
import DraalSimpleDialog from './SimpleDialog.vue';

/**
 * Icon that on click opens dialog.
 *
 * @displayName DraalIconDialog
 */
export default {
    name: 'DraalIconDialog',
    components: {
        DraalTooltip,
        DraalSimpleDialog
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
