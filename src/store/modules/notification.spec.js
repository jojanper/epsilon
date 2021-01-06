import * as notificationModule from './notification';
import { NotificationMessage, NotificationMessageTypes } from '../../common/models';


describe('Notification module', () => {
    let store;

    beforeEach(() => {
        store = createModuleStore(notificationModule);
    });

    async function verifyNotification(mode, msg, options) {
        const obj = NotificationMessage[`create${mode}`](msg, options);
        await store.dispatch('addNotification', obj);

        const data = store.getters.appNotifications;

        expect(data.length).toEqual(1);
        expect(data[0].type).toEqual(NotificationMessageTypes[mode.toUpperCase()]);
        expect(data[0].data).toEqual(msg);
        expect(data[0].id.length).toEqual(32);

        return obj;
    }

    it('success notification', async done => {
        await verifyNotification('Success', 'Success message');
        done();
    });

    it('info notification', async done => {
        await verifyNotification('Info', 'Info message');
        done();
    });

    it('warning notification', async done => {
        await verifyNotification('Warning', 'Warning message');
        done();
    });

    it('error notification', async done => {
        await verifyNotification('Error', 'Errr message');
        done();
    });

    it('notification is removed', async done => {
        const obj = await verifyNotification('Error', 'Errr message');

        await store.dispatch('removeNotification', {});
        expect(store.getters.appNotifications.length).toEqual(1);

        await store.dispatch('removeNotification', obj);
        expect(store.getters.appNotifications.length).toEqual(0);

        done();
    });

    it('notification is removed with timeout', async done => {
        const options = { timeout: 1000 };
        await verifyNotification('Error', 'Errr message', options);

        expect(store.getters.appNotifications.length).toEqual(1);

        setTimeout(() => {
            expect(store.getters.appNotifications.length).toEqual(0);
            done();
        }, options.timeout);
    });
});
