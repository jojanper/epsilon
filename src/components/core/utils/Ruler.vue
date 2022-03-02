<template>
  <div>
    <slot></slot>
    <div class="ruler">
      <div
        class="timeline-bar"
        :style="getTimelineBar"
      ></div>
      <div ref="ruler">
        <div
          v-for="index in maxIndex"
          :key="index"
          class="cm"
          :style="getRulerStyle(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Simple ruler component.
 *
 * @displayName DraalRuler
 */
export default {
    name: 'DraalRuler',
    props: {
        /**
         * Ruler width.
         */
        rulerWidth: {
            type: Number,
            required: true
        },
        /**
         * Text appended after the last timestamp in the ruler.
         */
        units: {
            type: String,
            required: false,
            default: null
        },
        /**
         * Zoom factor. The actual zoom level taken into use by the component
         * is emitted via 'zoom-level' event.
         */
        zoom: {
            type: Number,
            required: false,
            default: 1
        },
        /**
         * Zooming grid used for zooming at each level. Indicates the step
         * size of the time slots at each level. The number of time slots
         * available in the ruler changes depending on the level. Uses fixed
         * value (4) to determine the initial zoom level from the grid such that
         * decent amount of slots are available in the ruler.
         *
         * If only one item is specified in the grid, that value then indicates
         * the amount of time slots used at each zoom level. It is up to
         * the caller then decide how many zoom levels it wants to allow.
         *
         */
        zoomGrid: {
            type: Array,
            required: false,
            default: () => [60, 30, 20, 15, 10, 5, 3, 2, 1, 0.5]
        }
    },
    data() {
        // Number of steps initially
        const steps = this.zoomGrid.length > 1 ? 4 : this.zoomGrid[0];

        // Correct ruler rendering mode
        const fn = this.zoomGrid.length > 1 ? this.timeSlotsFromGrid : this.timeSlotsFromWidth;
        const { intZoom } = fn(steps);

        // Number of time slots, check how many slots fit into the timeline length
        let acc = 0;
        let index = 1;
        while (acc < intZoom * 100) {
            acc = (this.incSize / this.rulerWidth) * (index - 1) * 100 * intZoom;
            index += 1;
        }

        // Number of timeslot indices
        const maxIndex = index - 1;

        // Determine if timestamp of the timeline length should be shown as last item (in the ruler).
        // If the length is close to the end of previous time slot, then do not show the length.
        // Depending on the number of time slots, the last slot may end up being too close
        // to previous slot and the rendered ruler timestamps overlap with each other.
        this.showLast = true;
        acc = (this.incSize / this.rulerWidth) * (index - 3) * 100 * intZoom;
        if (intZoom * 100 - acc < 5) {
            // Do not show the last timestamp in the ruler
            this.showLast = false;
        }

        return {
            width: 0,
            resizeObserver: null,
            maxIndex,
            intZoom
        };
    },
    mounted() {
        this.width = this.$refs.ruler.scrollWidth;

        /**
         * Zoom level in use.
         *
         * @param {Number} level Current zoom level.
        */
        this.$emit('zoom-level', this.intZoom);

        // Not supported on every browser, see https://caniuse.com/resizeobserver
        this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
        this.resizeObserver.observe(this.$refs.ruler);
    },
    destroyed() {
        this.resizeObserver.disconnect();
    },
    computed: {
        getTimelineBar() {
            return `--width: ${this.intZoom * this.width}px;`;
        }
    },
    methods: {
        // Time slots in the ruler are simply determined from the width of the ruler
        timeSlotsFromWidth(steps) {
            this.incSize = this.rulerWidth / (this.zoom * steps);
            return {
                intZoom: this.zoom
            };
        },

        // Time slot length for each zoom level is read from pre-defined table
        timeSlotsFromGrid(steps) {
            function calculateSlots(widths, rulerWidth, targetSlots) {
                for (let i = 0; i < widths.length; i++) {
                    const slots = Math.floor(rulerWidth / widths[i]);
                    if (slots >= targetSlots) {
                        return i;
                    }
                }

                return widths.length - 1;
            }

            // Starting point zoom level
            const startZoom = calculateSlots(this.zoomGrid, this.rulerWidth, steps);
            const maxZoom = this.zoomGrid.length - startZoom;

            // Actual zoom level depends on which is the starting point zoom level
            const zoom = this.zoom + startZoom > this.zoomGrid.length ? maxZoom : this.zoom;
            const intZoom = this.zoom < 0 ? 0 : zoom;

            // Zoom index
            let zoomIndex = startZoom + intZoom - 1;
            if (zoomIndex > this.zoomGrid.length - 1) {
                zoomIndex = this.zoomGrid.length - 1;
            }

            // Time slot size
            this.incSize = this.zoomGrid[zoomIndex];

            return {
                intZoom
            };
        },

        onResize() {
            // Resize the timeline bar to match the size of the ruler
            if (this.$refs.ruler) {
                this.width = this.$refs.ruler.scrollWidth;

                /**
                 * Resize event.
                 */
                this.$emit('resize');
            }
        },

        getRulerStyle(index) {
            // Position of the time slot
            let left = (this.incSize / this.rulerWidth) * (index - 1) * 100 * this.intZoom;

            // This is the last time slot, fix the ending position as we cannot use
            // the incremental size (may be smaller for the last slot)
            if (left > this.intZoom * 100) {
                left = this.intZoom * 100;
            }

            // Timestamp is rendered with only one decimal
            let content = (this.incSize * (index - 1)).toFixed(1);

            const splitData = content.toString().split('.');

            // Improve timestamp rendering: 12.0 => 12
            if (splitData[1] === '0') {
                content = Math.floor(content);
            }

            // Timestamps with decimal values are indicated with less height
            const height = splitData[1] === '0' ? '14px' : '10px';

            // Adjust the timestamp positioning such that it appears in the center
            let after;
            let compensate = true;
            content = content.toString();
            if (content.length > 6) {
                after = -30;
            } else if (content.length > 5) {
                after = -26;
            } else if (content.length > 4) {
                after = -22;
            } else if (content.length > 3) {
                after = -18;
            } else if (content.length > 2) {
                after = -14;
            } else if (content.length > 1) {
                after = -12;
            } else {
                after = -4;
                compensate = false;
            }

            if (compensate && index !== this.maxIndex) {
                after += 6;
            }

            after = `${after}px`;

            // Last timestamp
            if (index === this.maxIndex) {
                left -= 0.3;
                content = this.showLast ? this.rulerWidth : '';
                content = this.units ? `${content}${this.units}` : content;
            }

            return `--height: ${height}; --after: ${after}; --left: ${left}%; --content: '${content}'`;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.ruler {
    position: relative;
    width: 100%;
    margin: 20px auto;
    height: 14px;
    top: 30px;
    color: initial;

    .cm {
        position: absolute;
        border-left: 1px solid #555;

        height: var(--height);
        left: var(--left);
        &:after {
            position: absolute;
            bottom: -15px;
            font: 11px/1 sans-serif;
            left: var(--after);
            top: 20px;
            content: var(--content);
        }
    }

    .timeline-bar {
        position: absolute;
        top: -35px;
        background-color: rgba(0, 0, 0, 0.12);
        height: 5px;
        width: var(--width);
    }
}
</style>
