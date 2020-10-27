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
    it('current site navigation is rendered', () => {
        const wrapper = shallowMount(DraalBreadcrumbs, {
            localVue,
            propsData: {
                homeName: 'Home',
                homeRoute: '/'
            },
            stubs: {
                RouterLink: RouterLinkStub
            },
            mocks: {
                $route
            }
        });

        // console.log(wrapper.vm.breadcrumbs);

        const elements = wrapper.findAll('.breadcrumb-item');
        expect(elements.length).toEqual(2);

        expect(elements.at(0).text()).toEqual('Home');
        expect(elements.at(1).text()).toEqual('Some Page');
    });
});
