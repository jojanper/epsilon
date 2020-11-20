<template>
  <div>
    <div class="row">
      <div class="mr-auto">
        <v-icon @click="sendTimelineEvent">mdi-content-save-outline</v-icon>
        <div v-if="hasChanges" class="float-right pl-1 text-danger">{{ $t('timeline.unsaved') }}</div>
      </div>

      <div class="ml-auto">
        <v-menu left>
          <template v-slot:activator="{ on }">
            <div>
              <v-icon @click="addItem">mdi-plus</v-icon>
              <v-icon @click="addItem" large>mdi-magnify-plus-outline</v-icon>
              <v-icon @click="addItem" large>mdi-magnify-minus-outline</v-icon>
              <v-btn icon v-on="on">
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

    <div class="row scrolling-wrapper pt-3" v-if="mounted">
      <div class="timeline w-100" :key="timelineRender">
        <div ref="timelineparent">
          <div
            v-for="index in timelineGridItems"
            :key="index"
            class="cmm"
            :style="getRulerStyle(index)"
          ></div>
        </div>
        <draal-ruler
          units=" sec"
          :zoom="zoom"
          :gridItems="zoom * timelineGridItems"
          :rulerWidth="timelineWidth"
        ></draal-ruler>
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
        ></draal-timeline-item>
      </div>
    </div>

    <div class="row">
      <v-data-table
        :key="tableRender"
        class="mt-3 pt-3 w-100"
        :headers="tableHeaders"
        :items="timelines"
        item-key="$id"
        @click:row="handleClick"
      >
        <template
          v-for="(columnDef, index) in customRenderColumns"
          v-slot:[columnDef.column]="{item}"
        >
          <!--
            @slot Custom table column data rendering.
            @binding {number} columnKey Column key (Vue key attribute).
            @binding {object} data Column data.
          -->
          <slot :name="columnDef.name" v-bind:colunmKey="index" v-bind:data="item"></slot>
        </template>

        <template v-slot:item.action="{item}">
          <v-btn class="mx-2" fab dark x-small color="pink" @click="editAction(item)">
            <v-icon dark>mdi-border-color</v-icon>
          </v-btn>
          <v-btn class="mx-2" fab dark x-small color="pink" @click="deleteAction(item)">
            <v-icon dark>mdi-delete-forever</v-icon>
          </v-btn>
        </template>
      </v-data-table>
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

export default {
    name: 'DraalTimeline',
    components: {
        DraalTimelineItem,
        DraalDialog,
        DraalRuler
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
         * Table header column definition
         */
        tableHeaders: {
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
         * Columns of the timeline data table that are custom rendered by the parent.
         */
        customRendering: {
            type: Array,
            required: false,
            default: () => []
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

            hasChanges: false,
            mounted: false,

            zoom: 1
        };
    },
    async mounted() {
        // Child component requires access to parent DOM, so make sure DOM is available
        // before child is prepared.
        await this.$nextTick();
        this.mounted = true;

        // Get saved timeline length from store
        this.timelineWidth = this.getTimelineLength(this.timelineID) || this.timelineWidth;
    },
    computed: {
        getTimelineLength: appComputed.getTimelineLength,

        customRenderColumns() {
            return this.customRendering.map(column => ({ column: `item.${column}`, name: `table.${column}` }));
        },

        actions() {
            return this.timelineWidths.map(item => ({
                title: item.title,
                fn: () => this.saveLength(item.width)
            }));
        }
    },
    methods: {
        saveTimelineLength: appActions.saveTimelineLength,

        saveLength(length) {
            this.saveTimelineLength({ id: this.timelineID, length });
            this.timelineWidth = length;
            this.renderTimeline();
        },

        renderTimeline() {
            this.timelineRender += 1;
        },

        renderTable() {
            this.tableRender += 1;
        },

        setChanges(status) {
            this.hasChanges = status;
            if (this.hasChanges) {
                /**
                 * Timeline contains changes event.
                 *
                 * @property {Array} timelines Timeline data.
                 */
                this.$emit('timelineChanged', this.timelines);
                this.renderTable();
            }
        },

        addItem() {
            // Make sure items are added with reasonable distance with
            // respect to previous item. Thus, take into account the
            // length of the currently selected timeline.
            const incPos = this.timeLineWidth / this.timelineGridItems;

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

        editAction(data) {
            this.dialogEditData = data;
            this.editDialog = true;
            this.dialogKey += 1;
        },

        deleteAction(data) {
            const index = this.getTimelineIndex(data.$id);
            this.timelines.splice(index, 1);
            this.setChanges(true);
        },

        closeDialog() {
            this.editDialog = false;
        },

        dialogEditChanges(status) {
            this.setChanges(status);
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

        handleClick(data) {
            /* eslint-disable no-param-reassign */
            this.timelines.forEach(item => {
                item.$clicked = false;
            });
            data.$clicked = true;
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

        getRulerStyle(index) {
            const slots = (this.zoom * 100) / this.timelineGridItems;
            const left = slots * (index - 1);

            return `--left: ${left}%; --width: ${slots}%`;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.timeline {
    margin-top: 2.1em;
    margin-bottom: 3em;
    //background-color: rgba(0, 0, 0, 0.12);
    //height: 5px;
    position: relative;
    //width: 100%;
}

.timeline-bar {
    position: relative;
    background-image: linear-gradient(
        90deg,
        transparent 79px,
        rgba(0, 0, 0, 0.12) 79px,
        rgba(0, 0, 0, 0.12) 81px,
        transparent 81px
    );
    background-image: 2px solid rgba(0, 0, 0, 0.12);
    background-repeat: repeat-x;
    height: 25px;
    top: 25px;
    right: -5px;
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

/*
.card {
  border: 2px solid red;
  width: 150px;
  height: 75px;
  background: black;
}
*/

.scrolling-wrapper, .scrolling-wrapper-flexbox {
  //height: 80px;
  height: auto;
  //margin-bottom: 20px;
  width: 100%;
  padding-right: 3%;
  padding-left: 2%;
  //-webkit-overflow-scrolling: touch;
  //&::-webkit-scrollbar {
  //  display: none;
  //}
}

.cmm {
    position: absolute;
    //top: -30px;
    //border-top: 6px solid rgba(0, 0, 0, 0.12);
    background-color: rgba(0, 0, 0, 0.12);
    height: 6px;
    left: var(--left);
    width: var(--width);
}

</style>
