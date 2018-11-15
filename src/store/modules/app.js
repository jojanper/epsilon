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
    async setLang({ commit }, obj) {
        const i18 = obj.instance;
        const { lang } = obj;
        if (lang in i18.messages) {
            commit('SET_LANG', obj);
        } else {
            // Lazy load required language
            const res = await import(/* webpackChunkName: "lang-[request]" */ `@/locales/${lang}.json`);
            i18.setLocaleMessage(lang, res.default);
            commit('SET_LANG', obj);
            /*
            Network.get(`/static/locales/${lang}.json`).subscribe((response) => {
                console.log(response);
            });
            */
        }
    }
};

export const state = {
};
