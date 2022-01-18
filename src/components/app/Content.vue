<template>
  <div :class="[!mobile ? wrapperCls : '']">
    <div :class="[!mobile ? sidemenuCls : '']">
      <draal-side-menu />
    </div>
    <div :class="[!mobile ? contentCls : '']">
      <slot name="default" />
    </div>
  </div>
</template>

<script>
import DraalSideMenu from '@/components/app/Sidemenu.vue';

/**
 * Content view with optional sidemenu.
 */
export default {
    name: 'DraalContentView',
    components: {
        DraalSideMenu
    },
    props: {
        wrapperCls: {
            type: String,
            required: false,
            default: ''
        },
        sidemenuCls: {
            type: String,
            required: false,
            default: ''
        },
        contentCls: {
            type: String,
            required: false,
            default: ''
        }
    },
    computed: {
        mobile() {
            return this.$vuetify.breakpoint.sm;
        }
    }
};
</script>
