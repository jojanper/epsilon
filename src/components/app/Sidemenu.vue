<template>
  <div>
    <v-navigation-drawer
      floating
      permanent
      :width="menuWidth"
      v-if="hasSideMenu"
      class="hidden-sm-and-down"
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
    <div class="hidden-md-and-up nav-wrapper">
      <ul>
        <li
          v-for="(item, i) in items"
          :key="i"
          class="mt-2"
        >{{item}}</li>
      </ul>
      <!--ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#news">News</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#home">Home</a></li>
        <li><a href="#news">News</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#home">Home</a></li>
        <li><a href="#news">News</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#about">About</a></li>
      </ul-->
    </div>
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
            menuWidth: 160,
            items: [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H'
            ]
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

.nav-wrapper{
    overflow: hidden;

/*
    ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

li {
  float: left;
}

li a {
  display: block;
  text-align: center;
  padding: 16px;
  text-decoration: none;
}
*/

    ul{
        text-align:center;
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        // padding-bottom: 0px;
        margin-bottom: 0px;

    li {
        list-style:none;
        display:inline-block;
        margin-right: 10px;
    }
}

}
</style>
