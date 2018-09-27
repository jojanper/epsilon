import { NotificationMessage, NotificationMessageTypes } from '../../common/handlers';
import * as notificationModule from './notification';


describe('Notification module', () => {
    let store;

    beforeEach(() => {
        store = createModuleStore(notificationModule);
    });

    it('notification', (done) => {
        const obj = NotificationMessage.createSuccess('Notification message');
        store.dispatch('addNotification', obj).then(() => {
            const data = store.getters.appNotifications;

            expect(data.length).toEqual(1);
            expect(data[0].type).toEqual(NotificationMessageTypes.SUCCESS);
            expect(data[0].data).toEqual('Notification message');
            done();
        });
    });
});
