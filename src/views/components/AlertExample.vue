<template>
  <div class="mt-4">
    <v-flex
      xs12
      sm34
      text-xs-center
    >
      <v-btn
        class="mr-2"
        color="primary"
        v-on:click="addAlert('Success')"
      >Add success alert</v-btn>
      <v-btn
        class="mr-2"
        color="info"
        v-on:click="addAlert('Info')"
      >Add info alert</v-btn>
      <v-btn
        class="mr-2"
        color="warning"
        v-on:click="addAlert('Warning')"
      >Add warning alert</v-btn>
      <v-btn
        color="error"
        v-on:click="addAlert('Error')"
      >Add error alert</v-btn>
    </v-flex>
  </div>
</template>

<script>
import { notificationActions } from '@/store/helpers';
import { NotificationMessage } from '@/common/models';

export default {
    name: 'DraalExampleAlerts',
    methods: {
        ...notificationActions,

        addAlert(mode) {
            const timeout = Math.floor(Math.random() * 5000);
            const msg = `${mode} notification. Timeout ${timeout}msec`;
            this.addNotification(NotificationMessage[`create${mode}`](msg, { timeout }));
        }
    }
};
</script>
