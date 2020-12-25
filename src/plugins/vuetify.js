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
    VListGroup,
    VBtn,
    VFlex,
    VTextField,
    VSelect,
    VCheckbox,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelHeader,
    VExpansionPanelContent,
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
    VInput
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
        VListGroup,
        VBtn,
        VFlex,
        VTextField,
        VSelect,
        VCheckbox,
        VExpansionPanels,
        VExpansionPanel,
        VExpansionPanelHeader,
        VExpansionPanelContent,
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
        VInput
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
