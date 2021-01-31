<template>
  <v-tooltip v-bind="tooltipAttrs">
    <template v-slot:activator="{ on }">
      <!-- Scoped slot for advanced tooltip content -->
      <slot name="default" :class="classes" v-bind:on="on"></slot>

      <!-- Use icon for tooltip content -->
      <v-btn :class="classes" v-if="icon" icon v-on="on">
        <v-icon v-bind="iconAttrs" @click="$emit('clicked')">{{ icon }}</v-icon>
      </v-btn>

      <!-- Use link for tooltip content -->
      <a v-if="link" :class="classes" v-on="on" :href="linkUrl" :download="linkDownload">{{ link }}</a>
    </template>
    <span>{{ name }}</span>
  </v-tooltip>
</template>

<script>
export default {
    name: 'DraalTooltip',
    props: {
        name: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: false,
            default: 'top'
        },
        classes: {
            type: String,
            required: false,
            default: ''
        },
        icon: {
            type: String,
            required: false,
            default: ''
        },
        iconSize: {
            type: String,
            required: false,
            default: 'x-large'
        },
        iconColor: {
            type: String,
            required: false,
            default: null
        },
        link: {
            type: String,
            required: false,
            default: null
        },
        linkDownload: {
            type: String,
            required: false,
            default: null
        },
        linkUrl: {
            type: String,
            required: false,
            default: null
        }
    },
    computed: {
        tooltipAttrs() {
            return this.position ? { [`${this.position}`]: true } : {};
        },

        iconAttrs() {
            const { iconSize, iconColor } = this;

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
