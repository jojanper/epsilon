<template>
  <div>
    <!-- Mobile side menu appears here on top of the main content -->
    <draal-side-menu
      v-if="mobile"
      :mobile="true"
    />

    <div class="row row-offcanvas row-offcanvas-right">
      <!-- Desktop side menu appears in the left side of the main content -->
      <div
        v-if="!mobile"
        class="col-xs sidebar-offcanvas"
      >
        <draal-side-menu />
      </div>
      <div class="col-md">
        <!-- Main content is rendered here -->
        <slot name="default" />
      </div>
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
    computed: {
        mobile() {
            return this.$vuetify.breakpoint.mobile;
        }
    }
};
</script>
