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
        }
    },
    data() {
        return {
            menuWidth: 160,
            menus: null
        };
    },
    /*
    watch: {
        $route() {
            console.log('ROUTE CHANGED');
        }
    },
    */
    computed: {
        hasSideMenu() {
            console.log('HEP');
            const route = this.getChildRoutes2(true);
            console.log(route);
            return route;
            // return this.getChildRoutes();
        },

        sideMenu() {
            console.log('HOP');
            const menus = [];
            this.getChildRoutes2(false).forEach(item => {
                const title = item.meta.breadcrumb;
                menus.push({ title, name: item.name });
            });

            return menus;
        }
    },
    methods: {
        getChildRoutes2(status) {
            return !status ? this.menus : this.getChildRoutes();
        },

        getChildRoutes() {
            /*
            function recursiveChildrenSearch(routes, name) {
  for (let route of routes) {
    if (route.name === name)
      return route.children;
    else if (route.children.length > 0)
      return recursiveChildrenSearch(route.children, name);
  }
}
            */

            let buildPath = '';
            let { routes } = this.$router.options;
            this.$route.matched.forEach(item => {
                // buildPath = index === 0 ? buildPath : `${buildPath}/${item.path}`;

                // console.log(index, item, routes, buildPath);

                routes = routes.find(r => `${buildPath}${r.path}` === item.path);
                // console.log(routes);
                if (routes) {
                    buildPath = `${buildPath}${routes.path}/`;
                    routes = routes.children;
                }

                // console.log(routes, buildPath);
            });
            console.log('RESULTS');
            // console.log(routes);

            this.menus = null;

            if (routes && Array.isArray(routes)) {
                this.menus = routes.filter(item => !item.path.includes(':'));
                return this.menus;
            }

            return null;

            /*
            const current = this.$route;
            console.log(current);
            console.log(current.path, this.$router.options.routes);
            console.log(this.$router);
            const route = this.$router.options.routes.find(r => r.path === current.path);
            console.log(route);
            return route && Array.isArray(route.children) ? route : null;
            */
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
