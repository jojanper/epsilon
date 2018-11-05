import { shallowMount, RouterLinkStub, createLocalVue } from '@vue/test-utils';

import DraalHeader from './Header.vue';


describe('DraalHeader', () => {
    let localVue;

    const props = {
        appName: 'test',
        routes: [
            {
                name: 'home',
                title: 'Testing'
            }
        ]
    };

    beforeEach(() => {
        localVue = createLocalVue();
    });

    it('renders correctly', () => {
        const wrapper = shallowMount(DraalHeader, {
            localVue,
            propsData: props,
            stubs: {
                RouterLink: RouterLinkStub,
            }
        });
        const elements = wrapper.findAll('a');
        expect(elements.length).toEqual(2);
        expect(elements.at(0).text()).toMatch(props.appName);
        expect(elements.at(1).text()).toMatch(props.routes[0].title);
    });
});
