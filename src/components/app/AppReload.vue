<template>
  <draal-tooltip
    v-if="newAppVersionAvailable"
    :classes="classes"
    position="top"
    :name="$t('header.newVersion')"
    icon="mdi-refresh"
    iconSize="large"
    iconColor="red"
    @clicked="reloadApp"
  ></draal-tooltip>
</template>

<script>
import { appActions, appComputed } from '@/store/helpers';
import DraalTooltip from '@/components/core/utils/Tooltip.vue';

export default {
    name: 'DraalAppReloader',
    props: {
        /**
         * CSS classes for the tooltip.
         */
        classes: {
            type: String,
            required: false,
            default: ''
        }
    },
    components: {
        DraalTooltip
    },
    computed: {
        ...appComputed
    },
    methods: {
        ...appActions
    }
};
</script>
