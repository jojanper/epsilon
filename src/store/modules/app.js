export const mutations = {
    SET_LANG(state, obj) {
        const i18 = obj.instance;
        i18.locale = obj.lang;
    }
};

export const getters = {
};

export const actions = {
    setLang({ commit }, obj) {
        commit('SET_LANG', obj);
    }
};

export const state = {
};
