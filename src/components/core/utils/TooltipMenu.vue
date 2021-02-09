<template>
  <draal-tooltip v-bind="tooltipAttrs" :name="tooltipText">
    <template v-slot:default="{ on: tooltip }">
      <draal-menu v-on="$listeners" :menuItems="menuItems" :menuAttrs="menuAttrs" :cbData="cbData">
        <template v-slot:default="{ on: menu }">
          <!--
              @slot Menu entry. Component must provide implementation for this.
          -->
          <slot name="menu-entry" v-bind:tooltip="tooltip" v-bind:menu="menu"></slot>
        </template>
        <template v-if="!menuItems.length" v-slot:menu-content="{ setVisibility }">
          <!--
              @slot Menu content. Component must provide implementation if no menu items available.
          -->
          <slot name="menu-content" v-bind:setVisibility="setVisibility"></slot>
        </template>
      </draal-menu>
    </template>
  </draal-tooltip>
</template>

<script>
import DraalTooltip from '@/components/core/utils/Tooltip.vue';
import DraalMenu from '@/components/core/utils/Menu.vue';

/**
 * Component wrapping both DraalTooltip and DraalMenu.
 *
 * @displayName DraalTooltipMenu
 */
export default {
    name: 'DraalTooltipMenu',
    components: {
        DraalTooltip,
        DraalMenu
    },
    props: {
        /**
         * Tooltip text.
         */
        tooltipText: {
            type: String,
            required: true
        },
        /**
         * Additional tooltip attributes. All draal-tooltip attributes are applicable here.
         */
        tooltipAttrs: {
            type: Object,
            required: false,
            default: () => {}
        },
        /**
         * Menu attributes. All v-menu attributes are applicable here.
         */
        menuAttrs: {
            type: Object,
            required: true
        },
        /**
         * Menu items. Each items must contain 'fn' and 'title' fields.
         */
        menuItems: {
            type: Array,
            required: false,
            default: () => []
        },
        /**
         * Parameter data for menu item callback.
         */
        cbData: {
            required: false,
            default: null
        }
    }
};
</script>
