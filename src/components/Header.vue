<template>
  <div class="pb-2">
    <!-- Desktop header (hide when viewport device is small or even smaller) -->
    <v-toolbar class="hidden-sm-and-down bg-light">
      <router-link class="navbar-brand" :to="{ name: homeRoute }">{{ appName }}</router-link>
      <draal-app-reloader classes="mr-3"></draal-app-reloader>
      <div class="row w-100">
        <div v-for="(route, index) in routes" :key="index" class="nav-item">
          <router-link class="nav-link" :to="{ name: route.name }">{{ route.title}}</router-link>
        </div>
        <draal-language-selection class="ml-auto"></draal-language-selection>
      </div>
    </v-toolbar>

    <!-- "Mobile" header (hide when viewport device is medium or larger) -->
    <v-app-bar class="hidden-md-and-up bg-light">
      <v-menu min-width="128">
        <template v-slot:activator="{ on }">
          <v-app-bar-nav-icon v-on="on"></v-app-bar-nav-icon>
          <draal-app-reloader></draal-app-reloader>
          <router-link class="navbar-brand" :to="{ name: homeRoute }">{{ appName }}</router-link>
        </template>

        <v-list min-height="224">
          <v-list-item v-for="(route, index) in routes" :key="index" class="nav-item">
            <v-list-item-title>
              <router-link class="nav-link text-left" :to="{ name: route.name }">{{ route.title}}</router-link>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <draal-language-selection class="ml-auto"></draal-language-selection>
    </v-app-bar>
  </div>
</template>

<script>
import DraalAppReloader from '@/components/utils/AppReload.vue';
import DraalLanguageSelection from '@/components/Language.vue';

/**
 * Application header with site navigation. Supports different display sizes.
 */
export default {
    name: 'DraalHeader',
    components: {
        DraalAppReloader,
        DraalLanguageSelection
    },
    props: {
        /**
         * Name of application appearing first at the left hand side of the header.
         */
        appName: {
            type: String,
            required: true
        },
        /**
         * Application routes.
         */
        routes: {
            type: Array,
            reqired: true
        },
        /**
         * Route when clicking the application name link.
         */
        homeRoute: {
            type: String,
            required: true
        }
    }
};
</script>

<style lang="scss">
.nav-item {
    position: relative;
    top: 1px;
    padding-left: 0;

    a {
        color: #101010 !important;
    }
}

.navbar-brand {
    color: #0065ed !important;
}
</style>
