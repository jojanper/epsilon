import DraalNestedView from '../Nested.vue';

const LIST = [
    {
        text: 'Foo',
        active: false,
        children: [
            {
                text: 'A',
                active: false
            },
            {
                text: 'B',
                active: false
            },
            {
                text: 'C',
                active: false,
                children: [
                    {
                        text: 'A',
                        active: false
                    }
                ]
            }
        ]
    },
    {
        text: 'Fuuas',
        active: false,
        children: [
            {
                text: 'AA',
                active: false
            },
            {
                text: 'BB',
                active: false
            }
        ]
    },
    {
        text: 'BarFoo',
        active: true
    }
];

describe('DraalNestedView', () => {
    let elAttach;

    beforeAll(() => {
        prepareVuetify();
        elAttach = createDataApp();
    });

    afterAll(() => {
        removeDataApp(elAttach);
    });

    function factory(propsData = {}) {
        return mountedComponentFactory(DraalNestedView, propsData);
    }

    it('list is rendered', async () => {
        const wrapper = factory({
            nodes: LIST
        });

        // High level groups are visible
        expect(wrapper.findAll('.v-list-group').length).toEqual(LIST.length);

        // Open first group
        wrapper.findAll('.mdi-chevron-down').at(0).trigger('click');
        await wrapper.vm.$nextTick();

        // More items are visible under that group
        expect(wrapper.findAll('.v-list-group').length).toEqual(LIST.length + 3);

        // Open second group (from high level structure)
        wrapper.findAll('.mdi-chevron-down').at(2).trigger('click');
        await wrapper.vm.$nextTick();

        // Yet another set of items are now visible
        expect(wrapper.findAll('.v-list-group').length).toEqual(LIST.length + 3 + 2);

        // Select item from list
        wrapper.findAll('[role="listitem"]').at(1).trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().selected[0][1].text).toEqual(LIST[0].children[0].text);
    });
});
