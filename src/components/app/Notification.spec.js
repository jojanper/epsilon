import DraalNotification from './Notification.vue';
import { storeModule, name } from '@/store/modules/notification';
import { NotificationMessage } from '@/common/models';

const MESSAGE = 'Message';
const ADD_NOTIFICATION = `${name}/addNotification`;
const GET_NOTIFICATIONS = `${name}/appNotifications`;

describe('DraalNotification', () => {
    prepareVuex();

    const store = createTestStore(storeModule);

    it('renders correctly', async () => {
        const wrapper = shallowMountedComponentFactory(DraalNotification, {}, { store });

        // Initially no messages available
        let elements = wrapper.findAll('.alert-success');
        expect(elements.length).toEqual(0);

        // New message is added to store
        store.dispatch(ADD_NOTIFICATION, NotificationMessage.createSuccess(MESSAGE));
        await wrapper.vm.$nextTick();

        // Message should be visible and match the expected content
        elements = wrapper.findAll('.alert-success');
        expect(elements.length).toEqual(1);
        expect(elements.at(0).text()).toMatch(MESSAGE);

        // User removes message by clicking the message
        const element = wrapper.find('.alert-success');
        element.trigger('click');
        expect(store.getters[GET_NOTIFICATIONS].length).toEqual(0);

        wrapper.destroy();
    });
});
