import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress/nprogress';

import Home from '@/views/Home.vue';
import About from '@/views/About.vue';

Vue.use(Router);

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/about',
        name: 'about',
        component: About,
    },
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
