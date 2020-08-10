import Network from '@/common/network';
import AudioApi from '@/common/audio_api';

export const mutations = {
    SET_LANG(state, obj) {
        const i18 = obj.instance;
        i18.locale = obj.lang;
    },

    SET_VERSION(state, obj) {
        state.appVersion.localRef = obj.localRef;
        state.appVersion.reload = obj.reload;
    },
};

export const getters = {
    newAppVersionAvailable(state) {
        return state.appVersion.reload;
    },

    appVersion(state) {
        return state.appVersion.localRef;
    }
};

export const actions = {
    // Check if new application version is available
    checkVersion({ commit, state }) {
        AudioApi.getAppMeta().subscribe(data => {
            let reload = false;
            const localRef = data.version;

            // New version available at the server, request reload from user
            if (state.appVersion.localRef !== null && localRef !== state.appVersion.localRef) {
                reload = true;
            }

            commit('SET_VERSION', { localRef, reload });
        }, () => { });
    },

    // Reload new application version from server
    reloadApp({ commit, state }) {
        commit('SET_VERSION', {
            localRef: state.appVersion.localRef,
            reload: false
        });

        window.location.reload(true);
    },

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
            Network.get(`${prefix}locales/${lang}.json`, config).subscribe(response => {
                i18.setLocaleMessage(lang, response);
                commit('SET_LANG', obj);
            });
        }
    }
};

export const state = {
    appVersion: {
        localRef: null,
        reload: false
    }
};
