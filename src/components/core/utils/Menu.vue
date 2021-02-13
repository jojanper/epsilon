<template>
  <v-menu v-bind="menuAttrs" v-model="value">
    <template v-slot:activator="{ on }">
      <!--
        @slot Default menu entry point visible to the user.
      -->
      <slot name="default" v-bind:on="on" v-bind:setVisibility="setVisibility">
        <v-icon v-if="iconAttrs && iconAttrs.icon" v-bind="iconAttrs" v-on="on">{{ iconAttrs.icon }}</v-icon>
      </slot>
    </template>

    <!--
      @slot Menu content.
    -->
    <slot name="menu-content" v-bind:setVisibility="setVisibility">
      <v-list v-if="menuItems.length">
        <v-list-item v-for="(action, i) in menuItems" :key="i" @click="action.fn(cbData)">
          <v-list-item-title class="text-left draal-menu-action-title">{{ action.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </slot>
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
         * Menu items. Each item must contain 'fn' and 'title' fields.
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
        },
        /**
         * Parameter data for menu item callback.
         */
        cbData: {
            required: false,
            default: null
        }
    },
    data() {
        return {
            value: false
        };
    },
    watch: {
        value(newValue) {
            this.$emit('visibility', newValue);
        }
    },
    methods: {
        setVisibility(status) {
            this.value = status;
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
