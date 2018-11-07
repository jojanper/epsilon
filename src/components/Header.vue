<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light w-75 float-left">
            <div class="mr-auto">
                <router-link class="navbar-brand" :to="{ name: 'home' }">{{ appName }}</router-link>
                <button class="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarCollapse" aria-controls="navbarCollapse"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto">
                    <li v-for="(route, index) in routes" :key="index" class="nav-item">
                        <router-link class="float-left nav-link" data-toggle="collapse"
                            data-target=".navbar-collapse.show"
                            active-class="active" exact :to="{ name: route.name }">
                            {{ route.title}}
                        </router-link>
                    </li>
                </ul>
            </div>
        </nav>
        <draal-language-selection class="position-absolute right-0"></draal-language-selection>
    </div>
</template>

<script>
import { appActions } from '@/store/helpers';
import DraalLanguageSelection from './Language.vue';

export default {
    name: 'DraalHeader',
    components: {
        DraalLanguageSelection
    },
    props: {
        appName: {
            type: String,
            required: true
        },
        routes: {
            type: Array,
            reqired: true
        }
    },

    methods: {
        ...appActions
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

.right-0 {
    right: 0px;
}
</style>
