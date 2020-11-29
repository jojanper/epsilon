<template>
  <div>
    <slot>
      <!--div ref="timelineparent">
        <div v-for="index in gridItems + 1" :key="index" class="cmm" :style="getRulerStyle(index)"></div>
      </div-->
    </slot>
    <div class="ruler">
      <div>
        <div v-for="index in gridItems + 1" :key="index" class="cm2" :style="getRulerStyle(index)"></div>
      </div>
      <div>
        <div v-for="index in gridItems + 1" :key="index" class="cm" :style="getRulerStyle(index)"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'DraalRuler',
    props: ['gridItems', 'rulerWidth', 'units', 'zoom'],
    methods: {
        getRulerStyle(index) {
            const slots = (this.zoom * 100) / (this.gridItems * 1);
            const timePos = this.rulerWidth / this.gridItems;

            let width = `--width: ${slots}%`;

            const left = slots * (index - 1) + 0;
            let content = (timePos * (index - 1)).toFixed(1);
            content = content.toString();

            if (this.units && index === this.gridItems + 1) {
                content = `${content}${this.units}`;
                width = '';
            }
            return `--left: ${left}%; --content: '${content}'; ${width}`;
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
            left: -7px;
            top: 20px;
            content: var(--content);
        }
    }

    .cm2 {
        position: absolute;
        //width: 100%;
        height: 7px;
        top: -30px;
        //&:before {
            //top: -5px;
            background-color: rgba(0, 0, 0, 0.12);
        //}

        left: var(--left);
        width: var(--width);
}

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
