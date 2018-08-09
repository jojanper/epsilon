<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <router-link class="navbar-brand" :to="{ name: 'home' }">{{ appName }}</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse"
            data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
            <li v-for="(route, index) in routes" :key="index" class="nav-item">
                <router-link class="nav-link" data-toggle="collapse"
                    data-target=".navbar-collapse.show"
                    active-class="active" exact :to="{ name: route.name }">
                    {{ route.title}}
                </router-link>
            </li>
        </ul>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'DraalHeader',
    props: {
        appName: {
            type: String,
            required: true
        },
        routes: {
            type: Array,
            reqired: true
        }
    }
};
</script>

<style lang="scss">
.nav-link {
    &.router-link-exact-active {
      font-weight: bold;
    }
}
.navbar-brand {
    color: #5cb85c!important;
}
</style>
