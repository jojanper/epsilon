import { RouterLinkStub } from '@vue/test-utils';

import DraalSideMenu from '../Sidemenu.vue';

const $route = {
    path: '/',
    matched: [{
        path: '/',
        meta: {
            breadcrumb: 'Some Page'
        }
    }]
};

const $router = {
    options: {
        routes: [
            {
                path: '/',
                children: [
                    {
                        path: 'link1',
                        meta: {
                            breadcrumb: 'Link 1'
                        }
                    },
                    {
                        path: 'link2',
                        meta: {
                            breadcrumb: 'Link 2'
                        }
                    }
                ]
            }
        ]
    }
};

const $router2 = {
    options: {
        routes: [
            {
                path: '/'
            }
        ]
    }
};

describe('DraalSideMenu', () => {
    setupVuetifyForTests(beforeAll, afterAll);

    function getWrapper(route, router, props = {}) {
        return shallowMountedComponentFactory(DraalSideMenu, props, {
            stubs: {
                RouterLink: RouterLinkStub
            },
            mocks: {
                $route: route,
                $router: router
            }
        });
    }

    it('desktop side menu is rendered', () => {
        const wrapper = getWrapper($route, $router);
        const elements = wrapper.findAll('.side-menu-title');
        expect(elements.length).toEqual($router.options.routes[0].children.length);
    });

    it('mobile side menu is rendered', () => {
        const wrapper = getWrapper($route, $router, { mobile: true });
        const elements = wrapper.findAll('.nav-wrapper');
        expect(elements.length).toEqual(1);
    });

    it('no side menu links available', () => {
        const wrapper = getWrapper($route, $router2);
        expect(wrapper.findAll('.side-menu-title').length).toEqual(0);
        expect(wrapper.findAll('.nav-wrapper').length).toEqual(0);
    });
});
