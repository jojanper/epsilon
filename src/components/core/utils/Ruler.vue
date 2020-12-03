<template>
  <div>
    <slot></slot>
    <div class="ruler">
      <div class="timeline-bar" :style="getTimelineBar"></div>
      <div ref="ruler">
        <div
          v-for="index in zoom * steps + 1"
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
         * Number of steps in the ruler.
         */
        steps: {
            type: Number,
            required: true
        },
        /**
         * Ruler width.
         */
        rulerWidth: {
            type: Number,
            required: true
        },
        /**
         * Text appended after last number in the ruler.
         */
        units: {
            type: String,
            required: false,
            default: null
        },
        /**
         * Zoom factor.
         */
        zoom: {
            type: Number,
            required: false,
            default: 1
        }
    },
    data() {
        return {
            width: 0,
            resizeObserver: null
        };
    },
    mounted() {
        this.width = this.$refs.ruler.scrollWidth;

        // Not supported on every browser, see https://caniuse.com/resizeobserver
        this.resizeObserver = new ResizeObserver(this.onResize.bind(this)).observe(this.$refs.ruler);
    },
    destroyed() {
        delete this.resizeObserver;
    },
    computed: {
        getTimelineBar() {
            return `--width: ${this.zoom * this.width}px;`;
        }
    },
    methods: {
        onResize() {
            // Resize the timeline bar to match the size of the ruler
            if (this.$refs.ruler) {
                this.width = this.$refs.ruler.scrollWidth;
            }
        },

        getRulerStyle(index) {
            // Width of each time slot in percentages
            const slots = 100 / this.steps;

            // Step size between timestamps
            const timePos = this.rulerWidth / (this.zoom * this.steps);

            // Position of the time slot
            const left = slots * (index - 1) + 0.1;

            // Timestamp is rendered with only one decimal
            let content = (timePos * (index - 1)).toFixed(1);

            // Improve timestamp rendering: 12.0 => 12
            if (content.toString().split('.')[1] === '0') {
                content = Math.floor(content);
            }

            // Adjust the timestamp positioning such that it appears in the center
            let after = '-6px';
            content = content.toString();
            if (content.length === 1) {
                after = '-4px';
            } else if (content.length > 4) {
                after = '-12px';
            } else if (content.length > 3) {
                after = '-10px';
            } else if (content.length > 2) {
                after = '-8px';
            }

            // Last timestamp
            if (this.units && index === this.zoom * this.steps + 1) {
                after = '-12px';
                content = this.units ? `${content}${this.units}` : content;
            }

            return `--after: ${after}; --left: ${left}%; --content: '${content}'`;
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

    .cm {
        position: absolute;
        border-left: 1px solid #555;

        height: 14px;
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
