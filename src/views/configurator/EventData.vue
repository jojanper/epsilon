<template>
  <div>
    <div v-if="event.isDirection" class="row">
      <div class="col-md text-left">
        Direction:
        <v-icon :style="renderAzimuth()">mdi-arrow-up</v-icon>
        {{ event.data.angle }}
      </div>

      <div class="col-md text-left">Zoom: {{ event.data.zoom }}%</div>
    </div>

    <div v-if="event.isOnOff" v-text="getOnOffValue()"></div>
  </div>
</template>

<script>
import { eventDataMixin } from './eventDataMixin';

export default {
    mixins: [eventDataMixin]
};
</script>
