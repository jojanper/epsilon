<template>
  <div :style="`--thumb: ${timelineScrollColor}; --thumbHover: ${timelineScrollHoverColor}`">
    <div class="row">
      <div v-if="!saveOnEdit" class="mr-auto">
        <v-icon @click="sendTimelineEvent">mdi-content-save-outline</v-icon>
        <div v-if="hasChanges" class="float-right pl-1 text-danger">{{ $t('timeline.unsaved') }}</div>
      </div>

      <div class="ml-auto">
        <v-menu left>
          <template v-slot:activator="{ on }">
            <div>
              <v-icon @click="addItem">mdi-plus</v-icon>
              <v-icon @click="setZoom(1)" large>mdi-magnify-plus-outline</v-icon>
              <v-icon @click="setZoom(-1)" large>mdi-magnify-minus-outline</v-icon>
              <v-btn icon v-on="on" v-if="timelineMenuWidths.length > 1">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </div>
          </template>

          <v-list>
            <v-list-item v-for="(action, i) in actions" :key="i" @click="action.fn">
              <v-list-item-title class="ml-2 mr-2">{{ action.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <div class="row scrolling-wrapper m-0" v-if="mounted" :key="durationUpdated">
      <div ref="timeline" class="timeline">
        <div>
          <draal-ruler
            units=" sec"
            :zoom="zoom"
            :key="rulerRender"
            :steps="timelineGridItems"
            :rulerWidth="timelineWidth"
          >
            <div ref="timelineparent"></div>
          </draal-ruler>
        </div>
        <div :key="timelineRender">
          <draal-timeline-item
            v-for="(timeline) in timelines"
            :key="timeline.$id"
            :index="timeline.$id"
            :position="timeline.position"
            :clicked="timeline.$clicked"
            :timelinelen="timelineWidth"
            :zoom="zoom"
            @highlightstop="highlightStop"
            @timelinepos="positionUpdate"
            @edit="timelineEdit"
            @move="moveTimeEntry"
          ></draal-timeline-item>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <draal-data-table
        :class="{ 'noselect': moving }"
        ondragstart="return false"
        class="w-100"
        :key="tableRender"
        :data="timelines"
        :tableAttributes="{'item-key': '$id'}"
        v-bind="tableConfig"
        @row-click="handleClick"
        @data-edit="editAction"
        @data-delete="deleteAction"
      >
        <!-- Expose custom render columns for parent rendering -->
        <template v-for="(columnDef, index) in customRenderColumns" v-slot:[columnDef]="{data}">
          <slot :name="columnDef" v-bind:colunmKey="index" v-bind:data="data"></slot>
        </template>
      </draal-data-table>
    </div>

    <draal-dialog :model="editDialog" :title="editText" @close-dialog="closeDialog">
      <template v-slot:body>
        <!--
          @slot Dialog body slot
          @binding {} componentKey Component key (Vue key attribute).
          @binding {object} editData Dialog data.
          @binding {function} editChanges To be called with true if data was changed.
        -->
        <slot
          name="editDialog"
          v-bind:componentKey="dialogKey"
          v-bind:editData="dialogEditData"
          v-bind:editChanges="dialogEditChanges"
        ></slot>
      </template>
    </draal-dialog>
  </div>
</template>

<script>
import { appActions, appComputed } from '@/store/helpers';
import DraalDialog from '@/components/core/utils/Dialog.vue';
import DraalRuler from '@/components/core/utils/Ruler.vue';
import DraalTimelineItem from './TimelineItem.vue';
import DraalDataTable from '@/components/core/DataTable.vue';

export default {
    name: 'DraalTimeline',
    components: {
        DraalTimelineItem,
        DraalDialog,
        DraalRuler,
        DraalDataTable
    },
    props: {
        /**
         * ID for the timeline.
         */
        timelineID: {
            type: String,
            required: false,
            default: 'timeline'
        },
        /**
         * Initial time data.
         */
        timeData: {
            type: Array,
            required: false,
            default: () => []
        },
        /**
         * Timeline lengths. Each timeline length must be divisible with
         * the `timelineGridItems` value.
         */
        timelineWidths: {
            type: Array,
            required: true
        },
        /**
         * Timeline data editing text.
         */
        editText: {
            type: String,
            required: false,
            default: 'Edit data'
        },
        /**
         * Function for creating new timeline item.
         */
        itemCreator: {
            type: Function,
            required: true
        },
        /**
         * Number of items in the timeline grid.
         */
        timelineGridItems: {
            type: Number,
            required: false,
            default: 15
        },
        /**
         * Table props for the underlying data table.
         */
        tableConfig: {
            type: Object,
            required: false,
            default: () => {}
        },
        /**
         * Maximum timeline zoom factor.
         */
        maxZoom: {
            type: Number,
            required: false,
            default: 5
        },
        /**
         * If true, every change in the data is automatically saved.
         */
        saveOnEdit: {
            type: Boolean,
            required: false,
            default: false
        },
        /**
         * Timeline scroll track color.
         */
        timelineScrollColor: {
            type: String,
            required: false,
            default: '#03A9F4'
        },
        /**
         * Timeline scroll track color on hover.
         */
        timelineScrollHoverColor: {
            type: String,
            required: false,
            default: '#0277BD'
        },
        /**
         * Observable for monitoring data changes in related components. Data changes
         * are communicated via the observable. Here the data that is being monitored
         * is related to the timeline duration.
         */
        dataProvider: {
            type: Object,
            required: false,
            default: null
        }
    },
    data() {
        const baseTime = Date.now();

        return {
            dialogKey: 0,
            timelineRender: 0,
            tableRender: 0,

            dialogEditData: {},
            editDialog: false,
            timelines: this.timeData.map((item, index) => ({
                ...item,
                $clicked: false,
                $id: baseTime + index
            })),
            timelineWidth: this.timelineWidths[0].width,
            timelineMenuWidths: [...this.timelineWidths],

            hasChanges: false,
            mounted: false,

            zoom: 1,
            moving: false,
            rulerRender: 0,

            durationUpdated: 0
        };
    },
    async mounted() {
        // Timeline data duration is updated that affects also this component rendering
        this.dataProvider.subscribe(({ data }) => {
            const { duration } = data;

            this.timelineMenuWidths.splice(0, this.timelineMenuWidths.length);
            this.timelineMenuWidths.push({ width: duration });
            this.timelineWidth = duration;
            this.timelines.splice(0, this.timelines.length);

            // New timeline is emitted to parent or automatically saved.
            // The timeline state, however, is now unchanged in the component.
            this.setChanges(true, true);
            this.setChanges(false); // Just turn the changes state to off

            this.durationUpdated += 1;
        });

        // Get saved timeline length from store
        this.timelineWidth = this.getTimelineLength(this.timelineID) || this.timelineWidth;

        // Child component requires access to parent DOM, so make sure DOM is available
        // before child is prepared.
        await this.$nextTick();
        this.mounted = true;
    },
    computed: {
        getTimelineLength: appComputed.getTimelineLength,

        // Custom columns for data table rendering
        customRenderColumns() {
            const customRendering = this.tableConfig ? this.tableConfig.customColumns || [] : [];
            return customRendering.map(column => (`table.${column}`));
        },

        // Actions to change timeline width
        actions() {
            return this.timelineMenuWidths.map(item => ({
                title: item.title,
                fn: () => this.saveLength(item.width)
            }));
        }
    },
    methods: {
        saveTimelineLength: appActions.saveTimelineLength,

        // Change zoom level (increase or decrease)
        setZoom(inc) {
            const zoom = this.zoom + inc;
            const stepSize = this.timelineWidth / (zoom * this.timelineGridItems);

            // Don't go below original size and exceed maximum zoom.
            // In addition, stop if time interval falls below 1.
            if (zoom > 0 && zoom <= this.maxZoom && stepSize >= 1) {
                this.zoom = zoom;
                this.rulerRender += 1;
                this.renderTimeline();
            }
        },

        // Save selected timeline length
        saveLength(length) {
            this.saveTimelineLength({ id: this.timelineID, length });
            this.timelineWidth = length;
            this.renderTimeline();
        },

        // Force timeline re-rendering
        renderTimeline() {
            this.timelineRender += 1;
        },

        // Force data table re-rendering
        renderTable() {
            this.tableRender += 1;
        },

        // Set changes status for the timeline data
        setChanges(status, force = false) {
            this.hasChanges = status;
            if (this.hasChanges) {
                if (this.saveOnEdit === false || force) {
                    /**
                     * Timeline contains changes event.
                     *
                     * @property {Array} timelines Timeline data.
                     */
                    this.$emit('timelineChanged', this.timelines);
                }

                if (this.saveOnEdit === true || force) {
                    // Automatic save
                    this.sendTimelineEvent();
                }

                this.renderTable();
            }
        },

        // Add new timeline item
        addItem() {
            // Make sure items are added with reasonable distance with
            // respect to previous item. Thus, take into account the
            // length of the currently selected timeline.
            const incPos = this.timelineWidth / this.timelineGridItems;

            // Add new timeline item next to last item
            const len = this.timelines.length;
            const position = len ? this.timelines[len - 1].position + incPos : 0;

            this.timelines.push({
                ...this.itemCreator(),
                position,
                $clicked: false,
                $id: Date.now() // Should be unique ID
            });

            this.setChanges(true);
        },

        // Timeline item is edited
        editAction(index) {
            this.dialogEditData = this.timelines[index];
            this.editDialog = true;
            this.dialogKey += 1;
        },

        // Timeline item is deleted
        deleteAction(index) {
            this.timelines.splice(index, 1);
            this.setChanges(true);
        },

        closeDialog() {
            this.editDialog = false;
        },

        dialogEditChanges(status) {
            this.setChanges(status || true);
        },

        highlightStop(id) {
            const index = this.getTimelineIndex(id);
            this.timelines[index].$clicked = false;
        },

        positionUpdate(id, position) {
            const index = this.getTimelineIndex(id);
            this.timelines[index].position = position;

            function compare(a, b) {
                if (a.position < b.position) {
                    return -1;
                }

                if (a.position > b.position) {
                    return 1;
                }

                return 0;
            }

            this.timelines.sort(compare);
            this.setChanges(true);
            this.renderTable();
        },

        handleClick(index) {
            /* eslint-disable no-param-reassign */
            this.timelines.forEach(item => {
                item.$clicked = false;
            });
            this.timelines[index].$clicked = true;
            this.renderTimeline();
            /* eslint-enable no-param-reassign */
        },

        timelineEdit(id) {
            const index = this.getTimelineIndex(id);
            this.editAction(this.timelines[index]);
        },

        getTimelineIndex(id) {
            return this.timelines.findIndex(item => item.$id === id);
        },

        sendTimelineEvent() {
            /**
             * Timeline data event.
             *
             * @property {Array} timeline Timeline data.
             */
            this.$emit('input', this.timelines);

            // No changes as parent is expected to handle the timeline data.
            this.setChanges(false);
        },

        moveTimeEntry(status) {
            setTimeout(() => { this.moving = status; }, 10);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.timeline {
    margin-top: 2%;
    margin-bottom: 3%;
    position: relative;
    width: 100%;
}

.scrolling-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.scrolling-wrapper-flexbox {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.scrolling-wrapper, .scrolling-wrapper-flexbox {
  height: auto;
  width: 100%;
  padding-right: 3% !important;
  padding-left: 1% !important;
}

::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
}

::-webkit-scrollbar-track {
    -webkit-border-radius: 10px;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: var(--thumb);
    border:1px solid #eee;
    height:100px;
    border-radius:5px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--thumbHover);
}
</style>
