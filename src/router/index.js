import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress/nprogress';

import AppRefresh from '@/common/utils/refresh';
import DogsView from '@/views/demos/Dogs.vue';
import UtilsView from '@/views/demos/Utils.vue';
import Configurator from '@/views/configurator/Configurator.vue';

Vue.use(Router);

const routes = [
    {
        path: '/home',
        name: 'home',
        component: Configurator,
    },
    {
        path: '/demos',
        name: 'demos',
        component: DogsView,
    },

    {
        path: '/utils',
        name: 'utils',
        component: UtilsView,
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
