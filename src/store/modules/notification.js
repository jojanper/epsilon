const mutations = {
    ADD_NOTIFICATION(state, obj) {
        state.notifications.push(obj);
    },

    REMOVE_NOTIFICATION(state, obj) {
        state.notifications = state.notifications.filter(item => !(item.id === obj.id));
    }
};

const getters = {
    // Return notifications array
    appNotifications(state) {
        return state.notifications;
    }
};

const actions = {
    addNotification({ commit, dispatch }, obj) {
        commit('ADD_NOTIFICATION', obj);

        // Notification is removed after timeout, if specified
        if (obj.timeout) {
            setTimeout(() => dispatch('removeNotification', obj), obj.timeout);
        }
    },

    removeNotification({ commit }, obj) {
        commit('REMOVE_NOTIFICATION', obj);
    }
};

const state = {
    notifications: []
};

export const name = 'notification';

const helperGetters = [
    'appNotifications'
];

const helperActions = [
    'addNotification',
    'removeNotification'
];

export const storeModule = {};

storeModule[name] = {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
};

export function createHelpers(mapGetters, mapActions) {
    return {
        computed: { ...mapGetters(name, helperGetters) },
        actions: mapActions(name, helperActions)
    };
}
