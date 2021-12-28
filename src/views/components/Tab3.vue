<template>
  <div class="text-left">
    <v-card flat>
      <v-card-text class="text-xl-h5">
        Dialog is opened when icon is clicked
      </v-card-text>
    </v-card>
    <draal-icon-dialog
      :tooltip-config="{ 'icon-size': 'large' }"
      tooltip-text="Icon tooltip"
      dialog-title="This is title"
      dialog-content="This is content"
    ></draal-icon-dialog>
  </div>
</template>

<script>
import DraalIconDialog from '@/components/core/utils/IconDialog.vue';

export default {
    name: 'DraalAppConfiguratorTab3',
    components: {
        DraalIconDialog
    }
};
</script>
