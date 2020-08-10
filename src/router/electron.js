import Vue from 'vue';
import Router from 'vue-router';

import Configurator from '@/views/configurator/Configurator.vue';

Vue.use(Router);

const routes = [
    {
        path: '/home',
        name: 'home',
        component: Configurator,
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
