import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';

import DraalBreadcrumbs from './Breadcrumbs.vue';

const localVue = createLocalVue();

const $route = {
    path: '/',
    matched: [{
        name: 'somepage',
        meta: {
            breadcrumb: 'Some Page'
        }
    }]
};

describe('DraalBreadcrumbs', () => {
    it('current site navigation is rendered', async () => {
        const wrapper = shallowMount(DraalBreadcrumbs, {
            localVue,
            propsData: {
                homeName: 'Home',
                homeRouteName: 'home'
            },
            stubs: {
                RouterLink: RouterLinkStub
            },
            mocks: {
                $route
            }
        });

        // 2 breadcrumb items visible
        let elements = wrapper.findAll('.breadcrumb-item');
        expect(elements.length).toEqual(2);

        // Item names match the expected names
        expect(elements.at(0).text()).toEqual('Home');
        expect(elements.at(1).text()).toEqual('Some Page');

        // -----

        // Route is changed to home
        $route.matched[0].name = 'home';
        await wrapper.vm.$nextTick();

        // No breadcrumbs are visible when in home page
        elements = wrapper.findAll('.breadcrumb-item');
        expect(elements.length).toEqual(0);
    });
});
