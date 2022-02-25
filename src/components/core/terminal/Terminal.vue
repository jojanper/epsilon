<template>
  <div v-if="show && data.length">
    <div class="terminal-menu terminal-menu-focus clearfix">
      <div
        v-if="canClose"
        class="terminal-buttons terminal-close"
        @click="close"
        @keyup="close"
      ></div>
      <span
        v-if="title"
        class="terminal-title-text"
      >{{ title }}</span>
    </div>
    <div class="terminal-screen">
      <v-card
        :class="classes"
        class="mx-auto data-screen"
        max-width="2048"
      >
        <v-card-text class="data-screen-text">
          <div
            v-for="(item, i) in data"
            :key="i"
          >
            <div
              class="text-left pre-wrap data-screen-text"
              v-if="item.length"
              v-html="item"
            ></div>
            <br v-if="!item.length" />
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { ansiColors } from '../../../common/utils';

export default {
    name: 'DraalTerminal',
    props: {
        /**
         * Terminal close value.
         */
        value: {
            type: Boolean,
            required: false,
            default: true
        },
        /**
         * Input data to show.
         */
        dataInput: {
            type: Array,
            required: true
        },
        /**
         * Terminal classes.
         */
        classes: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Terminal title.
         */
        title: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Close button status (is close allowed).
         */
        canClose: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return {
            show: this.value
        };
    },
    computed: {
        data() {
            return this.dataInput
                .flat()
                .flatMap(item => item.split('\n'))
                .filter(item => item.length)
                .map(item => ansiColors(item));
        }
    },
    methods: {
        close() {
            this.show = false;

            /**
             * Close event status.
             */
            this.$emit('input', this.show);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.data-screen {
    background: black;
}

.data-screen-text {
    color: white;
    font-weight: 700;
}

.pre-wrap {
    white-space: pre-wrap;
}

@mixin terminalBorders() {
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.59);
}

$terminal-height: 32px;

.terminal-menu {
    box-sizing: border-box;
    height: #{$terminal-height};
    background-color: #bbb;
    margin: 0 auto;
    overflow: hidden;
    top: 29px;
    @include terminalBorders();
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    > span {
        font-size: 0.8em;
        display: inline-block;
        padding-left: 4px;
        transform: translateY(-1px);
    }

    .separator {
        display: inline-block;
        width: 8px;
    }

    padding-left: 5px;
    text-align: center;
}

.terminal-menu-focus {
    background-color: #bbb;
}

.terminal-screen {
    padding: 5px;
    background-color: black;
    box-sizing: border-box;
    height: calc(100% - #{$terminal-height});
    @include terminalBorders();
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.terminal-title-text {
    margin-top: 5px;
    margin-left: 10px;
    font-weight: 700;
    font-size: 14px !important;
}

.terminal-buttons {
    height: 12px;
    width: 12px;
    border-radius: 50%;
    border: 1px solid #000;
    position: relative;
    float: left;
    top: 10px;
}

@mixin terminalButton($bgColor, $borderColor) {
    margin-left: 7px;
    background-color: $bgColor;
    border-color: $borderColor;
    cursor: pointer;
}

.terminal-close {
    @include terminalButton(#ff3b47, #9d252b);
}

.terminal-zoom {
    @include terminalButton(#00d742, #049931);
}
</style>
