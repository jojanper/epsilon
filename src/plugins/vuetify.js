import Vue from 'vue';
import Vuetify, {
    VApp,
    VAppBar,
    VAppBarNavIcon,
    VMenu,
    VTooltip,
    VToolbar,
    VList,
    VListItem,
    VListItemContent,
    VListItemTitle,
    VListItemAction,
    VListItemIcon,
    VListGroup,
    VBtn,
    VFlex,
    VTextField,
    VSelect,
    VCheckbox,
    VSwitch,
    VIcon,
    VDialog,
    VCard,
    VCardText,
    VCardTitle,
    VCardActions,
    VDataTable,
    VAutocomplete,
    VTabs,
    VTab,
    VTabItem,
    VCarousel,
    VCarouselItem,
    VProgressLinear,
    VSlider,
    VRadioGroup,
    VRadio,
    VHover,
    VLabel,
    VExpandTransition,
    VNavigationDrawer
} from 'vuetify/lib';

import i18n from '../i18n';

export const CONFIG = {
    customProperties: true,
    components: {
        VApp,
        VAppBar,
        VAppBarNavIcon,
        VMenu,
        VTooltip,
        VToolbar,
        VList,
        VListItem,
        VListItemContent,
        VListItemTitle,
        VListItemAction,
        VListItemIcon,
        VListGroup,
        VBtn,
        VFlex,
        VTextField,
        VSelect,
        VCheckbox,
        VSwitch,
        VIcon,
        VDialog,
        VCard,
        VCardText,
        VCardTitle,
        VCardActions,
        VDataTable,
        VAutocomplete,
        VTabs,
        VTab,
        VTabItem,
        VCarousel,
        VCarouselItem,
        VProgressLinear,
        VSlider,
        VRadioGroup,
        VRadio,
        VHover,
        VLabel,
        VExpandTransition,
        VNavigationDrawer
    },
    global: {
        ripples: false
    },
    iconfont: 'mdi'
};

Vue.use(Vuetify, CONFIG);

const OPTS = {
    lang: {
        t: (key, ...params) => i18n.t(key, params)
    }
};
export const vuetify = new Vuetify(OPTS);
