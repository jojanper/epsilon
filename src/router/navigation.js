import { isElectron } from '@/common/utils';

const routes = [];

if (!isElectron()) {
    routes.push(
        {
            title: 'Configurator',
            name: 'home'
        },
        {
            title: 'Demos',
            name: 'demos'
        },
        {
            title: 'Utils',
            name: 'utils'
        }
    );
} else {
    routes.push({
        title: 'Configurator',
        name: 'home'
    });
}

export const CONFIG = {
    routes,
    home: 'home'
};
