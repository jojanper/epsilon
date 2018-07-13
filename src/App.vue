<template>
  <div id="app">
    <header class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link class="navbar-brand" :to="{ name: 'home' }">Epsilon</router-link>
      <ul class="nav navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" exact :to="{ name: 'home' }">
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" exact :to="{ name: 'about' }">
            About
          </router-link>
        </li>
      </ul>
    </header>
    <router-view/>
  </div>
</template>

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
