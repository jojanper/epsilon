import { NotificationMessage, NotificationMessageTypes } from '../../common/handlers';
import * as notificationModule from './notification';


describe('Notification module', () => {
    let store;

    beforeEach(() => {
        store = createModuleStore(notificationModule);
    });

    async function verifyNotification(mode, msg) {
        const obj = NotificationMessage[`create${mode}`](msg);
        await store.dispatch('addNotification', obj);

        const data = store.getters.appNotifications;

        expect(data.length).toEqual(1);
        expect(data[0].type).toEqual(NotificationMessageTypes[mode.toUpperCase()]);
        expect(data[0].data).toEqual(msg);
        expect(data[0].id.length).toEqual(32);

        return obj;
    }

    it('success notification', async (done) => {
        await verifyNotification('Success', 'Success message');
        done();
    });

    it('info notification', async (done) => {
        await verifyNotification('Info', 'Info message');
        done();
    });

    it('warning notification', async (done) => {
        await verifyNotification('Warning', 'Warning message');
        done();
    });

    it('error notification', async (done) => {
        await verifyNotification('Error', 'Errr message');
        done();
    });

    it('notification is removed', async (done) => {
        const obj = await verifyNotification('Error', 'Errr message');

        await store.dispatch('removeNotification', {});
        expect(store.getters.appNotifications.length).toEqual(1);

        await store.dispatch('removeNotification', obj);
        expect(store.getters.appNotifications.length).toEqual(0);

        done();
    });
});
