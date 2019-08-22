import Network from '@/common/network';

export const mutations = {
    SET_LANG(state, obj) {
        const i18 = obj.instance;
        i18.locale = obj.lang;
    }
};

export const getters = {
};

export const actions = {
    // Change locale settings
    async setLang({ commit }, obj) {
        const i18 = obj.instance;
        const { lang } = obj;

        // Language is available
        if (lang in i18.messages) {
            commit('SET_LANG', obj);
        } else {
            // Do not cache the locale
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            };

            // Lazy load the required language
            const prefix = process.env.PUBLIC_PATH || '';
            Network.get(`${prefix}locales/${lang}.json`, config).subscribe((response) => {
                i18.setLocaleMessage(lang, response);
                commit('SET_LANG', obj);
            });
        }
    }
};

export const state = {
};
