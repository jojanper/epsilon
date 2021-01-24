<template>
  <v-data-table
    class="mt-3 pt-3 elevation-3"
    :search="search"
    :headers="tableHeaders"
    :items="tableData"
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
</template>

<script>
/**
 * Data table component for static data.
 *
 * @displayName DraalDataTable
 */
export default {
    name: 'DraalDataTable',
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
                filterable: false
            };

            if (this.actionsConfig.width) {
                data.width = this.actionsConfig.width;
            }

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

        return {
            tableHeaders,
            tableData,
            attrs: this.getAttrs()
        };
    },
    computed: {
        customRender() {
            return this.customColumns.map(column => ({ child: `item.${column}`, parent: `table.${column}` }));
        },

        hasExpand() {
            return this.expand;
        }
    },
    methods: {
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
        }
    }
};
</script>
