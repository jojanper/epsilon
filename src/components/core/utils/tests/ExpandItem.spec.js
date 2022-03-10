import DraalExpandItem from '../ExpandItem.vue';

describe('DraalExpandItem', () => {
    setupVuetifyForTests(beforeAll, afterAll);

    function factory(propsData = {}) {
        return mountedComponentFactory(DraalExpandItem, {
            title: 'Expand',
            ...propsData
        });
    }

    it('title is present', () => {
        const wrapper = factory();
        const el = wrapper.find('.expand-title');
        expect(el.text()).toEqual('Expand');
    });

    it('item is closed', async () => {
        // GIVEN item is in opened state
        const wrapper = factory({
            value: true
        });
        expect(wrapper.findAll('.mdi-menu-up').length).toEqual(1);

        // WHEN closing the item programmatically
        await wrapper.setProps({ value: false });
        await wrapper.vm.$nextTick();

        // THEN item is in closed state
        expect(wrapper.findAll('.mdi-menu-down').length).toEqual(1);
    });

    it('item is opened and closed', async () => {
        // GIVEN expand item
        const wrapper = factory();

        // WHEN opening item
        wrapper.find('.mdi-menu-down').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN state is opened
        expect(wrapper.emitted().input[0][0]).toBeTruthy();

        // -----

        // WHEN closing item
        wrapper.find('.mdi-menu-up').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN stete is closed
        expect(wrapper.emitted().input[0][1]).toBeFalsy();
    });

    it('item is deleted', async () => {
        // GIVEN delete icon is available in expand item
        const wrapper = factory({
            deleteActionAttrs: {
                name: 'Delete'
            }
        });

        // WHEN clicking delete icon
        expect(Object.prototype.hasOwnProperty.call(wrapper.emitted(), 'delete')).toBeFalsy();
        wrapper.find('.mdi-delete').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN delete event is emitted
        expect(Object.prototype.hasOwnProperty.call(wrapper.emitted(), 'delete')).toBeTruthy();
    });

    it('item is exported', async () => {
        // GIVEN export icon is available in expand item
        const wrapper = factory({
            exportActionAttrs: {
                name: 'Export'
            }
        });

        // WHEN clicking export icon
        wrapper.find('.mdi-export').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN export event is emitted
        expect(wrapper.emitted().export[0][0]).toBeTruthy();

        // -----

        // WHEN clicking edit icon next to title again
        wrapper.find('.mdi-border-color').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN edit event is emitted
        expect(wrapper.emitted().edit[0][0]).toBeTruthy();

        // -----

        // WHEN editing the title name
        const editValue = 'Title2';
        const textInput = wrapper.find('input[type="text"]');
        await textInput.setValue(editValue);

        // AND then accepting the edited title
        wrapper.find('.mdi-check').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN new title is visible
        expect(wrapper.find('.expand-title').text()).toEqual(editValue);

        // AND export/title name is emitted
        expect(wrapper.emitted()['export-name'][0][0]).toEqual(editValue);

        // -----

        // WHEN clicking export icon again
        wrapper.find('.mdi-export').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN export event is emitted
        expect(wrapper.emitted().export[0][1]).toBeFalsy();
    });

    function getTestComponent(template, propsData = {}) {
        return createTestComponent(
            'TestDraalExpandItem',
            { DraalExpandItem },
            template,
            [],
            propsData
        );
    }

    it('custom actions are added', async () => {
        const template = `<draal-expand-item title="title" :custom-actions="2">
            <template slot="action-0">Custom action1</template>
            <template slot="action-1">Custom action2</template>
            <div class="expand-content" slot="content">CONTENT</div>
            </draal-expand-item>`;

        const wrapper = getTestComponent(template);

        expect(wrapper.findAll('.v-list-item__action').at(0).text()).toEqual('Custom action1');
        expect(wrapper.findAll('.v-list-item__action').at(1).text()).toEqual('Custom action2');
        expect(wrapper.find('.expand-content').text()).toEqual('CONTENT');
    });
});
