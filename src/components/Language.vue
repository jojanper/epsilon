<template>
    <div>
        <v-menu class="float-right mt-1" offset-y>
            <v-tooltip slot="activator" left debounce=200 open-delay=500 close-delay=250>
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
    name: 'DraalLanguageSelection',
    methods: {
        ...appActions
    }
};
</script>
