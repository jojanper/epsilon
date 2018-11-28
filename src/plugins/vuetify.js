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

Vue.use(Vuetify, {
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
});
