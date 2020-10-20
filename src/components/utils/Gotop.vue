<template>
  <div class="go-top" :class="getClass()" @click="backToTop">
    <v-icon x-large color="red">mdi-arrow-up-circle</v-icon>
  </div>
</template>

<script>
export default {
    name: 'DraalGo2Top',
    props: {
        scrollHeight: {
            type: Number,
            required: false,
            default: 250
        }
    },

    destroyed() {
        window.removeEventListener('scroll', this.scrollHandler);
    },

    data() {
        return {
            isVisible: false
        };
    },

    methods: {
        getClass() {
            return this.isVisible ? 'go-top-visible' : 'go-top-invisible';
        },
        scrollHandler() {
            this.isVisible = window.scrollY > this.scrollHeight;
        },
        backToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    mounted() {
        this.$nextTick(() => window.addEventListener('scroll', this.scrollHandler));
    }
};
</script>

<style lang="scss">
.go-top {
    border-radius: 50%;
    position: fixed;
    width: 45px;
    height: 45px;
    display: block;
    right: 1.5em;
    bottom: 2.5em;
    border: none;
    z-index: -1;
    &:hover {
        opacity: 0.8;
    }

    i {
        font-size: 4em !important;
    }
}

.go-top-invisible {
    opacity: 0;
    visibility: hidden;
    transition: visibility 0.5s, opacity 0.5s linear;
}

.go-top-visible {
    opacity: 1;
    z-index: 4;
    visibility: visible;
    transition: all 0.5s linear;
}
</style>
