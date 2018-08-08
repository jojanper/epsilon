<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link class="navbar-brand" :to="{ name: 'home' }">Epsilon</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse"
        data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
          <li v-for="(route, index) in routes" :key="index" class="nav-item">
            <router-link class="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show"
              active-class="active" exact :to="{ name: route.name }">
              {{ route.title}}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            routes: [
                {
                    name: 'home',
                    title: 'Home'
                },
                {
                    name: 'about',
                    title: 'About'
                }
            ]
        };
    }
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
.nav-link {
    &.router-link-exact-active {
      font-weight: bold;
    }
}
.navbar-brand {
    color: #5cb85c!important;
}
</style>
