import { mapGetters, mapActions } from 'vuex';

const notificationModule = 'notification';

// Mapped notification getters
export const notificationComputed = {
    ...mapGetters(notificationModule, [
        'appNotifications'
    ])
};

// Mapped notification actions
export const notificationActions = mapActions(notificationModule, [
    'addNotification',
    'removeNotification'
]);
