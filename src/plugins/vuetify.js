import Vue from 'vue';
import Vuetify, {
    VApp,
    VMenu,
    VTooltip,
    VList,
    VListItem,
    VListItemContent,
    VListItemTitle,
    VBtn,
    VFlex
} from 'vuetify/lib';


export const CONFIG = {
    customProperties: true,
    components: {
        VApp,
        VMenu,
        VTooltip,
        VList,
        VListItem,
        VListItemContent,
        VListItemTitle,
        VBtn,
        VFlex
    }
};

Vue.use(Vuetify, CONFIG);

const OPTS = {};
export const vuetify = new Vuetify(OPTS);
