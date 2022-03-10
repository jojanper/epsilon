import { shallowMount } from '@vue/test-utils';

import DraalDialog from '../Dialog.vue';

describe('DraalDialog', () => {
    const text = 'dialog text';
    const title = 'dialog title';
    const model = true;

    setupVuetifyForTests(beforeAll, afterAll);

    it('close event is emitted', () => {
        // GIVEN dialog

        // WHEN dialog is created
        const wrapper = shallowMount(DraalDialog, {
            components: {
                DraalDialog
            },
            propsData: { text, title, model }
        });

        // THEN header and body should be available
        expect(wrapper.text()).toMatch(text);
        expect(wrapper.findAll('.headline').at(0).text()).toMatch(title);

        // WHEN close button is clicked
        const closeButton = wrapper.find('.dialog-close');
        closeButton.trigger('click');

        // THEN close event is emitted
        expect(wrapper.emitted()['close-dialog']).toBeTruthy();
    });

    it('scoped slots are supported', () => {
        // GIVEN dialog

        // WHEN scoped slots are used
        const wrapper = shallowMount(DraalDialog, {
            components: {
                DraalDialog
            },
            propsData: { text, title, model },
            scopedSlots: {
                header: '<div class="headline">foo</div>',
                body: '<div class="body">bar</div>'
            }
        });

        // THEN expected content is available
        expect(wrapper.find('.headline').text()).toMatch('foo');
        expect(wrapper.find('.body').text()).toMatch('bar');

        // -----

        // WHEN dialog is closed
        const btns = wrapper.findAll('.dialog-close');
        btns.at(0).trigger('click');

        // THEN correct event is emitted
        expect(wrapper.emitted()['close-dialog']).toBeTruthy();
    });

    it('custom buttons are supported', () => {
        // GIVEN dialog has cancel and ok buttons
        const wrapper = shallowMount(DraalDialog, {
            components: {
                DraalDialog
            },
            propsData: {
                text, title, model, cancelText: 'Cancel', okText: 'Ok'
            }
        });

        const btns = wrapper.findAll('.dialog-close');

        // WHEN clicking ok button
        btns.at(0).trigger('click');

        // THEN correct event is emitted
        expect(wrapper.emitted()['ok-dialog']).toBeTruthy();

        // -----

        // WHEN clicking cancel button
        btns.at(1).trigger('click');

        // THEN correct event is emitted
        expect(wrapper.emitted()['cancel-dialog']).toBeTruthy();
    });
});
