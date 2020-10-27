<template>
  <div v-if="breadcrumbs.length">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link exact-active-class active-class :to="{ name: homeRoute }">{{ homeName }}</router-link>
      </li>
      <li v-for="(data, i) in breadcrumbs" :key="i" class="breadcrumb-item">
        <router-link
          exact-active-class
          active-class
          :to="{ name: data.name }"
        >{{ data.meta.breadcrumb }}</router-link>
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
        homeRoute: {
            type: String,
            required: true
        }
    },
    computed: {
        breadcrumbs() {
            const crumbs = [];
            // console.log(this.$route);

            for (let i = 0; i < this.$route.matched.length; i++) {
                if (this.$route.matched[i].name !== this.homeRoute) {
                    crumbs.push(this.$route.matched[i]);
                }
            }

            // console.log(crumbs);

            return crumbs;
        }
    }
};
</script>

<style lang="scss">
</style>
