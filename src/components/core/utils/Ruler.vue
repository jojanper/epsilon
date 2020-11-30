<template>
  <div>
    <slot>
      <!--div ref="timelineparent">
        <div v-for="index in gridItems + 1" :key="index" class="cmm" :style="getRulerStyle(index)"></div>
      </div-->
    </slot>
    <div class="ruler">
      <div class="timeline-bar" :style="getTimelineBar"></div>
      <!--div>
        <div v-for="index in gridItems + 1" :key="index" class="cm2" :style="getRulerStyle(index)"></div>
      </div-->
      <div ref="ruler">
        <div v-for="index in gridItems + 1" :key="index" class="cm" :style="getRulerStyle(index)"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'DraalRuler',
    props: ['gridItems', 'rulerWidth', 'units', 'zoom'],
    data() {
        return {
            width: 0,
            ro: null
        };
    },
    mounted() {
        console.log(this.$refs.ruler.scrollWidth);
        this.width = this.$refs.ruler.scrollWidth + 0;

        // Not supported on every browser, see https://caniuse.com/resizeobserver
        this.ro = new ResizeObserver(this.onResize.bind(this)).observe(this.$refs.ruler);

/*
        this.$watch(
            () => {
                return this.$refs.ruler.scrollWidth;
            },
            val => {
                console.log('WIDTH', val);
            }
        );
        */
    },
    destroyed() {
        console.log('DESTROYED');
        delete this.ro;
    },
    watch: {
        zoom() {
            if (this.$refs.ruler) {
                this.width = this.$refs.ruler.scrollWidth;
            }
        }
    },
    computed: {
        getTimelineBar() {
            // const width = this.$refs.ruler ? this.$refs.ruler.scrollWidth : 0;
            // const width = this.$refs.timeline ? this.$refs.timeline.scrollWidth : 0;
            const width = this.zoom * this.width;
            const ret = `--width: ${width}px;`;

            return ret;
        }
    },
    methods: {
        onResize() {
            // this.$emit('resize', this.$refs.myElement.offsetHeight)
            console.log(this.$refs);
            if (this.$refs.ruler) {
                this.width = this.$refs.ruler.scrollWidth;
            }
        },

        getRulerStyle(index) {
            let after = '-6px';

            const slots = (this.zoom * 100) / (this.gridItems * 1);
            const timePos = this.rulerWidth / this.gridItems;

            let width = `--width: ${slots}%`;

            const left = slots * (index - 1) + 0.1;
            let content = (timePos * (index - 1)).toFixed(1);

            console.log(content);
            if (content.toString().split('.')[1] === '0') {
                console.log(content);
                content = Math.floor(content);
            }

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

            if (this.units && index === this.gridItems + 1) {
                //content = `${content}${this.units}`;
                //content = '';
                width = '';
                after = '-12px';
            }
            return `--after: ${after}; --left: ${left}%; --content: '${content}'; ${width}`;
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
        width: var(--width);
        left: var(--left);
        &:after {
            position: absolute;
            bottom: -15px;
            font: 11px/1 sans-serif;
            // left: -7px;
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
