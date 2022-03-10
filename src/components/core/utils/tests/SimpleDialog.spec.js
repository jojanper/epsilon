import DraalSimpleDialog from '../SimpleDialog.vue';

describe('DraalSimpleDialog', () => {
    const props = {
        title: 'Tile',
        content: 'Content'
    };

    setupVuetifyForTests(beforeAll, afterAll);

    function factory(propsData = {}) {
        return mountedComponentFactory(DraalSimpleDialog, propsData);
    }

    function test(value, length) {
        factory({ ...props, value });
        const dialog = document.body.getElementsByClassName('v-dialog__content--active');
        expect(dialog.length).toEqual(length);
    }

    it('dialog is not visible', () => {
        test(false, 0);
    });

    it('dialog is visible', () => {
        test(true, 1);
    });
});
