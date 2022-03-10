import DraalMultiStageSelect from '../MultiStageSelect.vue';

import { clone } from '@/common/utils';

const PROPS = {
    configData: [
        {
            placeholder: 'Placeholder 1',
            label: 'Label 1',
            debounce: 0
        },
        {
            placeholder: 'Placeholder 2',
            label: 'Label 2',
            debounce: 0
        }
    ],
    selectedData: [],
    listData: [['Data 1', 'Data 2'], ['Data 3', 'Data 4']]
};

describe('DraalMultiStageSelect', () => {
    setupVuetifyForTests(beforeAll, afterAll, () => jest.useFakeTimers('modern'));

    function factory(propsData = {}, params = {}) {
        return mountedComponentFactory(DraalMultiStageSelect, {
            ...propsData
        }, { ...params });
    }

    function getListsHandle(wrapper) {
        return wrapper.findAll('input[type="text"]');
    }

    function clickSelectListItem(wrapper, index) {
        const element = '.menuable__content__active .v-list-item';
        return wrapper.findAll(element).at(index).trigger('click');
    }

    function validateListsStatus(wrapper, statuses) {
        const inputs = wrapper.findAll('.v-input__slot');
        statuses.forEach((status, index) => {
            expect(inputs.at(index).attributes('aria-expanded')).toEqual(status);
        });
    }

    async function openListAndSelect(wrapper, listIndex, itemIndex, fn) {
        // Open select list
        getListsHandle(wrapper).at(listIndex).trigger('click');
        await wrapper.vm.$nextTick();

        if (fn) {
            fn();
        }

        // Select item from dropdown list
        clickSelectListItem(wrapper, itemIndex);
        await flushTestAll();
    }

    function getWrapper(props) {
        const attachTo = createDataApp('test-tooltipmenu', true);
        return factory(props, { attachTo });
    }

    it('values are selected from lists', async () => {
        const props = clone(PROPS);
        const wrapper = getWrapper(props);

        // Open first select and select second item from dropdown
        await openListAndSelect(wrapper, 0, 1, () => {
            // First list is open and second is closed now
            validateListsStatus(wrapper, ['true', 'false']);
        });

        // Open second select and select second item from dropdown
        await openListAndSelect(wrapper, 1, 1, () => {
            // First list is closed and second is open now
            validateListsStatus(wrapper, ['false', 'true']);
        });

        // Make sure correct data is emitted
        const { selected } = wrapper.emitted();

        expect(selected.length).toEqual(2);

        // Second item selected from first list
        expect(selected[0][0]).toEqual(0);
        expect(selected[0][1]).toEqual(props.listData[0][1]);

        // Second item selected from second list
        expect(selected[1][0]).toEqual(1);
        expect(selected[1][1]).toEqual(props.listData[1][1]);
    });

    it('initial list values are available', async () => {
        // Initial selected data is available
        const props = clone(PROPS);
        const val = props.listData[0][1];
        props.selectedData[0] = val;
        const wrapper = getWrapper(props);

        // Open first select and select second item from dropdown
        await openListAndSelect(wrapper, 0, 1);

        // No event is emitted (as selected data is same as the initial selected data)
        expect(wrapper.emitted().selected).toBeUndefined();
    });

    it('empty selection list is not shown', async () => {
        const props = clone(PROPS);
        props.listData = [props.listData[0], []];
        const wrapper = getWrapper(props);

        // Open first select and select second item from dropdown
        await openListAndSelect(wrapper, 0, 1);

        // Second select should not be visible as it contains no items
        const elements = wrapper.findAll('.multiselect-item > span');
        expect(elements.at(1).attributes('style')).toEqual('display: none;');
    });
});
