<template>
  <div>
    <v-navigation-drawer
      floating
      permanent
      :width="menuWidth"
      class="hidden-sm-and-down"
      v-if="hasSideMenu"
    >
      <v-list
        dense
        rounded
      >
        <v-list-item
          v-for="item in sideMenu"
          :key="item.title"
          link
        >
          <v-list-item-content>
            <v-list-item-title>
              <router-link
                exact-active-class
                active-class
                :to="{ name: item.name, params: $route.params }"
              >{{ item.title }}</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- https://codepen.io/seriawei/pen/rjqMQN -->
    <div class="hidden-md-and-up">MOBILE HERE</div>
  </div>
</template>

<script>
/**
 * Sidemenu displaying available child paths of current path.
 */
export default {
    name: 'DraalSideMenu',
    data() {
        return {
            menuWidth: 160
        };
    },
    computed: {
        hasSideMenu() {
            const route = this.getChildRoutes();
            return route && Array.isArray(route.children);
        },

        sideMenu() {
            const route = this.getChildRoutes();

            const menus = [];
            if (route && Array.isArray(route.children)) {
                route.children.forEach(item => {
                    const title = item.meta.breadcrumb;
                    menus.push({ title, name: item.name });
                });
            }

            return menus;
        }
    },
    methods: {
        getChildRoutes() {
            const current = this.$route;
            return this.$router.options.routes.find(r => r.path === current.path);
        }
    }
};
</script>

<style lang="scss">
</style>
