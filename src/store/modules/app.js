export const mutations = {
    SET_LANG(state, obj) {
        const i18 = obj.instance;
        i18.locale = obj.lang;
    },

    SET_AVAILABLE_LANG(state, obj) {
        state.languages = [];
        obj.forEach(element => state.languages.push(element));
    }
};

export const getters = {
    appLanguages(state) {
        return state.languages;
    }
};

export const actions = {
    setLang({ commit }, obj) {
        commit('SET_LANG', obj);
    },

    setLanguages({ commit }, obj) {
        commit('SET_AVAILABLE_LANG', obj);
    }
};

export const state = {
    languages: []
};
