import { storeModule as appModule } from './app';
import { storeModule as notificationModule } from './notification';

const modules = {
    ...appModule,
    ...notificationModule
};

export default modules;
