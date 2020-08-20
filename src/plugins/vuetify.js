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
    VCarouselItem
} from 'vuetify/lib';


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
        VCarouselItem
    },
    global: {
        ripples: false
    },
    iconfont: 'mdi'
};

Vue.use(Vuetify, CONFIG);

const OPTS = {};
export const vuetify = new Vuetify(OPTS);
