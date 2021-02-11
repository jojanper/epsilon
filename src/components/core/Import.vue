<template>
  <div :key="counter">
    <select-input
      :placeholder="label"
      :value="value"
      name="name"
      :data="importData"
      :data-key="dataKey"
      :label="label"
      @input="setData"
      clearable
    >
      <draal-file-import
        slot="append-outer"
        :tooltip-text="tooltipText"
        :tooltip-position="tooltipPosition"
        :icon-size="iconSize"
        :icon-color="iconColor"
        :icon="icon"
        @file-select="fileSelect"
        :multiple="false"
      ></draal-file-import>
    </select-input>
  </div>
</template>

<script>
import SelectInput from '@/components/core/form/inputs/SelectInput.vue';
import DraalFileImport from '@/components/core/utils/FileImport.vue';
import { readJson } from '@/common/utils';

/**
 * Import JSON data from file and show read data as selection list.
 *
 * @displayName DraalImport
 */
export default {
    name: 'DraalImport',
    components: {
        SelectInput,
        DraalFileImport
    },
    props: {
        /**
         * Select list label.
         */
        label: {
            type: String,
            required: true
        },
        /**
         * Property name of data to show in the list.
         */
        dataKey: {
            type: String,
            required: true
        },
        /**
         * Tooltip text for file import.
         */
        tooltipText: {
            type: String,
            required: true
        },
        /**
         * Tooltip position for file import.
         */
        tooltipPosition: {
            type: String,
            required: false,
            default: 'top'
        },
        /**
         * File import icon color.
         */
        iconColor: {
            type: String,
            required: true
        },
        /**
         * File import icon size.
         */
        iconSize: {
            type: String,
            required: false,
            default: 'medium'
        },
        /**
         * File import icon.
         */
        icon: {
            type: String,
            required: false,
            default: 'mdi-import'
        },
        /**
         * Data array, if any
         */
        data: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            counter: 0,
            value: null,
            importData: this.data.map(item => item)
        };
    },
    methods: {
        setData(data) {
            /**
             * Send selected list data.
             *
             * @property data Currently selected data.
             */
            this.$emit('data-select', data);
        },

        fileSelect(files) {
            return readJson(files[0]).then(data => {
                const target = Array.isArray(data) ? data : [data];

                this.counter += 1;
                this.importData.splice(0, this.importData.length);
                target.forEach(item => this.importData.push(item));

                /**
                 * Read data array.
                 *
                 * @property data Data array.
                 */
                this.$emit('data-array', this.importData);
            }).catch(err => {
                /**
                 * Error message.
                 *
                 * @property path JSON file.
                 * @property error Error message.
                 */
                this.$emit('data-error', files[0], err.message);
            });
        }
    }
};
</script>
