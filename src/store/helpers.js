import { mapGetters, mapActions } from 'vuex';

const notificationModule = 'notification';

export const notificationComputed = {
    ...mapGetters(notificationModule, [
        'appNotifications'
    ])
};

export const notificationActions = mapActions(notificationModule, [
    'addNotification',
    'removeNotification'
]);
