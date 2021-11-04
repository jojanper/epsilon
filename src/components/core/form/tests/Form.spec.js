import DraalFormGenerator from '../Form.vue';
import { storeModule } from '@/store/modules/app';
import { initialize } from '@/components/core/form/vee-validate';
import i18n from '@/i18n';

const TEXT_SCHEMA = [{
    type: 'text',
    placeholder: 'Enter text',
    label: 'Text',
    name: 'text',
    rules: 'required',
    debouce: 0
}];

const OPTIONS = {
    submit: 'Submit',
    clear: 'Clear',
    debouncedDisabled: 0
};

const TEXT_VALUE = 'My text';

describe('DraalFormGenerator', () => {
    beforeAll(() => {
        prepareVuex();
        prepareVuetify();
        createDataApp();
        initialize(i18n);

        jest.useFakeTimers();
    });

    function factory(propsData = {}, params = {}) {
        const store = createTestStore(storeModule);

        return mountedComponentFactory(DraalFormGenerator, {
            ...propsData
        }, { ...params, store });
    }

    it('text input is supported', async () => {
        const props = {
            schema: TEXT_SCHEMA,
            options: OPTIONS,
            value: {
                text: null
            }
        };

        const wrapper = factory(props);

        // Set text input
        const textInput = wrapper.find('input[type="text"]');

        // Set invalid text value
        // jest.runAllTimers();
        await textInput.setValue(' ');
        await flushTestAll();

        // Error is reported
        let errorEl = wrapper.find('.v-messages');
        expect(errorEl.text()).toContain('Required');

        // -----

        // Valid text value is set
        // jest.runAllTimers();
        await textInput.setValue(TEXT_VALUE);
        await flushTestAll();

        // No errors are reported
        errorEl = wrapper.find('.v-messages');
        expect(errorEl.text()).toContain('');

        // -----

        // Form is submitted
        const buttons = wrapper.findAll('button');
        await buttons.at(0).trigger('click');
        await flushTest();

        // Data is valid
        const submitData = wrapper.emitted()['form-data'][0];
        expect(submitData[1]).toBeTruthy();

        // Data is as expected
        expect(submitData[0].text).toEqual(TEXT_VALUE);
    });
});
