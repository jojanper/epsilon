import { mapGetters, mapActions } from 'vuex';

import { createHelpers as appHelpers } from './modules/app';
import { createHelpers as notifyHelpers } from './modules/notification';

// Mapped high level application getters and actions
const app = appHelpers(mapGetters, mapActions);
export const appComputed = app.computed;
export const appActions = app.actions;

// Mapped notification getters and actions
const notify = notifyHelpers(mapGetters, mapActions);
export const notificationComputed = notify.computed;
export const notificationActions = notify.actions;
