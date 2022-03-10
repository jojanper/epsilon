import { shallowMount, RouterLinkStub, createLocalVue } from '@vue/test-utils';

import DraalHeader from '../Header.vue';

describe('DraalHeader', () => {
    let localVue;

    const propsData = {
        appName: 'test',
        homeRoute: 'home',
        routes: [
            {
                name: 'home',
                title: 'Testing'
            },
            {
                name: 'route',
                title: 'Route'
            }
        ]
    };

    setupVuetifyForTests(beforeAll, afterAll);

    beforeEach(() => {
        localVue = createLocalVue();
    });

    it('renders correctly', () => {
        const wrapper = shallowMount(DraalHeader, {
            localVue,
            propsData,
            stubs: {
                RouterLink: RouterLinkStub
            }
        });

        // 2 * number of routes + desktop header home link
        expect(wrapper.findAll('a').length).toEqual(5);

        // Desktop header
        const desktop = wrapper.findAll('.hidden-sm-and-down a');
        expect(desktop.length).toEqual(3);
        expect(desktop.at(0).text()).toMatch(propsData.appName);
        expect(desktop.at(1).text()).toMatch(propsData.routes[0].title);
        expect(desktop.at(2).text()).toMatch(propsData.routes[1].title);

        // Mobile header
        const mobile = wrapper.findAll('.hidden-md-and-up a');
        expect(mobile.length).toEqual(2);
        expect(mobile.at(0).text()).toMatch(propsData.routes[0].title);
        expect(mobile.at(1).text()).toMatch(propsData.routes[1].title);
    });
});
