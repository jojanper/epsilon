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
            <v-list-item-title>
              <router-link
                exact-active-class
                active-class
                :to="{ name: item.name, params: $route.params }"
              >{{ item.title }} 3</router-link>
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
          >{{ item.title }} 2</router-link>
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
            menuWidth: 160
        };
    },
    computed: {
        hasSideMenu() {
            return this.getChildRoutes();
        },

        sideMenu() {
            const menus = [];
            const route = this.getChildRoutes();

            if (route) {
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
            const route = this.$router.options.routes.find(r => r.path === current.path);
            return route && Array.isArray(route.children) ? route : null;
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
