import { storeModule, name } from '../notification';
import { NotificationMessage, NotificationMessageTypes } from '@/common/models';

const ADD_NOTIFICATION = `${name}/addNotification`;
const GET_NOTIFICATIONS = `${name}/appNotifications`;
const REMOVE_NOTIFICATIONS = `${name}/removeNotification`;

describe('Notification module', () => {
    let store;

    beforeEach(() => {
        prepareVuex();
        store = createTestStore(storeModule);
    });

    function getNotifications() {
        return store.getters[GET_NOTIFICATIONS];
    }

    async function verifyNotification(mode, msg, options) {
        const obj = NotificationMessage[`create${mode}`](msg, options);
        await store.dispatch(ADD_NOTIFICATION, obj);

        const data = getNotifications();

        expect(data.length).toEqual(1);
        expect(data[0].type).toEqual(NotificationMessageTypes[mode.toUpperCase()]);
        expect(data[0].data).toEqual(msg);
        expect(data[0].id.length).toEqual(32);

        return obj;
    }

    it('success notification', async () => {
        await verifyNotification('Success', 'Success message');
    });

    it('info notification', async () => {
        await verifyNotification('Info', 'Info message');
    });

    it('warning notification', async () => {
        await verifyNotification('Warning', 'Warning message');
    });

    it('error notification', async () => {
        await verifyNotification('Error', 'Errr message');
    });

    it('notification is removed', async () => {
        const obj = await verifyNotification('Error', 'Errr message');

        await store.dispatch(REMOVE_NOTIFICATIONS, {});
        expect(getNotifications().length).toEqual(1);

        await store.dispatch(REMOVE_NOTIFICATIONS, obj);
        expect(getNotifications().length).toEqual(0);
    });

    it('notification is removed with timeout', async () => {
        const options = { timeout: 1000 };
        await verifyNotification('Error', 'Errr message', options);

        expect(getNotifications().length).toEqual(1);

        return new Promise(resolve => {
            setTimeout(() => {
                expect(getNotifications().length).toEqual(0);
                resolve();
            }, options.timeout);
        });
    });
});
