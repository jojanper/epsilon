import { isElectron } from '@/common/utils';

const routes = [];

if (!isElectron()) {
    routes.push(
        {
            title: '',
            path: '/',
            name: 'home'
        },
        {
            title: 'Configurator',
            path: '/configurator',
            name: 'configurator'
        },
        {
            title: 'Demos',
            path: '/demos',
            name: 'demos',
            meta: {
                breadcrumb: 'Demos'
            },
            children: [
                {
                    path: 'dogs-api',
                    name: 'dogs-api'
                }
            ]
        },
        {
            title: 'Utils',
            path: '/utils',
            name: 'utils'
        },
        {
            title: 'About',
            path: '/about',
            name: 'about'
        }
    );
} else {
    routes.push(
        {
            title: '',
            path: '/',
            name: 'home'
        }
    );
}

export const CONFIG = {
    routes,
    home: 'home'
};
