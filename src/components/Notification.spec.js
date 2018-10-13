import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import { getters } from '@/store/modules/notification';
import { NotificationMessage } from '@/common/handlers';
import DraalNotification from './Notification.vue';


const localVue = createLocalVue();
localVue.use(Vuex);

const MESSAGE = 'Message';

describe('DraalNotification', () => {
    it('renders correctly', () => {
        let elements;

        const state = {
            notifications: []
        };

        const actions = {
            addNotification() {
                const msg = NotificationMessage.createSuccess(MESSAGE);
                state.notifications.push(msg);
            },

            removeNotification() {
                state.notifications = [];
            }
        };

        const store = new Vuex.Store({
            modules: {
                notification: {
                    namespaced: true,
                    state,
                    actions,
                    getters
                }
            }
        });

        const wrapper = shallowMount(DraalNotification, {
            store, localVue
        });

        // Initially no messages available
        elements = wrapper.findAll('.alert-success');
        expect(elements.length).toEqual(0);

        // New message is added to store
        actions.addNotification();

        // Message should be visible and match the expected content
        elements = wrapper.findAll('.alert-success');
        expect(elements.length).toEqual(1);
        expect(elements.at(0).text()).toMatch(MESSAGE);

        // User removes message by clicking the message
        const element = wrapper.find('.alert-success');
        element.trigger('click');
        expect(state.notifications.length).toEqual(0);
    });
});
