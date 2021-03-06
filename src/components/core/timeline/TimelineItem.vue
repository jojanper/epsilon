<template>
  <div>
    <div ref="timelineparent"></div>
    <div v-if="eventPosition <= 1">
      <div
        @contextmenu.prevent="showContextMenu"
        class="timeline-entry"
        :class="{ 'timeline-highlight': isClicked, 'noselect': isMoving }"
        ref="timeline"
        ondragstart="return false"
      >
        <div v-if="mousedown" class="noselect timeline-entry-pos-text">{{ timestamp }}</div>
        <div class="mt-3">
          <v-menu v-model="menuOpened">
            <template v-slot:activator="{ on }">
              <v-btn class="menu" v-on="on"></v-btn>
            </template>

            <v-list>
              <v-list-item v-for="(item, i) in items" :key="i" @click="item.fn">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, takeWhile, debounceTime } from 'rxjs/operators';

export default {
    name: 'DraalTimelineItem',

    props: {
        /**
         * Item position in the timeline.
         */
        position: {
            type: Number,
            required: true
        },
        /**
         * Timeline item identifier.
         */
        index: {
            type: Number,
            required: true
        },
        /**
         * Timeline item highlight status.
         */
        clicked: {
            type: Boolean,
            required: false,
            default: false
        },
        /**
         * Length of timeline.
         */
        timelinelen: {
            type: Number,
            required: true
        },
        /**
         * How long the item highlight should be active.
         */
        clickedTimeout: {
            type: Number,
            required: false,
            default: 3000
        },
        /**
         * Editing name of timeline iten in context menu.
         */
        editText: {
            type: String,
            required: false,
            default: 'Edit'
        },
        /**
         * Zoom factor.
         */
        zoom: {
            type: Number,
            required: false,
            default: 1
        },
        /**
         * Number of pixels the mouse position can deviate from the
         * timeline item's top coordinates during mouse movement.
         */
        moveDiffTop: {
            type: Number,
            required: false,
            default: 50
        },
        /**
         * Number of pixels the mouse position can deviate from the
         * timeline item's bottom coordinates during mouse movement.
         */
        moveDiffBottom: {
            type: Number,
            required: false,
            default: 50
        }
    },

    data() {
        return {
            menuOpened: false,
            mousedown: false,
            timestamp: this.position,
            eventPosition: 0,
            isClicked: this.clicked,
            isMoving: false
        };
    },

    mounted() {
        this.setTimeout();

        // Timeline width
        this.timelineWidth = this.parentOffsetWidth();

        // Calculate initial timeline position in the UI
        this.renderTimePos();

        // Track mouse down events
        fromEvent(this.$refs.timeline, 'mousedown')
            .pipe(
                distinctUntilChanged(),
                debounceTime(50),
                takeWhile(() => this.destroy === false)
            )
            .subscribe(this.mouseDown);

        // Track mouse up events
        fromEvent(window, 'mouseup')
            .pipe(
                distinctUntilChanged(),
                takeWhile(() => this.destroy === false)
            )
            .subscribe(this.mouseUp);
    },

    created() {
        this.destroy = false;
        this.mousedown = false;
    },

    beforeDestroy() {
        this.destroy = true;
        this.clearTimeout();
    },

    computed: {
        items() {
            return [{ title: this.editText, fn: () => this.editEvent(this.index) }];
        }
    },

    methods: {
        clearTimeout() {
            if (this.timeOut) {
                clearTimeout(this.timeOut);
                this.timeOut = null;
            }
        },

        setTimeout() {
            // Timeline item is to be highlighted for specified amount of time
            if (this.clicked) {
                this.clearTimeout();

                this.timeOut = setTimeout(() => {
                    this.isClicked = false;

                    /**
                     * Timeline item highlight stop event.
                     *
                     * @property {number} id Timeline identifier.
                     */
                    this.$emit('highlightstop', this.index);
                }, this.clickedTimeout);
            }
        },

        // User requests editing of timeline item
        editEvent(id) {
            /**
             * Edit event request.
             *
             * @property {number} id Timeline identifier.
             */
            this.$emit('edit', id);
        },

        // Parent element's layout width
        parentOffsetWidth() {
            return this.zoom * this.$refs.timelineparent.offsetWidth;
        },

        // Return parent element's left position relative to top-left of viewport
        parentPos() {
            return this.$refs.timelineparent.getBoundingClientRect().left;
        },

        // Convert the time position into pixels and render position
        renderTimePos() {
            this.eventPosition = this.timestamp / this.timelinelen;
            const pixPos = this.eventPosition * this.timelineWidth;
            this.$refs.timeline.style.marginLeft = `${pixPos}px`;
        },

        // Move event as user drags the element along the timeline
        // Only x-axis movement is tracked
        // y-axis movement must be within specified limits
        moveTimeline(event) {
            if (this.mousedown) {
                event.stopPropagation();

                const target = this.$refs.timeline.getBoundingClientRect();
                const topThrPos = target.top - this.moveDiffTop;
                const bottomThrPos = target.bottom + this.moveDiffBottom;

                if (event.clientY >= topThrPos && event.clientY <= bottomThrPos) {
                    const newMargLeft = event.clientX - this.parentPos();
                    let eventPos = newMargLeft;

                    if (newMargLeft < 0) {
                        eventPos = 0;
                    }

                    if (newMargLeft > this.timelineWidth) {
                        eventPos = this.timelineWidth;
                    }

                    // Calculate time position with one decimal
                    const eventPosition = eventPos / this.timelineWidth;
                    const pos = this.timelinelen * eventPosition;
                    this.timestamp = parseFloat(pos.toFixed(1), 10);

                    this.renderTimePos();
                } else {
                    this.mousedown = false;
                }
            }
        },

        // Mouse down released
        mouseUp(event) {
            if (this.mousedown) {
                event.stopPropagation();
                event.preventDefault();

                this.sendTimelineMoveEvent(false);
                this.clearMouseSelections();

                /**
                 * Send position update for timeline item.
                 *
                 * @property {number} id Timeline identifier.
                 * @property {number} position Timeline position.
                 */
                this.$emit('timelinepos', this.index, this.timestamp);
            }

            this.mousedown = false;
        },

        // User clicked mouse down, start tracking mouse movement along the timeline
        mouseDown(e) {
            // Context menu is not already open
            // User is not requesting opening context menu (right mouse button clicked)
            // User is not already moving timeline item
            if (!this.menuOpened && e.which === 1 && !this.mousedown) {
                e.stopPropagation();
                e.preventDefault();
                this.mousedown = true;
                this.itemClicked = 0;
                this.sendTimelineMoveEvent(true);

                fromEvent(window, 'mousemove')
                    .pipe(
                        distinctUntilChanged(),
                        takeWhile(() => this.mousedown === true)
                    )
                    .subscribe(this.moveTimeline);
            }
        },

        // Context menu should be opened
        showContextMenu() {
            this.menuOpened = true;
        },

        // Timeline item moving state has changed, send corresponding event
        sendTimelineMoveEvent(status) {
            this.isMoving = status;

            /**
             * Send timeline moving state.
             *
             * @property {number} state Timeline item moving state (true when item is moving, false otherwise).
             */
            this.$emit('move', this.isMoving);
        },

        // Clear any text selection made during timeline item movement
        clearMouseSelections() {
            if (document.selection) {
                document.selection.empty();
            } else {
                window.getSelection().removeAllRanges();
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.timeline-entry {
    top: 10px;
    position: absolute;
    left: -7.5px; // Offset so that marker is at the center of the mouse position
    height: 15px;
    width: 15px;
    background: blue;
    border: none !important;
    border-radius: 100% !important;
    box-shadow: 0 0 0 10px rgba(0, 0, 255, 0.2), 0 0 2px 0 #fafafa;
}

.timeline-highlight {
    background: #e91e63;
}

.timeline-entry-pos-text {
    position: relative;
    top: -30px;
    left: -0px;
    font-size: 0.75em;
    color: initial;
}

.menu {
    visibility: hidden !important;
}
</style>
