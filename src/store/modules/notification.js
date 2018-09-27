export const mutations = {
    ADD_NOTIFICATION(state, obj) {
        state.notifications.push(obj);
        // console.log(state.notifications.length);
    },

    REMOVE_NOTIFICATION(/* state, obj */) {
        // state.notifications.push(obj);
        // console.log(state.notifications.length);
        // console.log('REMOVE', obj);
    }
};

export const getters = {
    appNotifications(state) {
        return state.notifications;
    }
};

export const actions = {
    addNotification({ commit }, obj) {
        commit('ADD_NOTIFICATION', obj);
    },

    removeNotification({ commit }, obj) {
        commit('REMOVE_NOTIFICATION', obj);
    }
};

export const state = {
    notifications: []
};
