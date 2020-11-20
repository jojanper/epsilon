<template>
  <div>
    <h1>Epsilon</h1>
    <div class="home">
      <img src="../assets/logo.png" />
    </div>

    <draal-audio-player class="mb-3" :name="url" :url="url"></draal-audio-player>
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
            url: URL
        };
    }
};
</script>
