<template>
  <v-list style="background: inherit;">
    <template v-for="(node, i) in nodes">
      <v-list-group
        v-if="node.children && node.children.length"
        v-model="node.active"
        :key="i"
      >
        <v-list-item
          @click
          slot="activator"
        >
          <v-list-item-title class="text-left">{{node.text}}</v-list-item-title>
        </v-list-item>
        <draal-nested-view
          class="py-0 pl-3"
          :nodes="node.children"
        />
      </v-list-group>
      <v-list-item
        :key="i"
        @click.prevent
        v-else
      >
        <v-list-item-title class="text-left">{{node.text}}</v-list-item-title>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
export default {
    name: 'DraalNestedView',
    props: ['nodes']
};
</script>

<style scoped lang="scss">
.v-list-item {
    padding: 0;
}
</style>
