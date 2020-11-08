<template>
  <div class="ruler">
    <div v-for="index in gridItems + 1" :key="index" class="cm" :style="getRulerStyle(index)"></div>
  </div>
</template>

<script>
export default {
    name: 'DraalRuler',
    props: ['gridItems', 'rulerWidth', 'units'],
    methods: {
        getRulerStyle(index) {
            const slots = 100 / this.gridItems;
            const timePos = this.rulerWidth / this.gridItems;

            const left = slots * (index - 1);
            let content = timePos * (index - 1);
            if (this.units && index === this.gridItems + 1) {
                content = `${content}${this.units}`;
            }
            return `--left: ${left}%; --content: '${content}'`;
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
        width: 10%;
        left: var(--left);
        &:after {
            position: absolute;
            bottom: -15px;
            font: 11px/1 sans-serif;
            left: -3px;
            top: 20px;
            content: var(--content);
        }
    }
}
</style>
