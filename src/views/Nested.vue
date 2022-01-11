<template>
  <v-list style="background: inherit;">
    <template v-for="(node, i) in nodes">
      <v-list-group
        v-if="node.children && node.children.length"
        v-model="node.active"
        :key="i"
        class="ml-0"
      >
        <!--v-list-item
          @click.prevent
          slot="activator"
        >
          <v-list-item-title class="text-left">{{node.text}}</v-list-item-title>
        </v-list-item-->

        <div
          slot="activator"
          class="v-list-item pl-0 ml-0"
        >
          {{node.text}}
        </div>

        <draal-nested-view
          class="pl-4 ml-4"
          :nodes="node.children"
        />
      </v-list-group>
      <v-list-item
        :key="i"
        @click.prevent
        v-else
        class="ml-4"
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
