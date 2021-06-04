<template>
  <div :style="`--thumb: ${timelineScrollColor}; --thumbHover: ${timelineScrollHoverColor}`">
    <div class="row m-0 pl-0 pt-0 pr-0 timeline-toolbar">
      <div class="col-sm-9 pl-0">
        <div
          v-if="leftToolbar"
          :class="toolbarClasses"
        >
          <!--
            @slot Toolbar left slot
            @binding {object} data Timeline manipulation functions.
          -->
          <slot
            name="table.toolbar-left"
            v-bind:data="{ add: addItem }"
          ></slot>
        </div>
      </div>

      <div class="col-sm pr-0">
        <div
          class="ml-auto timeline-toolbar-right"
          :class="toolbarClasses"
        >
          <div class="clearfix">
            <div class="float-right">
              <!--
                @slot New timeline event slot.
                @binding {object} data Timeline manipulation functions.
              -->
              <slot
                name="table.toolbar-right.add"
                v-bind:data="{ add: addItem }"
              >
                <draal-tooltip
                  v-bind="toolIconAttrs"
                  :name="$t('timeline.new')"
                  icon="mdi-plus"
                  @clicked="addItem()"
                ></draal-tooltip>
              </slot>
              <draal-tooltip
                v-if="!saveOnEdit"
                v-bind="toolIconAttrs"
                :name="!hasChanges ? $t('timeline.save') : $t('timeline.unsaved')"
                :icon-color="hasChanges ? 'red' : ''"
                icon="mdi-content-save-outline"
                @clicked="sendTimelineEvent"
              ></draal-tooltip>
              <draal-tooltip
                v-bind="toolIconAttrs"
                :name="$t('timeline.zoomin')"
                icon="mdi-magnify-plus-outline"
                @clicked="setZoom(1)"
              ></draal-tooltip>
              <draal-tooltip
                v-bind="toolIconAttrs"
                :name="$t('timeline.zoomout')"
                icon="mdi-magnify-minus-outline"
                @clicked="setZoom(-1)"
              ></draal-tooltip>
              <draal-tooltip
                v-if="help"
                v-bind="toolIconAttrs"
                :name="$t('timeline.info')"
                icon="mdi-information-outline"
                @clicked="$emit('help')"
              ></draal-tooltip>

              <!--
                @slot Toolbar right slot
              -->
              <slot name="table.toolbar-right"></slot>

              <draal-tooltip
                v-if="timelineMenuWidths.length > 1"
                :name="$t('timeline.lengthMenu')"
                :position="toolbarTooltipPosition"
              >
                <template v-slot:default="{ on: tooltip }">
                  <draal-menu
                    :menuItems="actions"
                    :menuAttrs="{ left: true, 'offset-y': true, absolute: true }"
                  >
                    <template v-slot:default="{ on: menu }">
                      <v-icon
                        v-bind="timelineMenuWidthAttrs"
                        v-on="{ ...menu, ...tooltip}"
                      >mdi-dots-vertical</v-icon>
                    </template>
                  </draal-menu>
                </template>
              </draal-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="row scrolling-wrapper"
      v-if="mounted"
      :key="durationUpdated"
    >
      <div
        ref="timeline"
        class="timeline"
      >
        <div>
          <draal-ruler
            :zoom="zoom"
            :key="rulerRender"
            :rulerWidth="timelineWidth"
            @resize="renderTimeline"
            @zoom-level="level => zoom = level"
          ></draal-ruler>
        </div>
        <div :key="timelineRender">
          <draal-timeline-item
            v-for="(timeline) in filteredTimelineMarkers"
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
        :data-filtering="filterStatus"
        @row-click="handleClick"
        @data-edit="editAction"
        @data-delete="deleteAction"
        @data-filter="setTimelineMarkerFilter"
      >
        <!-- Expose custom render columns for parent rendering -->
        <template
          v-for="(columnDef, index) in customRenderColumns"
          v-slot:[columnDef]="{data}"
        >
          <slot
            :name="columnDef"
            v-bind:colunmKey="index"
            v-bind:data="data"
          ></slot>
        </template>
      </draal-data-table>
    </div>

    <draal-dialog
      :maxWidth="dialogWidth"
      :model="editDialog"
      @close-dialog="closeDialog"
    >
      <template v-slot:header>
        <div class="headline pt-3">{{ editText }}</div>
      </template>

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
import DraalTimelineItem from './TimelineItem.vue';
import { appActions, appComputed } from '@/store/helpers';
import DraalDialog from '@/components/core/utils/Dialog.vue';
import DraalRuler from '@/components/core/utils/Ruler.vue';
import DraalTooltip from '@/components/core/utils/Tooltip.vue';
import DraalMenu from '@/components/core/utils/Menu.vue';
import DraalDataTable from '@/components/core/DataTable.vue';

export default {
    name: 'DraalTimeline',
    components: {
        DraalTimelineItem,
        DraalDialog,
        DraalRuler,
        DraalDataTable,
        DraalTooltip,
        DraalMenu
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
            default: 10
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
        },
        /**
         * Maximum editing dialog width.
         */
        dialogWidth: {
            type: String,
            required: false,
            default: '400'
        },
        /**
         * Toolbar styling classes.
         */
        toolbarClasses: {
            type: String,
            required: false,
            default: 'rounded border elevation-3 p-1 pl-4 pr-4'
        },
        /**
         * Custom slots that the component should offer for parent.
         */
        customSlots: {
            type: Array,
            required: false,
            default: () => []
        },
        /**
         * Tooltip position of toolbar icons.
         */
        toolbarTooltipPosition: {
            type: String,
            required: false,
            default: 'top'
        },
        /**
         * Toolbar icon sizes.
         */
        toolbarIconSize: {
            type: String,
            required: false,
            default: 'medium'
        },
        /**
         * If true, show help icon on the toolbar. Emits 'help' event on click.
         */
        help: {
            required: false,
            default: false
        }
    },
    data() {
        const baseTime = Date.now();

        const timelineMenuWidthAttrs = {
            [`${this.toolbarIconSize}`]: true
        };

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

            durationUpdated: 0,

            toolIconAttrs: {
                position: this.toolbarTooltipPosition,
                iconSize: this.toolbarIconSize,
                classes: 'ml-1'
            },

            leftToolbar: this.leftToolBarRequested(),

            timelineMenuWidthAttrs,

            eventFiltering: [],
            filterStatus: []
        };
    },
    async mounted() {
        // Timeline data duration is updated that affects the rendering
        this.dataProvider.subscribe(({ data }) => {
            let duration;
            if (data) {
                ({ duration } = data);
            }

            duration = duration || 0;

            // Only one timeline duration available
            this.timelineMenuWidths.splice(0, this.timelineMenuWidths.length);
            this.timelineMenuWidths.push({ width: duration });
            this.timelineWidth = duration;
            this.timelines.splice(0, this.timelines.length);
            this.zoom = 1;

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

        // Actions menu to change timeline width
        actions() {
            return this.timelineMenuWidths.map(item => ({
                title: item.title,
                fn: () => this.saveLength(item.width)
            }));
        },

        // Return timeline markers; may return only a subset of events
        filteredTimelineMarkers() {
            return this.eventFiltering.length ? this.getFilteredTimeline() : this.timelines;
        }
    },
    methods: {
        saveTimelineLength: appActions.saveTimelineLength,

        // Exclude those timeline markers that are excluded from rendering
        getFilteredTimeline() {
            const { field } = this.tableConfig.dataFilter;
            return this.timelines.filter(data => this.eventFiltering.indexOf(data[field]) === -1);
        },

        // Is the left toolbar slot requested by parent
        leftToolBarRequested() {
            return this.customSlots.indexOf('toolbar-left') > -1;
        },

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
            this.rulerRender += 1;
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
        addItem(count, cb, params) {
            // Make sure items are added with reasonable distance with
            // respect to previous item. Thus, take into account the
            // length of the currently selected timeline.
            const incPos = this.timelineWidth / (this.zoom * this.timelineGridItems);

            // Add new timeline item next to last item
            const len = this.timelines.length;
            let position = len ? this.timelines[len - 1].position + incPos : 0;
            position = parseFloat(position.toFixed(1), 10);

            const baseId = Date.now();

            if (!cb) {
                // No callback defined, just add new item to timeline
                this.timelines.push({
                    ...this.itemCreator(params),
                    position: position > this.timelineWidth ? this.timelineWidth : position,
                    $clicked: false,
                    $id: baseId
                });
            } else {
                // Implementing template slot provides the new timeline item(s)
                const newItems = count || 0;
                const basePosition = position;
                for (let i = 0; i < newItems; i++) {
                    // Provide the starting position and timeline length.
                    // Template slot will call the provided callback that provides
                    // the new timeline item.
                    cb(basePosition, this.timelineWidth, i, data => {
                        // Must fit into timeline, otherwise addition is rejected
                        if (data && data.position < this.timelineWidth) {
                            this.timelines.push({
                                ...data,
                                $clicked: false,
                                $id: baseId + i
                            });

                            return true;
                        }

                        return false;
                    });
                }
            }

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

        // Edit dialog closed
        closeDialog() {
            this.editDialog = false;
        },

        // Set changes via dialog template slot
        dialogEditChanges(status) {
            this.setChanges(status || true);
        },

        // Stop timeline item highlighting
        highlightStop(id) {
            const index = this.getTimelineIndex(id);
            this.timelines[index].$clicked = false;
        },

        // Update event position in the timeline
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

        // Timeline table row clicked
        handleClick(index) {
            /* eslint-disable no-param-reassign */
            this.timelines.forEach(item => {
                item.$clicked = false;
            });
            if (this.timelines[index]) {
                this.timelines[index].$clicked = true;
            }
            this.renderTimeline();
            /* eslint-enable no-param-reassign */
        },

        // Specified timeline ID requested for editing
        timelineEdit(id) {
            const index = this.getTimelineIndex(id);
            this.editAction(index);
        },

        // Get timeline index that corresponds to specified ID
        getTimelineIndex(id) {
            return this.timelines.findIndex(item => item.$id === id);
        },

        // Send timeline to parent
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

        // Timeline marker position is under movement
        moveTimeEntry(status) {
            setTimeout(() => { this.moving = status; }, 10);
        },

        // New timeline marker filtering requested
        setTimelineMarkerFilter(data, selected) {
            // Timeline events for filtering
            this.eventFiltering.splice(0, this.eventFiltering.length);
            data.forEach(item => this.eventFiltering.push(item));

            // Status of each timeline event type. The above filtering array
            // contains the types that should get excluded from rendering
            this.filterStatus.splice(0, this.filterStatus.length);
            selected.forEach(item => this.filterStatus.push(item));
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.timeline-toolbar {
    padding-top: 10px;
    padding-bottom: 10px;
}

.timeline {
    margin-top: 2%;
    margin-bottom: 3%;
    padding-bottom: 15px;
    position: relative;
    width: 100%;
}

.scrolling-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  height: auto;
  padding-right: 23px;
  padding-left: 18px;
  padding-bottom: 0.25em;
  margin-bottom: 10px;
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
