import Vue from 'vue';
import VueI18n from 'vue-i18n';

import en from './locales/en.json';

Vue.use(VueI18n);

// List of locales that are included to the main build,
// missing locales are lazy loaded upon request.
const preloadedLocales = [{
    key: 'en',
    messages: en
}];

function loadLocaleMessages() {
    const messages = {};
    preloadedLocales.forEach(item => {
        messages[item.key] = item.messages;
    });

    return messages;
}

export default new VueI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || 'en',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
    messages: loadLocaleMessages()
});
