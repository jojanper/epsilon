<template>
  <div>
    <div v-for="(item, index) in configData" :key="index">
      <select-input
        :key="currentSelect"
        v-if="index <= currentSelect"
        :placeholder="item.placeholder"
        :value="selectedData[index]"
        :selectlist="listData[index]"
        :name="getName(index)"
        :label="item.label"
        @input="(data) => setInputValue(data, index)"
      ></select-input>
    </div>
  </div>
</template>

<script>
import SelectInput from '@/components/core/form/inputs/SelectInput.vue';

/**
 * Multistage select where selection at one stage invalidates (hides) all
 * the following selects. New selection list will be made visible one by one.
 *
 * @displayName DraalMultiStageSelect
 */
export default {
    name: 'DraalMultiStageSelect',
    components: {
        SelectInput
    },
    props: {
        /**
         * List data for each select.
         */
        listData: {
            type: Array,
            required: true
        },
        /**
         * Selected data for each select.
         */
        selectedData: {
            type: Array,
            required: true
        },
        /**
         * Configuration data. Each config data must contain 'label' and 'placeholder'
         * values.
         */
        configData: {
            type: Array,
            required: true
        }
    },
    data() {
        // How many selects should be visible initially
        let currentSelect = 0;
        for (let i = 0; i < this.selectedData.length; i++) {
            if (this.selectedData[i] !== undefined) {
                currentSelect = i + 1;
                break;
            }
        }

        return {
            currentSelect
        };
    },
    methods: {
        getName(index) {
            return `select-${index}`;
        },

        setInputValue(data, index) {
            if (this.selectedData[index] !== data) {
                this.selectedData[index] = data;
                this.currentSelect = index + 1;

                /**
                 * Send item selection event.
                 *
                 * @property {number} index Select index.
                 * @property {object} index Selected data.
                 */
                this.$emit('selected', index, data);
            }
        }
    }
};
</script>
