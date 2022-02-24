<template>
  <v-list style="background: inherit;">
    <template v-for="(node, i) in nodes">
      <v-list-group
        v-if="node.children && node.children.length"
        v-model="node.active"
        :key="i"
        class="ml-0"
      >
        <div
          slot="activator"
          class="v-list-item pl-0 ml-0"
        >
          <v-list-item>
            <v-list-item-title style="flex: none;">{{node.text}}</v-list-item-title>
          </v-list-item>
        </div>

        <draal-nested-view
          class="pl-2 ml-2"
          :nodes="node.children"
          @selected="$emit('selected', i, node)"
        />
      </v-list-group>
      <v-list-group
        :key="i"
        append-icon=""
        v-else
      >
        <div
          slot="activator"
          class="v-list-item pl-0 ml-0"
        >
          <v-list-item @click="$emit('selected', i, node)">
            <v-list-item-title class="text-left">{{node.text}}</v-list-item-title>
          </v-list-item>
        </div>
      </v-list-group>
    </template>
  </v-list>
</template>

<script>
export default {
    name: 'DraalNestedView',
    props: {
        nodes: {
            type: Array,
            required: true
        }
    }
};
</script>

<style scoped lang="scss">
.v-list-group__header {
    padding-left: 0px !important;
}

.v-list-item {
    padding: 0;

    padding-left: 0px !important;

    &:hover:before {
      opacity: 0 !important;
    }

    &:focus:before {
      opacity: 0 !important;
    }

    &:focus:after {
      opacity: 0 !important;
    }
}
</style>
