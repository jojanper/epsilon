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
            title: 'Examples',
            path: '/examples',
            name: 'examples',
            meta: {
                breadcrumb: 'Examples'
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
                },
                {
                    path: 'iex-api',
                    name: 'iex-api',
                    meta: {
                        breadcrumb: 'IEX API'
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
            title: 'Audio',
            path: '/audio',
            name: 'audio',
            meta: {
                breadcrumb: 'Audio'
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
