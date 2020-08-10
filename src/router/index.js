import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress/nprogress';

import AppRefresh from '@/common/utils/refresh';
import License from '@/views/license/License.vue';
import LicenseUtils from '@/views/license/LicenseUtils.vue';
import Configurator from '@/views/configurator/Configurator.vue';

Vue.use(Router);

const routes = [
    {
        path: '/home',
        name: 'home',
        component: Configurator,
    },
    {
        path: '/license',
        name: 'license',
        component: License,
    },

    {
        path: '/utils',
        name: 'utils',
        component: LicenseUtils,
    },

    // Redirect any unmatched routes to the home page.
    {
        path: '*',
        redirect: '/home',
    }
];

const router = new Router({
    routes,

    // Simulate native-like scroll behavior when navigating to a new
    // route and using back/forward buttons.
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }

        return {
            x: 0,
            y: 0
        };
    }
});

export default router;

// After navigation is confirmed, but before resolving
router.beforeResolve((routeTo, routeFrom, next) => {
    // If this isn't an initial page load...
    if (routeFrom.name) {
        // Start the route progress bar
        NProgress.start();
    }

    next();
});

// When each route is finished evaluating
router.afterEach(() => NProgress.done());

router.beforeEach((to, from, next) => {
    AppRefresh.runCheck();
    next();
});
