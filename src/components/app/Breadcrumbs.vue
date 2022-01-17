<template>
  <div v-if="breadcrumbs.length">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link
          exact-active-class
          active-class
          :to="{ name: homeRouteName }"
        >{{ homeName }}</router-link>
      </li>
      <li
        v-for="(data, i) in breadcrumbs"
        :key="i"
        class="breadcrumb-item"
      >
        <a
          style="cursor: default"
          v-if="i === breadcrumbs.length - 1"
        >{{ getDisplayName(data.meta) }}</a>
        <router-link
          v-else
          exact-active-class
          active-class
          :to="{ name: data.name, params: $route.params }"
        >{{ getDisplayName(data.meta) }}</router-link>
      </li>
    </ol>
  </div>
</template>

<script>
/**
 * Breadcrumb displaying current site path.
 */
export default {
    name: 'DraalBreadcrumbs',
    props: {
        /**
         * Display name of home page.
         */
        homeName: {
            type: String,
            required: true
        },
        /**
         * Router name to home page.
         */
        homeRouteName: {
            type: String,
            required: true
        }
    },
    computed: {
        breadcrumbs() {
            const crumbs = [];
            for (let i = 0; i < this.$route.matched.length; i++) {
                // Breadcrumb navigation excludes home only link as that is
                // visible when there are at least one additional link
                // in the breadcrumbs
                if (this.$route.matched[i].name !== this.homeRouteName) {
                    crumbs.push(this.$route.matched[i]);
                }
            }

            return crumbs;
        }
    },
    methods: {
        getDisplayName(meta) {
            return meta.paramId ? this.$route.params[meta.paramId] : meta.breadcrumb;
        }
    }
};
</script>

<style lang="scss">
</style>
