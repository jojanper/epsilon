<template>
  <v-card v-if="data.length" class="mx-auto mt-3 mb-3 data-screen" max-width="2048">
    <v-card-text class="data-screen-text">
      <div v-for="(item, i) in data" :key="i">
        <div class="text-left pre-wrap data-screen-text" v-if="item.length" v-html="item"></div>
        <br v-if="!item.length" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { ansiColors } from '../../common/utils';

export default {
    name: 'DraalTerminal',
    props: ['dataInput'],
    computed: {
        data() {
            return this.dataInput
                .flat()
                .flatMap(item => item.split('\n'))
                .filter(item => item.length)
                .map(item => ansiColors(item));
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.data-screen {
    background: black;
}
.data-screen-text {
    color: white;
    font-weight: 700;
}
.pre-wrap {
    white-space: pre-wrap;
}
</style>
