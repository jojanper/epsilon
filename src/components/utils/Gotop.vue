<template>
    <div class="goTop" :class="getClass()" v-if="isVisible" @click="backToTop">
        <i class="icon ion-ios-arrow-dropup-circle text-danger" aria-hidden="true"></i>
    </div>
</template>

<script>
export default {
    name: 'DraalGo2Top',
    destroyed() {
        console.log('DESTROYED');
        document.removeEventListener('scroll', this.scrollHandler);
    },
    data() {
        return {
            isVisible: false
        };
    },
    methods: {
        getClass() {
            return this.isVisible ? 'isVisible' : '';
        },

        scrollHandler() {
            // const backToTopButton = $('.goTop');
            // console.log(document.scrollingElement.scrollTop);
            // console.log(this);
            if (document.scrollingElement.scrollTop > 250) {
                // backToTopButton.addClass('isVisible');
                this.isVisible = true;
            } else {
                // backToTopButton.removeClass('isVisible');
                this.isVisible = false;
            }
        },

        initToTopButton() {
            // $(document).bind('scroll', function() {
            document.addEventListener('scroll', this.scrollHandler);
        },

        backToTop() {
            // console.log('BACK TOP TOP');
            /*
            document.querySelector('body').stop().animate({
                scrollTop: 0
            }, 'slow', 'swing');
            */
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    },
    mounted() {
        this.$nextTick(() => this.initToTopButton());
    }
};
</script>

<style lang="scss">
.goTop {
  border-radius: 50%;
  //background-color: rgb(1,14,27);
  //background-color: rgba(1, 14, 27, .7);
  position: fixed;
  width: 45px;
  height: 45px;
  display: block;
  right: 1.5em;
  bottom: 2.5em;
  border: none;
  opacity: 0;
  z-index: -1;
  /*
  .fa {
    color: white;
    font-size: 22px;
  }
  */
  &:hover {
    opacity: 0.8;
    //background-color: rgb(1,14,27);
    //background-color: rgba(1, 14, 27, .9);
  }

  i {
      font-size: 4em;
  }
}

.isVisible {
  opacity: 1;
  z-index: 4;
  transition: all 0.4s ease-in ease-out;
}
</style>
