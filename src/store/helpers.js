import { mapGetters, mapActions } from 'vuex';

export const notificationComputed = {
    ...mapGetters('notification', ['appNotifications'])
};

export const notificationActions = mapActions('notification', ['addNotification']);
