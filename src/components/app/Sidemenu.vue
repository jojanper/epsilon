<template>
  <div v-if="hasSideMenu">
    <v-navigation-drawer
      floating
      permanent
      :width="menuWidth"
      v-if="!mobile"
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
            <v-list-item-title class="side-menu-title">
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

    <div
      v-else
      class="nav-wrapper"
    >
      <ul>
        <li
          v-for="(item, i) in sideMenu"
          :key="i"
          class="mt-2"
        >
          <router-link
            exact-active-class
            active-class
            :to="{ name: item.name, params: $route.params }"
          >{{ item.title }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/**
 * Sidemenu displaying available child paths of current path.
 */
export default {
    name: 'DraalSideMenu',
    props: {
        mobile: {
            type: Boolean,
            required: false,
            default: false
        },
        menuWidth: {
            type: Number,
            required: false,
            default: 160
        }
    },
    data() {
        return {
            menus: null
        };
    },
    computed: {
        // Check is side menus available
        hasSideMenu() {
            return this.getChildRoutes(true);
        },

        // Return side menu data for rendering
        sideMenu() {
            const menus = [];
            this.getChildRoutes(false).forEach(item => {
                const title = item.meta.breadcrumb;
                menus.push({ title, name: item.name });
            });

            return menus;
        }
    },
    methods: {
        getChildRoutes(status) {
            return !status ? this.menus : this.getInternalChildRoutes();
        },

        getInternalChildRoutes() {
            let buildPath = '';
            let { routes } = this.$router.options;

            // Locate the child route that matches the current route
            this.$route.matched.forEach(item => {
                routes = routes.find(r => `${buildPath}${r.path}` === item.path);
                if (routes) {
                    buildPath = `${buildPath}${routes.path}/`;
                    routes = routes.children;
                }
            });

            this.menus = null;

            // Exclude child routes that are parameter dependent
            if (routes && Array.isArray(routes)) {
                this.menus = routes.filter(item => !item.path.includes(':'));
                return this.menus;
            }

            return null;
        }
    }
};
</script>

<style lang="scss" scoped>
.nav-wrapper {
    overflow: hidden;

    ul {
        text-align:center;
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        padding-bottom: 50px;
        margin-bottom: -50px;

        li {
            list-style:none;
            display:inline-block;
            margin-right: 10px;
        }
    }
}
</style>
