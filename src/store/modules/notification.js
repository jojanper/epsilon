export const mutations = {
    ADD_NOTIFICATION(state, msg) {
        state.notifications.push(msg);
    }
};

export const getters = {
    appNotifications(state) {
        return state.notifications;
    }
};

export const actions = {
    addNotification({ commit }, msg) {
        commit('ADD_NOTIFICATION', msg);
    }
};

export const state = {
    notifications: []
};
