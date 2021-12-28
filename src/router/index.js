import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress/nprogress';

import { CONFIG } from './navigation';
import AppRefresh from '@/common/utils/refresh';
import DemosHomeView from '@/views/demos/DemosHome.vue';
import DogsView from '@/views/demos/Dogs.vue';
import UtilsView from '@/views/demos/Utils.vue';
import ComponentExamples from '@/views/components/Examples.vue';
import AboutView from '@/views/About.vue';
import HomeView from '@/views/Home.vue';
import AudioView from '@/views/audio/Home.vue';

Vue.use(Router);

const DOGS = {
    children: [
        {
            ...CONFIG.routes[2].children[0],
            component: DogsView
        }
    ]
};

DOGS.children[0].children[0].component = DogsView;
DOGS.children[0].children[0].children[0].component = DogsView;

const routes = [
    {
        ...CONFIG.routes[0],
        component: HomeView
    },
    {
        ...CONFIG.routes[1],
        component: ComponentExamples,
        props: route => ({
            vtab: route.query.vtab ? parseInt(route.query.vtab, 10) : null,
            htab: route.query.htab ? parseInt(route.query.htab, 10) : null
        })
    },
    {
        ...CONFIG.routes[2],
        component: DemosHomeView,
        ...DOGS
    },

    {
        ...CONFIG.routes[3],
        component: UtilsView
    },

    {
        ...CONFIG.routes[4],
        component: AudioView
    },

    {
        ...CONFIG.routes[5],
        component: AboutView
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
