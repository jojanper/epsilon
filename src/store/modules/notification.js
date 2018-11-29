export const mutations = {
    ADD_NOTIFICATION(state, obj) {
        state.notifications.push(obj);
    },

    REMOVE_NOTIFICATION(state, obj) {
        state.notifications = state.notifications.filter(item => !(item.id === obj.id));
    }
};

export const getters = {
    // Return notifications array
    appNotifications(state) {
        return state.notifications;
    }
};

export const actions = {
    addNotification({ commit }, obj) {
        commit('ADD_NOTIFICATION', obj);

        // Notification is removed after timeout, if specified
        if (obj.timeout) {
            setTimeout(() => commit('REMOVE_NOTIFICATION', obj), obj.timeout);
        }
    },

    removeNotification({ commit }, obj) {
        commit('REMOVE_NOTIFICATION', obj);
    }
};

export const state = {
    notifications: []
};
