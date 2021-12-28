import Vue from 'vue';
import Router from 'vue-router';

import { CONFIG } from './navigation';
import ComponentExamples from '@/views/components/Examples.vue';

Vue.use(Router);

const routes = [
    {
        ...CONFIG.routes[0],
        component: ComponentExamples
    },

    // Redirect any unmatched routes to the home page.
    {
        path: '*',
        redirect: '/'
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
