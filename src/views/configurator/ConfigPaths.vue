<template>
  <div class="elevation-3 pl-2 pr-2 mb-4 rounded">
    <draal-expand-item
      :title="title"
      :custom-actions="1"
    >
      <div
        slot="content"
        class="p-4 pb-0 pt-2"
      >
        <draal-file-open-input
          :value="inputValue"
          @input="value => { this.inputValue = value; $emit('input', value); }"
          v-bind="schema"
          :help="null"
          outlined
          :loading-status="configfilesLoading"
        >
          <draal-tooltip
            v-if="inputValue"
            slot="configpath.prepend"
            v-bind="toolIconAttrs"
            :name="reloadText"
            icon="mdi-reload"
            @clicked="setConfigBasePath()"
          ></draal-tooltip>
        </draal-file-open-input>
      </div>
      <template slot="action-0">
        <draal-icon-dialog
          :tooltip-config="{ 'icon-size': helpIconSize }"
          :tooltip-text="schema.help.tooltip"
          :dialog-title="schema.help.title"
          :dialog-content="schema.help.body"
        ></draal-icon-dialog>
      </template>
    </draal-expand-item>
  </div>
</template>

<script>
import { appActions } from '@/store/helpers';
import DraalFileOpenInput from '@/components/core/form/inputs/FileOpenInput.vue';
import DraalIconDialog from '@/components/core/utils/IconDialog.vue';
import DraalTooltip from '@/components/core/utils/Tooltip.vue';
import DraalExpandItem from '@/components/core/utils/ExpandItem.vue';

/**
 * Show config path component as expandable item.
 *
 * @displayName DraalConfigPaths
 */
export default {
    name: 'DraalConfigPaths',
    components: {
        DraalIconDialog,
        DraalTooltip,
        DraalFileOpenInput,
        DraalExpandItem
    },
    props: {
        /**
         * Base path. Can be used as v-model.
         */
        value: {
            required: true
        },
        /**
         * Input schema.
         */
        schema: {
            type: Object,
            required: true
        },
        /**
         * File query interface.
         */
        fileQuery: {
            type: Function,
            required: true
        },
        /**
         * Reload tooltip icon attributes.
         */
        toolIconAttrs: {
            type: Object,
            required: true
        },
        /**
         * Expand item title.
         */
        title: {
            type: String,
            required: true
        },
        /**
         * Reload tooltip text.
         */
        reloadText: {
            type: String,
            required: true
        },
        /**
         * Help icon size.
         */
        helpIconSize: {
            type: String,
            required: false,
            default: 'medium'
        },
        /**
         * File filtering options.
         */
        filterOptions: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            inputValue: this.value,
            configfilesLoading: false
        };
    },
    methods: {
        setConfigFiles: appActions.setConfigFiles,

        // Query the files and assign result to store
        setConfigBasePath() {
            const { params, ext } = this.filterOptions;

            this.configfilesLoading = true;

            // These data properties are to be added to store
            const fileConfigData = {};
            ext.forEach(item => { fileConfigData[item.key] = []; });

            // Extensions to be included in the files
            const queryExt = ext.filter(item => item.ext).map(item => item.ext).join(',');

            // Apply the query
            this.fileQuery(this.inputValue, queryExt, params).subscribe(({ data }) => {
                data.forEach(item => {
                    // Filter files based on extension
                    for (let i = 0; i < ext.length; i++) {
                        if (ext[i].ext && item.endsWith(ext[i].ext)) {
                            fileConfigData[ext[i].key].push(item);
                            return;
                        }
                    }

                    // Results for files that start with some pattern
                    if (item.indexOf(params.base) > -1) {
                        fileConfigData[ext[0].key].push(item);
                    }
                });

                // Add results to store
                this.setConfigFiles(fileConfigData);
                this.configfilesLoading = false;

                /**
                 * New config data loaded to store.
                 */
                this.$emit('data-loaded');
            });
        }
    }
};
</script>
