<template>
  <div class="mt-1 pt-1 elevation-3">
    <!-- Filter only selected set of data entries based on selections -->
    <div class="clearfix mb-0 pb-0 ml-3">
      <checkbox-input
        classes="float-left mr-2 mt-0 mb-0"
        v-for="(item, index) in getDataTypesFilter()"
        :key="index"
        placeholder
        :label="item.display"
        name
        :value="filterStatus[index]"
        @input="data => setDataFilter(data, item.type, index)"
      ></checkbox-input>
    </div>

    <v-data-table
      class="p-3 pt-0"
      :search="search"
      :headers="tableHeaders"
      :items="filteredData"
      v-bind="attrs"
      @click:row="clickAction"
    >
      <template v-for="(def, index) in customRender" v-slot:[def.child]="{item}">
        <!--
        @slot Custom table column data rendering.
        @binding {number} columnKey Column key (Vue key attribute).
        @binding {object} data Column data.
        -->
        <slot :name="def.parent" v-bind:colunmKey="index" v-bind:data="item"></slot>
      </template>

      <template v-if="hasExpand" v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <!--
          @slot Expanded item rendering.
          @binding {object} data Column data.
          -->
          <slot name="table.expand" v-bind:data="item"></slot>
        </td>
      </template>

      <template v-if="actions.length" v-slot:item.$action="{item}">
        <v-btn
          v-if="hasAction('edit')"
          class="mx-2"
          fab
          dark
          x-small
          color="pink"
          @click="editAction(item)"
        >
          <v-icon dark>mdi-border-color</v-icon>
        </v-btn>
        <v-btn
          v-if="hasAction('delete')"
          class="mx-2"
          fab
          dark
          x-small
          color="pink"
          @click="deleteAction(item)"
        >
          <v-icon dark>mdi-delete-forever</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import CheckboxInput from '@/components/core/form/inputs/CheckboxInput.vue';

/**
 * Data table component for static data.
 *
 * @displayName DraalDataTable
 */
export default {
    name: 'DraalDataTable',
    components: {
        CheckboxInput
    },
    props: {
        /**
         * Table data.
         */
        data: {
            type: Array,
            required: false,
            default: () => []
        },
        /**
         * Table header (columns) definition.
         */
        headers: {
            type: Array,
            required: true
        },
        /**
         * Columns of the timeline data table that are custom rendered by the parent.
         * Parent must use table.<column-name> template slot when rendering the data.
         */
        customColumns: {
            type: Array,
            required: false,
            default: () => []
        },
        /**
         * Actions column configuration. Currently supported data fields
         * - name: Name of column
         * - width: Column width (optional)
         */
        actionsConfig: {
            type: Object,
            required: false,
            default: () => {}
        },
        /**
         * Actions to be included for the table. Currently supported actions:
         * - edit: Edit data item, 'data-edit' event is send when clicked
         * - delete: Delete data item, 'data-delete' event is send when clicked
         */
        actions: {
            type: Array,
            required: false,
            default: () => []
        },
        /**
         * Name of expand column. Table header data is internally appended to
         * include this definition.
         */
        expand: {
            type: String,
            required: false,
            default: null
        },
        /**
         * Table props for the underlying data table. All Vuetify props can be used here.
         */
        tableAttributes: {
            type: Object,
            required: false,
            default: () => {}
        },
        /**
         * Table search value.
         */
        search: {
            type: String,
            required: false,
            default: null
        },
        /**
         * Table data filtering options. The object should contain the following fields:
         *
         * - types: Array of data types that can be filtered from input data. Each item
         *          must contain the display and type fields. The display field is used
         *          to render the selection and the type field contains the actual value
         *          of data that should be excluded from table.
         * - field: This defines the data field to which the filtering should be applied.
         *
         * For example, say table data is
         * [
         *     { type: 'type-A', value: 1},
         *     { type: 'type-B', value: 2}
         * ]
         *
         * dataFilter is
         * {
         *     types: [
         *         { display: 'Type A', type: 'type-A' },
         *         { display: 'Type N', type: 'type-B' }
         *     ],
         *     field: 'type'
         * }
         *
         * Initially all data is shown. For example, when 'Type A' is deselected,
         * table data that correspond to data[i][dataFilter.field] === 'type-A'
         * is excluded from table rendering.
         */
        dataFilter: {
            type: Object,
            required: false,
            default: null
        },
        /**
         * Data types filtering status.
         */
        dataFiltering: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data() {
        const tableHeaders = [];
        this.headers.forEach(item => tableHeaders.push(item));

        // Include actions column
        if (this.actions.length) {
            const data = {
                text: this.actionsConfig.name,
                value: '$action',
                sortable: false,
                filterable: false,
                ...this.actionsConfig
            };

            tableHeaders.push(data);
        }

        // Include expended data row
        if (this.expand) {
            tableHeaders.push({
                text: this.expand,
                value: 'data-table-expand'
            });
        }

        const tableData = this.data.map((item, index) => {
            // Extend data with row index and click status
            const data = {
                ...item,
                $clicked: false,
                $index: index
            };

            return data;
        });

        // Data types to be excluded from table
        const filterData = [];

        // Status of data filtering, initally all included (no data filtering)
        const dataTypes = this.getDataTypesFilter();
        const filterStatus = dataTypes.map(() => true);

        const filter = this.dataFiltering;
        filter.forEach((_, index) => {
            // Use the provided input data for initial filtering status
            // If indices are missing, then by default the data type is included for rendering
            const value = index < filter.length ? filter[index] : filter.length === 0;

            filterStatus[index] = value;

            // If not selected, the data that matches the type should be excluded from rendering
            if (!value) {
                filterData.push(dataTypes[index].type);
            }
        });

        return {
            tableHeaders,
            tableData,
            attrs: this.getAttrs(),
            filterStatus,
            filterData
        };
    },
    computed: {
        customRender() {
            return this.customColumns.map(column => ({
                child: `item.${column}`,
                parent: `table.${column}`
            }));
        },

        hasExpand() {
            return this.expand;
        },

        filteredData() {
            return this.filterData.length ? this.getFilteredData() : this.tableData;
        }
    },
    methods: {
        // Exclude data that corresponds to data types not to be rendered
        getFilteredData() {
            const { field } = this.dataFilter;
            return this.tableData.filter(data => this.filterData.indexOf(data[field]) === -1);
        },

        // Data types available for filtering upon selection
        getDataTypesFilter() {
            return this.dataFilter ? this.dataFilter.types || [] : [];
        },

        // Build table attributes
        getAttrs() {
            const attrs = {};

            if (this.expand) {
                attrs['show-expand'] = true;
            }

            // Vuetify data table attributes can be used as is
            Object.entries(this.tableAttributes).forEach(([key, value]) => {
                attrs[key] = value;
            });

            return attrs;
        },

        // Check if specified action exists
        hasAction(name) {
            return this.actions.filter(action => action === name).length;
        },

        editAction(data) {
            /**
             * Edit action requested for table data item.
             *
             * @property {number} index Data item index.
             */
            this.$emit('data-edit', data.$index);
        },

        deleteAction(data) {
            /**
             * Delete action requested for table data item.
             *
             * @property {number} data Data item index.
             */
            this.$emit('data-delete', data.$index);
        },

        clickAction(data) {
            /* eslint-disable no-param-reassign */
            this.tableData.forEach(item => {
                item.$clicked = false;
            });
            data.$clicked = true;
            /* eslint-enable no-param-reassign */

            /**
             * Table row clicked.
             *
             * @property {number} data Data item index.
             */
            this.$emit('row-click', data.$index);
        },

        /**
         * Request new data filtering for table data.
         */
        setDataFilter(status, type, index) {
            this.filterStatus[index] = status;

            const indexOf = this.filterData.indexOf(type);

            // Item selected (= do not filter), remove from data types filter
            if (status && indexOf > -1) {
                this.filterData.splice(indexOf, 1);

            // Item deselected (= filter corresponding data), add to data types filter
            } else if (!status && indexOf === -1) {
                this.filterData.push(type);
            }

            /**
             * Send data types filter.
             *
             * @property data Data types filter.
             * @property status Status of each data type selection.
             */
            this.$emit('data-filter', this.filterData, this.filterStatus);
        }
    }
};
</script>
