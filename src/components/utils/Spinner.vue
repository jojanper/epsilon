<template>
  <div>
    <div v-if="state" :class="type">
      <div class="spinner-loader"></div>
      <slot name="spinner"></slot>
    </div>
    <slot v-if="!state"></slot>
  </div>
</template>

<script>
export default {
    name: 'DraalSpinner',
    props: {
        type: {
            type: String,
            default: 'spinner-1'
        },
        state: {
            type: Boolean,
            required: false,
            default: true
        }
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
</style>
