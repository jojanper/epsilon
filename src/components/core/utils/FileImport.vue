<template>
  <div>
    <!-- Enable tooltip component -->
    <draal-tooltip
      v-if="tooltipText"
      :name="tooltipText"
      :position="tooltipPosition"
    >
      <template v-slot:default="{ on }">
        <div
          v-on="on"
          class="float-left pointer-cursor"
          @click="fileDialog=true"
          @keyup="fileDialog=true"
        >
          <draal-file-drop
            v-if="drag"
            v-bind="$attrs"
            :cls="cls"
            @fileDrop="fileSelect"
          ></draal-file-drop>
          <v-icon v-else>{{ icon }}</v-icon>
        </div>
      </template>
    </draal-tooltip>
    <!-- Enable file selection & dropping without tooltip -->
    <div
      v-else
      class="float-left pointer-cursor"
      @click="fileDialog=true"
      @keyup="fileDialog=true"
    >
      <draal-file-drop
        v-if="drag"
        v-bind="$attrs"
        :cls="cls"
        @fileDrop="fileSelect"
      ></draal-file-drop>
      <v-icon v-else>{{ icon }}</v-icon>
    </div>
    <draal-file-dialog
      v-bind="attrs"
      v-model="fileDialog"
      @file-select="fileSelect"
    ></draal-file-dialog>
  </div>
</template>

<script>
import DraalFileDialog from '@/components/core/utils/FileDialog.vue';
import DraalFileDrop from '@/components/core/utils/FileDrop.vue';
import DraalTooltip from '@/components/core/utils/Tooltip.vue';

/**
 * Import file either dropping file or selecting from file dialog.
 * Component supports tooltip, no tooltip and file dragging support
 * can be enabled or disabled. All DraalFileDrop props can be also used.
 *
 * @displayName DraalFileImport
 */
export default {
    name: 'DraalFileImport',
    components: {
        DraalFileDialog,
        DraalFileDrop,
        DraalTooltip
    },
    props: {
        /**
         * Tooltip text. If no text is available, no tooltip available.
         */
        tooltipText: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Tooltip position.
         */
        tooltipPosition: {
            type: String,
            required: false,
            default: 'top'
        },
        /**
         * Additional CSS class(es) for file drop component creation.
         */
        cls: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Select multiple files.
         */
        multiple: {
            type: Boolean,
            required: false,
            default: false
        },
        /**
         * Set the status of file drag support.
         */
        drag: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return {
            fileDialog: false,
            attrs: this.getAttrs(),
            icon: this.$attrs.icon || 'mdi-import'
        };
    },
    methods: {
        getAttrs() {
            const attrs = {};

            if (this.multiple) {
                attrs.multiple = true;
            }

            return attrs;
        },

        fileSelect(files) {
            /**
             * Files selected event.
             *
             * @parameter files List of selected files.
             */
            this.$emit('file-select', this.multiple ? files : [files[0]]);
        }
    }
};
</script>
