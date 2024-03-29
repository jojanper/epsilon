<template>
  <div>
    <div
      v-for="(item, index) in configData"
      :key="index"
      class="multiselect-item"
    >
      <select-input
        :key="currentSelect"
        :autocomplete="autoComplete"
        v-show="index <= currentSelect && listData[index].length > 0"
        :value="selectedData[index]"
        :data="listData[index]"
        :name="getName(index)"
        v-bind="item"
        @input="(data) => setInputValue(data, index)"
        @form-input-help="() => inputHelp(index)"
      ></select-input>
    </div>

    <draal-simple-dialog
      v-model="helpDialog"
      :title="helpText.title"
      :content="helpText.body"
      width=500
    ></draal-simple-dialog>
  </div>
</template>

<script>
import DraalSimpleDialog from '@/components/core/utils/SimpleDialog.vue';
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
        SelectInput,
        DraalSimpleDialog
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
        },
        /**
         * Use selection list with autocomplete.
         */
        autoComplete: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        // How many select lists should be visible initially
        let currentSelect = 0;
        for (let i = 0; i < this.selectedData.length; i++) {
            if (this.selectedData[i] !== undefined) {
                currentSelect = i + 1;
                break;
            }
        }

        return {
            currentSelect,
            helpDialog: false,
            helpText: {
                title: null,
                body: null
            }
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
        },

        inputHelp(index) {
            // Show the help data
            this.helpText = this.configData[index].help;
            this.helpDialog = true;
        }
    }
};
</script>
