import { mount } from '@vue/test-utils';

import DraalTerminal from './Terminal.vue';

describe('DraalTerminal', () => {
    beforeAll(() => {
        prepareVuetify();
    });

    function factory(propsData = {}) {
        return mount(DraalTerminal, {
            vuetify: getVuetify(),
            propsData: {
                dataInput: ['Test data'],
                ...propsData
            }
        });
    }

    it('title is present', () => {
        const title = 'Title';
        const wrapper = factory({ title });
        const el = wrapper.find('.terminal-title-text');
        expect(el.text()).toEqual('Title');
    });

    it('terminal is closed', async () => {
        // GIVEN terminal component
        const wrapper = factory();

        // WHEN closing terminal
        wrapper.find('.terminal-close').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN event is emitted
        expect(wrapper.emitted().input[0][0]).toBeFalsy();
    });
});
