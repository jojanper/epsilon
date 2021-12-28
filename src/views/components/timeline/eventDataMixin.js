import { EventData } from './eventData';

export const eventDataMixin = {
    props: {
        /**
         * Event data to show.
         */
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            event: new EventData(this.data),
            onOffDisplay: ['Off', 'On']
        };
    },
    methods: {
        renderAzimuth() {
            return `transform: rotate(${-this.event.data.angle}deg)`;
        },

        getOnOffValue() {
            return this.event.data.value ? this.onOffDisplay[1] : this.onOffDisplay[0];
        }
    }
};
