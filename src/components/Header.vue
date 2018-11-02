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
        <v-menu class="float-right mt-1" offset-y>
            <v-tooltip slot="activator" left debounce=200 open-delay=750 close-delay=250>
                <v-btn slot="activator" depressed flat small>{{ $i18n.locale }}</v-btn>
                <span>{{ $t('header.selectLanguage') }}</span>
            </v-tooltip>
            <v-list>
                <v-list-tile v-for="(item, index) in $t('header.languageSelections')"
                    :key="index" @click="setLang({lang: item.lang, instance: $i18n})">
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
import { appActions } from '@/store/helpers';

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
</style>
