<template>
  <div>
    <v-menu offset-y absolute>
      <template v-slot:activator="{ on: menu }">
        <v-tooltip left debounce="200" open-delay="500" close-delay="250">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              class="mt-2"
              color="primary"
              depressed
              text
              small
              v-on="{...tooltip, ...menu}"
            >{{ $i18n.locale }}</v-btn>
          </template>
          <span>{{ $t('header.selectLanguage') }}</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item
          class="mr-2 ml-2"
          v-for="(item, index) in $t('header.languageSelections')"
          :key="index"
          @click="setLang({lang: item.lang, instance: $i18n})"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
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
