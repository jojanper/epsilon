<template>
    <div>
        <div v-for="(msg, index) in appNotifications" :key="index" :class="getClass(msg)"
            v-on:click.prevent="removeNotification(msg)">
            {{ msg.data }}
        </div>
    </div>
</template>

<script>
import { notificationComputed, notificationActions } from '@/store/helpers';

const clsMapper = {
    success: 'alert-success',
    warning: 'alert-warning',
    info: 'alert-info',
    error: 'alert-danger'
};

export default {
    name: 'DraalNotification',
    props: {
        clsMapper: {
            type: Object,
            required: false,
            default: () => clsMapper
        }
    },

    computed: {
        ...notificationComputed
    },

    data() {
        return {
        };
    },
    methods: {
        ...notificationActions,
        getClass(msg) {
            return `alert ${this.clsMapper[msg.type]}`;
        }
    }
};
</script>

<style lang="scss">
@mixin alert-image($bgColor, $img, $borderColor) {
    background: $bgColor url($img) no-repeat 10px 12px;
    background-position-y: 15px;
    border: 1px solid $borderColor;
}

.alert {
    box-shadow: 2px 2px 2px #999;
    text-align: left;
    padding-left: 30px;
    margin: 0.5em;
}

.alert-success {
    @include alert-image(#e9ffd9, '../assets/alert/success.png', #a6ca8a);
}

.alert-danger {
    @include alert-image(#ffecec, '../assets/alert/error.png', #f5aca6);
}

.alert-warning {
    @include alert-image(#fff8c4, '../assets/alert/warning.png', #f2c779);
}

.alert-info {
    @include alert-image(#e3f7fc, '../assets/alert/notice.png', #8ed9f6);
}
</style>
