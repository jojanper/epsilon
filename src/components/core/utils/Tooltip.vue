<template>
  <v-tooltip v-bind="tooltipAttrs">
    <template v-slot:activator="{ on }">
      <!-- Scoped slot for advanced tooltip content -->
      <slot name="default" v-bind:on="on"></slot>

      <!-- Use icon for tooltip content -->
      <v-icon
        v-if="icon"
        :class="classes"
        v-on="on"
        v-bind="iconAttrs"
        @click="$emit('clicked')"
      >{{ icon }}</v-icon>

      <!-- Use link for tooltip content -->
      <a v-if="link" :class="classes" v-on="on" :href="linkUrl" :download="linkDownload">{{ link }}</a>
    </template>
    <span>{{ name }}</span>
  </v-tooltip>
</template>

<script>
export default {
    name: 'DraalTooltip',
    props: ['position', 'name', 'classes', 'icon', 'iconSize', 'iconColor', 'link', 'linkDownload', 'linkUrl'],
    computed: {
        tooltipAttrs() {
            return {
                [`${this.position}`]: true
            };
        },

        iconAttrs() {
            const iconSize = this.iconSize || 'x-large';
            const iconColor = this.iconColor || null;

            const attrs = {
                [`${iconSize}`]: true
            };

            if (iconColor) {
                attrs.color = iconColor;
            }

            return attrs;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
