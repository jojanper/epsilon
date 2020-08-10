<template>
  <div>
    <div class="row">
      <div class="mr-auto mt-1">
        <v-icon @click="sendTimelineEvent">mdi-content-save-outline</v-icon>
        <div v-if="hasChanges" class="float-right pl-1 text-danger">{{ $t('timeline.unsaved') }}</div>
      </div>
      <div class="ml-auto">
        <v-menu left>
          <template v-slot:activator="{ on }">
            <v-icon @click="addItem">mdi-plus</v-icon>
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(action, i) in actions" :key="i" @click="action.fn">
              <v-list-item-title>{{ action.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <div class="row">
      <div class="timeline w-100" ref="timelineparent" :key="componentKey2">
        <draal-ruler units=" sec" :gridItems="timelineGridItems" :rulerWidth="timeLineWidth"></draal-ruler>
        <draal-timeline-item
          v-for="(timeline, index) in timelines"
          :key="index"
          :index="timeline.$id"
          :position="timeline.position"
          :clicked="timeline.$clicked"
          :timelinelen="timeLineWidth"
          @highlightstop="highlightStop"
          @timelinepos="positionUpdate"
          @edit="timelineEdit"
        ></draal-timeline-item>
      </div>
    </div>

    <div class="row">
      <v-data-table
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
          v-bind:componentKey="componentKey"
          v-bind:editData="dialogEditData"
          v-bind:editChanges="dialogEditChanges"
        ></slot>
      </template>
    </draal-dialog>
  </div>
</template>

<script>
import DraalTimelineItem from './TimelineItem.vue';
import DraalDialog from './utils/Dialog.vue';
import DraalRuler from './utils/Ruler.vue';
import WheelInput from './form/inputs/WheelInput.vue';

export default {
    name: 'DraalTimeline',
    components: {
        DraalTimelineItem,
        DraalDialog,
        DraalRuler,
        WheelInput
    },
    props: {
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
        return {
            componentKey: 0,
            componentKey2: 0,

            dialogEditData: {},
            editDialog: false,
            timelines: [],

            expanded: [],

            timeLineWidth: this.timelineWidths[0].width,

            hasChanges: false
        };
    },
    mounted() {
        // Include initial timeline data
        setTimeout(() => {
            this.timeData.forEach(item => {
                const timeline = {
                    ...item,
                    $clicked: false,
                    $id: Date.now()
                };

                this.timelines.push(timeline);
            });
        }, 0);
    },
    computed: {
        customRenderColumns() {
            return this.customRendering.map(column => ({ column: `item.${column}`, name: `table.${column}` }));
        },

        actions() {
            return this.timelineWidths.map(item => ({
                title: item.title,
                fn: () => this.setTimelineWidth(item.width)
            }));
        }
    },
    methods: {
        setChanges(status) {
            this.hasChanges = status;
            if (this.hasChanges) {
                /**
                 * Timeline contains changes event.
                 *
                 * @property {Array} timelines Timeline data.
                 */
                this.$emit('timelineChanged', this.timelines);
            }
        },

        setTimelineWidth(width) {
            this.timeLineWidth = width;
            this.componentKey2 += 1;
        },

        addItem() {
            // Add new timeline item next to last item
            const len = this.timelines.length;
            const position = len ? this.timelines[len - 1].position + 1 : 0;

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
            this.componentKey += 1;
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
            this.componentKey2 += 1;
        },

        handleClick(data) {
            /* eslint-disable no-param-reassign */
            this.timelines.forEach(item => {
                item.$clicked = false;
            });
            data.$clicked = true;
            this.componentKey2 += 1;
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
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.timeline {
    margin-top: 2.1em;
    margin-bottom: 5em;
    background-color: rgba(0, 0, 0, 0.12);
    height: 5px;
    position: relative;
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
</style>
