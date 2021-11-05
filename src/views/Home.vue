<template>
  <div class="pr-4">
    <h1>Epsilon</h1>
    <div class="home">
      <img src="../assets/logo.png" />
    </div>

    <draal-audio-player
      class="p-3 mb-4 w-75 mx-auto elevation-2"
      :name="url"
      :url="url"
      :events="eventPos"
    >
      <template v-slot:item="{ event }">Position: {{ event }}s</template>
    </draal-audio-player>
  </div>
</template>

<script>
import DraalAudioPlayer from '@/components/core/AudioPlayer.vue';

const URL = 'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3';

export default {
    name: 'DraalAppHome',
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
                70,
                45
            ]
        };
    }
};
</script>
