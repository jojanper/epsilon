import { mapGetters, mapActions } from 'vuex';

const appModule = 'app';
const notificationModule = 'notification';

// Mapped high level application getters
export const appComputed = {
    ...mapGetters(appModule, [
        'newAppVersionAvailable',
        'appVersion',
        'appLang',
        'getTimelineLength'
    ])
};

// Mapped high level application actions
export const appActions = mapActions(appModule, [
    'checkVersion',
    'reloadApp',
    'setLang',
    'saveTimelineLength'
]);


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
