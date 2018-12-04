import Vue from 'vue';
import Vuetify, {
    VApp,
    VMenu,
    VTooltip,
    VList,
    VListTile,
    VListTileTitle,
    VBtn,
    VFlex
} from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';


export const CONFIG = {
    customProperties: true,
    components: {
        VApp,
        VMenu,
        VTooltip,
        VList,
        VListTile,
        VListTileTitle,
        VBtn,
        VFlex
    }
};

function init() {
    Vue.use(Vuetify, CONFIG);
}

export default init();
