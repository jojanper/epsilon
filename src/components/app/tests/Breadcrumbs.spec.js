import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';

import DraalBreadcrumbs from '../Breadcrumbs.vue';

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
    function getWrapper(route) {
        const localVue = createLocalVue();

        return shallowMount(DraalBreadcrumbs, {
            localVue,
            propsData: {
                homeName: 'Home',
                homeRouteName: 'home'
            },
            stubs: {
                RouterLink: RouterLinkStub
            },
            mocks: {
                $route: route
            }
        });
    }

    it('current site navigation is rendered', async () => {
        const wrapper = getWrapper($route);

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

    it('multiple params in site path', async () => {
        const wrapper = getWrapper({
            path: '/foo/1/bar/2',
            params: {
                id1: 1,
                id2: 2
            },
            matched: [
                {
                    name: 'foo',
                    meta: {
                        breadcrumb: 'Foo'
                    }
                },
                {
                    name: 'id1',
                    meta: {
                        paramId: 'id1'
                    }
                },
                {
                    name: 'bar',
                    meta: {
                        breadcrumb: 'Bar'
                    }
                },
                {
                    name: 'id2',
                    meta: {
                        paramId: 'id2'
                    }
                }
            ]
        });

        // Multiple breadcrumb items visible
        const elements = wrapper.findAll('.breadcrumb-item');
        expect(elements.length).toEqual(5);

        // Item names match the expected names
        expect(elements.at(0).text()).toEqual('Home');
        expect(elements.at(1).text()).toEqual('Foo');
        expect(elements.at(2).text()).toEqual('1');
        expect(elements.at(3).text()).toEqual('Bar');
        expect(elements.at(4).text()).toEqual('2');
    });
});
