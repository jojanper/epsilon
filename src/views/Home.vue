<template>
  <div>
    <h1>Epsilon</h1>
    <div class="home">
      <img src="../assets/logo.png" />
    </div>

    <!--v-icon class="timeline-entry" :style="getEventPosStyle(item)">mdi-map-marker-outline</v-icon-->

    <draal-audio-player class="mb-3" :name="url" :url="url" @audio-duration="setDuration">
      <div class="position-relative mt-3 mb-3 pb-3">
        <div v-for="(item, i) in eventPos" :key="i">
          <v-hover v-slot="{ hover }" open-delay="400">
            <div class="audio-event-wrapper" :style="getEventPosStyle(item)">
              <v-icon color="blue darken-1" class="audio-event-marker">mdi-map-marker</v-icon>
              <div v-if="hover" class="position-absolute" style="top: 20px;">
                <v-card class="p-1 z-index-10" color="grey lighten-4">
                  <v-card-text class="p-2">
                    <div class="p-0 font-weight-light title">{{ item }}</div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-hover>
        </div>
      </div>
    </draal-audio-player>

    <!--draal-audio-player class="mb-3" :name="url" :url="url">
      <div class="position-relative mt-3 mb-3 pb-3">
        <div v-for="(item, i) in eventPos" :key="i">
          <v-hover v-slot="{ hover }" open-delay="400">
            <div class="timeline-entry" :style="getEventPosStyle(item)">
              <div
                v-if="hover"
                class2="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
                class="d2-flex darken2-2"
                style="position: absolute; height: 100%; top: 20px;"
              >
                <v-card
                  class="p-1"
                  class2="mx-auto"
                  color="grey lighten-4"
                  max-width2="600"
                  style="z-index: 100; "
                >
                  <v-card-text class="p-2" style2="position: relative;">
                    <div class="p-0 font-weight-light title mb-2">{{ item }}</div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-hover>
        </div>
      </div>
    </draal-audio-player-->
  </div>
</template>

<script>
import DraalAudioPlayer from '@/components/core/AudioPlayer.vue';

const URL = 'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3';

export default {
    name: 'home',
    components: {
        DraalAudioPlayer
    },
    data() {
        return {
            url: URL,
            eventPos: [
                0.5,
                2,
                10,
                70
            ],
            duration: 0
        };
    },
    methods: {
        setDuration(duration) {
            this.duration = duration;
        },

        getEventPosStyle(pos) {
            const duration = (pos / this.duration) * 100;
            return `--left: ${duration}%`;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
/*
.timeline-entry {
    top: 0px;
    position: absolute;
    border-left: 4px solid red;
    height: 15px;
    width: 10%;
    left: var(--left);
    transform2: rotate(180deg);
}
*/

.audio-event-wrapper {
    top: -8px;
    position: absolute;
    // border-left: 1px solid red;
    //height: 15px;
    width: 100%;
    left: var(--left);
    //transform2: rotate(180deg);
}
.audio-event-marker {
    position: absolute;
    font-size: 24px;
    left: -12px;
    // color: red;
    //font-size: 20px;

  /*
    top: 0px;
    position: absolute;
    border-left: 4px solid red;
    height: 15px;
    width: 10%;
    left: var(--left);
    */
    transform: rotate(180deg);
}

.z-index-10 {
    z-index: 10
}
</style>
