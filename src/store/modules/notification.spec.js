import * as notificationModule from './notification';


describe('Notification module', () => {
    let store;

    beforeEach(() => {
        store = createModuleStore(notificationModule);
    });

    it('notification', (done) => {
        store.dispatch('addNotification', {
            type: 'success',
            title: 'Notification message'
        }).then(() => {
            const data = store.getters.appNotifications;

            expect(data.length).toEqual(1);
            expect(data[0].type).toEqual('success');
            expect(data[0].title).toEqual('Notification message');
            done();
        });
    });
});
