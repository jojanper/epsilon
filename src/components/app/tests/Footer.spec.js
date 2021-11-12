import DraalFooter from '../Footer.vue';
import { storeModule, name } from '@/store/modules/app';

describe('DraalFooter', () => {
    prepareVuex();

    const store = createTestStore(storeModule);

    function validateRender(expected) {
        const wrapper = shallowMountedComponentFactory(DraalFooter, {}, { store });
        const elements = wrapper.findAll('.text-muted');
        expect(elements.at(0).text()).toEqual(expected);
    }

    it('application version is not visible', () => {
        validateRender('');
    });

    it('application version is visible', () => {
        store.commit(`${name}/SET_VERSION`, { localRef: '1.2.3', reload: false });
        validateRender('Application version: 1.2.3');
    });
});
