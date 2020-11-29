<template>
  <div>
    <div v-if="state" :class="type">
      <div class="spinner-loader" :style="attrs"></div>
      <!-- @slot Enhance spinner content -->
      <slot name="spinner"></slot>
    </div>
    <slot v-if="!state"></slot>
  </div>
</template>

<script>
/**
 * Spinner component.
 *
 * @displayName DraalSpinner
 */
export default {
    name: 'DraalSpinner',
    props: {
        /**
         * Spinner type. Available types:
         * - spinner-1
         * - spinner-2
         * - spinner-3
         */
        type: {
            type: String,
            default: 'spinner-1'
        },
        /**
         * Spinner state. Value true activates spinner, false disables.
         */
        state: {
            type: Boolean,
            required: false,
            default: true
        },
        /**
         * Spinner width.
         */
        width: {
            type: String,
            required: false,
            default: null
        },
        /**
         * Spinner height.
         */
        height: {
            type: String,
            required: false,
            default: null
        }
    },
    data() {
        const attrs = {};

        if (this.width) {
            attrs.width = this.width;
        }

        if (this.height) {
            attrs.height = this.height;
        }

        return {
            attrs
        };
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$rcolor: 66;
$gcolor: 185;
$bcolor: 131;
$animation: rotation 0.6s infinite linear;

@mixin spinner-border($width: 6px, $alpha: 0.15) {
    border-left: $width solid rgba($rcolor, $gcolor, $bcolor, $alpha);
    border-right: $width solid rgba($rcolor, $gcolor, $bcolor, $alpha);
    border-bottom: $width solid rgba($rcolor, $gcolor, $bcolor, $alpha);
    border-top: $width solid rgba($rcolor, $gcolor, $bcolor, 0.8);
}

@-webkit-keyframes rotation {
    from {
        -webkit-transform: rotate(0deg);
    }
    to {
        -webkit-transform: rotate(359deg);
    }
}

@keyframes rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(359deg);
    }
}

@mixin spinner($width, $alpha, $scale: 1) {
    transform: scale($scale);
    .spinner-loader {
        @include spinner-border($width, $alpha);
        height: 60px;
        width: 60px;
        margin: 0px auto;
        position: relative;
        -webkit-animation: $animation;
        animation: $animation;
        border-radius: 100%;
    }
}

.spinner-1 {
    @include spinner(6px, 0.15);
}

.spinner-2 {
    @include spinner(6px, 0, 0.75);
}

.spinner-3 {
    @include spinner(4px, 0, 0.75);
}
</style>
