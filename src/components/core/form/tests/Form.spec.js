import DraalFormGenerator from '../Form.vue';
import { storeModule } from '@/store/modules/app';
import { initialize } from '@/components/core/form/vee-validate';
import i18n from '@/i18n';

const TEXT_SCHEMA_BASE = {
    type: 'text',
    placeholder: 'Enter text',
    label: 'Text',
    name: 'text',
    rules: 'required',
    debounce: 0
};

// Text input schema that have default value for input
const TEXT_SCHEMA = [{
    ...TEXT_SCHEMA_BASE,
    defaultValue: 'I am default value'
}];

// Text input schema with immediate input validation
const TEXT_SCHEMA2 = [{
    ...TEXT_SCHEMA_BASE,
    immediate: true
}];

const OPTIONS = {
    submit: 'Submit',
    clear: 'Clear'
};

const TEXT_VALUE = 'My text';

const FORM_PROPS = {
    options: OPTIONS,
    debouncedDisabled: 0,
    value: {
        text: null
    }
};

describe('DraalFormGenerator:text-input', () => {
    setupVuetifyForTests(beforeAll, afterAll, () => {
        prepareVuex();
        initialize(i18n);
        jest.useFakeTimers('modern');
    });

    function factory(propsData = {}, params = {}) {
        const store = createTestStore(storeModule);

        return mountedComponentFactory(DraalFormGenerator, {
            ...propsData
        }, { ...params, store });
    }

    function getTextInput(wrapper) {
        return wrapper.find('input[type="text"]');
    }

    it('text input is immediately validated', async () => {
        const props = {
            ...FORM_PROPS,
            schema: TEXT_SCHEMA2
        };

        const wrapper = factory(props);
        await flushTestAll();

        // Error is reported after initial rendering
        const errorEl = wrapper.find('.v-messages');
        expect(errorEl.text()).toContain('Required');
    });

    it('text input is supported', async () => {
        const props = {
            ...FORM_PROPS,
            schema: TEXT_SCHEMA
        };

        const wrapper = factory(props);

        // Text input
        let textInput = getTextInput(wrapper);

        // Default value is set
        expect(textInput.element.value).toEqual(TEXT_SCHEMA[0].defaultValue);

        // -----

        // Set invalid text value
        await textInput.setValue(' ');
        await flushTestAll();

        // Error is reported
        let errorEl = wrapper.find('.v-messages');
        expect(errorEl.text()).toContain('Required');

        // -----

        // Form is reset
        await wrapper.findAll('button').at(1).trigger('click');

        // Value is set to default
        textInput = getTextInput(wrapper);
        expect(textInput.element.value).toEqual(TEXT_SCHEMA[0].defaultValue);

        // -----

        // Valid text value is set
        await textInput.setValue(TEXT_VALUE);
        await flushTestAll();

        // No errors are reported
        errorEl = wrapper.find('.v-messages');
        expect(errorEl.text()).toContain('');

        // Input value is correct
        textInput = getTextInput(wrapper);
        expect(textInput.element.value).toEqual(TEXT_VALUE);

        // ------

        // Form is submitted
        await flushTestAll();
        await wrapper.findAll('button').at(0).trigger('click');

        // Data is valid
        const submitData = wrapper.emitted().submit[0][0];

        // Data is as expected
        expect(submitData.text).toEqual(TEXT_VALUE);
    });
});
