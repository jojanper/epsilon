<template>
  <div>
    <audio :src="url" ref="audioplayer"></audio>

    <div class="row">
      <div class="col pb-0">
        <v-btn
          outlined
          icon
          class="ma-2"
          :color="color"
          @click.native="playing ? pause() : play()"
          :disabled="!loaded"
        >
          <v-icon v-if="!playing || paused">mdi-play</v-icon>
          <v-icon v-else>mdi-pause</v-icon>
        </v-btn>

        <v-btn outlined icon class="ma-2" :color="color" @click.native="stop()" :disabled="!loaded">
          <v-icon>mdi-stop</v-icon>
        </v-btn>

        <v-btn outlined icon class="ma-2" :color="color" @click.native="mute()" :disabled="!loaded">
          <v-icon v-if="!muted">mdi-volume-high</v-icon>
          <v-icon v-else>mdi-volume-mute</v-icon>
        </v-btn>

        <v-btn outlined icon class="ma-2" :color="color" :disabled="!loaded">
          <a :href="url" :download="name">
            <v-icon>mdi-download</v-icon>
          </a>
        </v-btn>
      </div>

      <div class="col mt-1 pb-0">
        <v-slider
          prepend-icon="mdi-volume-high"
          :color="color"
          :track-color="volumeColor"
          v-model="volume"
          :min="0"
          :max="1"
          step="0.01"
          @input="setVolume"
        ></v-slider>
      </div>
    </div>

    <div class="float-right">{{ getDisplayTime(audioPos * duration * 0.01) }} / {{ renderDuration }}</div>

    <v-progress-linear
      :class="[{'hover': playing}]"
      v-model="audioPos"
      :color="color"
      height="10"
      @click.native="setPosition()"
      :disabled="!loaded"
    ></v-progress-linear>

    <!--
      @slot Default slot.
    -->
    <slot name="default"></slot>
  </div>
</template>

<script>
/**
 * Audio player.
 *
 * @displayName DraalAudioPlayer
 */
export default {
    name: 'DraalAudioPlayer',
    props: {
        /**
         * Media URI (url, blob etc).
         */
        url: {
            type: String,
            required: true
        },
        /**
         * Name of download link.
         */
        name: {
            type: String,
            required: true
        },
        /**
         * Player color scheme.
         */
        color: {
            type: String,
            required: false,
            default: 'blue darken-1'
        },
        /**
         * Track color of the volume control.
         */
        volumeColor: {
            type: String,
            required: false,
            default: 'light-blue lighten-3'
        }
    },
    data() {
        return {
            audioPos: 0,
            playing: false,
            paused: false,
            loaded: false,
            muted: false,
            volume: 0.5,
            duration: 0,
            renderDuration: null
        };
    },
    created() {
        this.timerId = null;
    },
    beforeDestroy() {
        clearInterval(this.timerId);
    },
    mounted() {
        this.$refs.audioplayer.focus();

        // Position update
        this.$refs.audioplayer.ontimeupdate = ({ srcElement }) => {
            this.audioPos = (srcElement.currentTime / srcElement.duration) * 100;

            /**
             * Audio position update.
             *
             * @property {number} Audio position in seconds.
             * @property {number} Audio position in percentages.
             */
            this.$emit('audio-position', srcElement.currentTime, this.audioPos);
        };

        // Data loaded event for audio
        this.$refs.audioplayer.onloadeddata = () => {
            if (this.$refs.audioplayer.readyState >= 2) {
                this.duration = this.$refs.audioplayer.duration;
                this.renderDuration = this.getDisplayTime(this.duration);

                /**
                 * Audio duration event.
                 *
                 * @property {number} Audio duration.
                 */
                this.$emit('audio-duration', this.duration);

                this.loaded = true;
                this.$refs.audioplayer.volume = this.volume;
            }
        };

        // Playback finished event
        this.$refs.audioplayer.onended = () => {
            this.playing = false;
            this.paused = false;
            this.audioPos = 0;
        };

        // Regularly update playback position for smooth progress rendering
        this.timerId = setInterval(this.updateplayPosition, 100);
    },
    methods: {
        /**
         * Update current playback position.
         */
        updateplayPosition() {
            if (this.$refs.audioplayer && this.$refs.audioplayer.currentTime && this.playing) {
                this.audioPos = (this.$refs.audioplayer.currentTime / this.duration) * 100;
            }
        },

        /**
         * Set playback position.
         */
        setPosition() {
            this.$refs.audioplayer.currentTime = this.duration * 0.01 * this.audioPos;
        },

        /**
         * Start playback.
         */
        async play() {
            if (!this.playing) {
                await this.$refs.audioplayer.play();
                this.playing = true;
                this.paused = false;
            }
        },

        /**
         * Pause playback
         */
        pause() {
            this.paused = !this.paused;
            if (this.paused) {
                this.$refs.audioplayer.pause();
            } else {
                this.$refs.audioplayer.play();
            }
        },

        /**
         * Stop playback.
         */
        stop() {
            this.$refs.audioplayer.pause();
            this.paused = true;
            this.playing = false;
            this.$refs.audioplayer.currentTime = 0;
            this.audioPos = 0;
        },

        /**
         * Mute / unmute volume.
         */
        mute() {
            this.muted = !this.muted;
            this.$refs.audioplayer.muted = this.muted;
        },

        /**
         * Set new volume.
         */
        setVolume(volume) {
            this.$refs.audioplayer.volume = volume;
            if (volume === 0) {
                this.mute();
            } else if (this.muted) {
                this.muted = false;
                this.$refs.audioplayer.muted = false;
            }
        },

        /**
         * Convert time measured in seconds into HH:MM:SS format.
         */
        getDisplayTime(time) {
            let timeSec = time;

            let hours = Math.floor(timeSec / 3600);
            timeSec = time - hours * 3600;
            let minutes = Math.floor(timeSec / 60);

            // As we are rounding the seconds, make sure to it stays valid value
            let seconds = parseInt((timeSec % 60).toFixed(0), 10);
            if (seconds === 60) {
                seconds = 0;
                minutes += 1;
            }

            // Minutes was increased to full minute -> increase hours instead
            if (minutes === 60) {
                minutes = 0;
                hours += 1;
            }

            const hh = (hours < 10) ? `0${hours}` : hours;
            const mm = (minutes < 10) ? `0${minutes}` : minutes;
            const ss = (seconds < 10) ? `0${seconds}` : `${seconds}`;

            return `${hh}:${mm}:${ss}`;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hover {
    cursor: pointer;
}

.v-application a {
  color: inherit !important;
}

</style>
