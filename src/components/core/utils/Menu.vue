<template>
  <v-menu v-bind="menuAttrs">
    <template v-slot:activator="{ on }">
      <!--
        @slot Default menu entry point visible to the user.
      -->
      <slot name="default" v-bind:on="on">
        <v-icon v-if="iconAttrs && iconAttrs.icon" v-bind="iconAttrs" v-on="on">{{ iconAttrs.icon }}</v-icon>
      </slot>
    </template>

    <v-list>
      <v-list-item v-for="(action, i) in menuItems" :key="i" @click="action.fn">
        <v-list-item-title class="draal-menu-action-title">{{ action.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
/**
 * Menu component.
 *
 * @displayName DraalMenu
 */
export default {
    name: 'DraalMenu',
    props: {
        /**
         * Menu attributes. All v-menu attributes are applicable here.
         */
        menuAttrs: {
            type: Object,
            required: true
        },
        /**
         * Menu items. Must contain 'fn' and 'title' fields.
         */
        menuItems: {
            type: Array,
            required: true
        },
        /**
         * Icon attributes. All v-icon attributes are applicable here.
         */
        iconAttrs: {
            type: Object,
            required: false,
            default: () => {}
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.draal-menu-action-title {
    margin-left: 10px;
    margin-right: 10px;
}
</style>
