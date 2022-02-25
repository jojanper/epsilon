<template>
  <div>
    <audio
      :src="url"
      ref="audioplayer"
    >
      <track kind="captions" />
    </audio>

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

        <v-btn
          outlined
          icon
          class="ma-2"
          :color="color"
          @click.native="stop()"
          :disabled="!loaded"
        >
          <v-icon>mdi-stop</v-icon>
        </v-btn>

        <v-btn
          outlined
          icon
          class="ma-2"
          :color="color"
          @click.native="mute()"
          :disabled="!loaded"
        >
          <v-icon v-if="!muted">mdi-volume-high</v-icon>
          <v-icon v-else>mdi-volume-mute</v-icon>
        </v-btn>

        <v-btn
          outlined
          icon
          class="ma-2"
          :color="color"
          :disabled="!loaded"
        >
          <a
            :href="url"
            :download="name"
          >
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

    <div class="float-right">{{ getDisplayTime(audioPos * duration * 0.01) }} / {{ renderDuration }}
    </div>

    <v-progress-linear
      :class="[{'hover': playing}]"
      v-model="audioPos"
      :color="color"
      height="10"
      @click.native="setPosition()"
      :disabled="!loaded"
    ></v-progress-linear>

    <div class="position-relative mt-3 mb-3 pb-3">
      <div
        v-for="(item, i) in events"
        :key="i"
      >
        <v-hover
          v-slot="{ hover }"
          open-delay="400"
        >
          <div
            class="audio-event-wrapper"
            :style="getEventPosStyle(item)"
          >
            <!--
              @slot Event marker slot.
            -->
            <slot name="marker">
              <v-icon
                :color="color"
                class="audio-event-marker"
              >mdi-map-marker</v-icon>
            </slot>
            <div
              v-if="hover"
              class="audio-event-hover position-absolute"
            >
              <!--
                @slot Event slot.
                @binding {number} eventIndex Event index.
                @binding {number} event Event position.
              -->
              <slot
                name="event"
                v-bind:eventIndex="i"
                v-bind:event="item"
              >
                <v-card
                  class="p-1 z-index-10"
                  color="grey lighten-4"
                >
                  <v-card-text class="p-1">
                    <div class="font-weight-light audio-event-text">
                      <!--
                        @slot Event item render slot.
                        @binding {number} eventIndex Event index.
                        @binding {number} event Event position.
                      -->
                      <slot
                        name="item"
                        v-bind:eventIndex="i"
                        v-bind:event="item"
                      >{{ item }}</slot>
                    </div>
                  </v-card-text>
                </v-card>
              </slot>
            </div>
          </div>
        </v-hover>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Audio player. Playback can be started and stopped with space key. Right arrow
 * seeks playback towards the end of the track and left arrow towards the start
 * of the track.
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
        },
        /**
         * Audio event positions. Event markers are specified below audio timeline
         * and the parent can customize the event rendering to specific needs.
         */
        events: {
            type: Array,
            required: false,
            default: () => []
        },
        /**
         * Seek increment value when left and right keyboard arrows are pressed.
         */
        fastSeekInc: {
            type: Number,
            required: false,
            default: 5
        },
        /**
         * Activator function for managing multiple player instances. Only one
         * player can listen keyboard events at a time and activations between
         * different instances are handled via this prop. Must return Subject.
         * If prop is defined, then also activeId prop must be set.
         */
        activator: {
            type: Object,
            required: false
        },
        /**
         * Player ID for setting up keyboard events.
         * Must be unique ID within different player instances.
         */
        activeId: {
            type: Number,
            required: false,
            default: 0
        },
        /**
         * Set player as active at start up.
         */
        initActivate: {
            type: Boolean,
            required: false,
            default: false
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
        // Keyboard event handle mapping
        this.cbMap = {
            // Space pressed -> start or stop the playback
            Space: event => {
                event.preventDefault();

                if (this.loaded) {
                    if (this.playing) {
                        this.stop();
                    } else {
                        this.play();
                    }
                }
            },
            // Right arrow pressed -> seek forward
            ArrowRight: () => { this.$refs.audioplayer.currentTime += this.fastSeekInc; },
            // Left arrow pressed -> seek backward
            ArrowLeft: () => { this.$refs.audioplayer.currentTime -= this.fastSeekInc; }
        };

        this.timerId = null;
        this.active = false;
    },
    destroyed() {
        this.deactivate();
    },
    beforeDestroy() {
        clearInterval(this.timerId);
        this.$refs.audioplayer.ontimeupdate = null;
        this.$refs.audioplayer.onloadeddata = null;
    },
    mounted() {
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

        // Multiple player instances are available
        if (this.activeId && this.activator) {
            // Activate this instance
            if (this.initActivate) {
                this.activate();
            }

            // Activatation message received from some player.
            // Deactivate player from receiving keyboard event if the active ID
            // does match the ID of this instance.
            this.activator.asPipe().subscribe(activeId => {
                // Someone else requested control, deactivate
                if (this.activeId !== activeId && this.active) {
                    this.deactivate();

                    if (this.$refs.audioplayer) {
                        this.stop();
                    }

                // Someone requested activation of this instance
                } else if (this.activeId === activeId && !this.active) {
                    this.activate();
                }
            });
        } else {
            this.activate();
        }

        // Regularly update playback position for smooth progress rendering
        this.timerId = setInterval(this.updateplayPosition, 100);
    },
    methods: {
        // Add active player status
        activate() {
            if (!this.active) {
                // Handle keyboard events when key is pressed down
                window.addEventListener('keydown', this.keyDown);
                this.active = true;

                // Send message to other players that this instance is now active
                if (this.activator && this.activeId) {
                    this.activator.send(this.activeId);
                }
            }
        },

        // Remove active player status
        deactivate() {
            if (this.active) {
                this.active = false;
                window.removeEventListener('keydown', this.keyDown);
            }
        },

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
                // Activate keyboard events
                if (!this.active && this.activator && this.activeId) {
                    this.activate();
                }

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
        },

        /**
         * Set event marker position.
         */
        getEventPosStyle(pos) {
            const duration = (pos / this.duration) * 100;
            return `--left: ${duration}%`;
        },

        /**
         * Handle keyboard events.
         */
        keyDown(event) {
            if (this.cbMap[event.code]) {
                this.cbMap[event.code](event);
            }
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

.audio-event-wrapper {
    top: -8px;
    position: absolute;
    width: 100%;
    left: var(--left);

    .audio-event-hover {
        top: 20px;
        .audio-event-text {
            font-size: 16px;
        }
    }
}

.audio-event-marker {
    position: absolute;
    font-size: 24px;
    left: -12px;
    transform: rotate(180deg);
}

.z-index-10 {
    z-index: 10
}
</style>
