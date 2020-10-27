import { isElectron } from '@/common/utils';

const routes = [
    {
        title: '',
        path: '/',
        name: 'home'
    }
];

if (!isElectron()) {
    routes.push(
        {
            title: 'Configurator',
            path: '/configurator',
            name: 'configurator',
            meta: {
                breadcrumb: 'Configurator'
            }
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
                    name: 'dogs-api',
                    meta: {
                        breadcrumb: 'Dogs API'
                    }
                }
            ]
        },
        {
            title: 'Utils',
            path: '/utils',
            name: 'utils',
            meta: {
                breadcrumb: 'Utils'
            }
        },
        {
            title: 'About',
            path: '/about',
            name: 'about',
            meta: {
                breadcrumb: 'About'
            }
        }
    );
}

export const CONFIG = {
    routes,
    home: 'home',
    homeName: 'Home'
};
