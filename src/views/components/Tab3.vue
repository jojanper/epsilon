<template>
  <div>
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
