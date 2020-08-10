<template>
  <div class="mt-3 mb-3">
    <v-tabs vertical>
      <v-tab>
        <v-icon left>mdi-identifier</v-icon>
        {{ $t('licenseUtils.uuid') }}
      </v-tab>

      <v-tab-item>
        <v-card flat>
          <v-card-text class="text-left">
            <draal-upload-terminal :description="$t('licenseUtils.uuidText')" :uploadFn="uploadFn"></draal-upload-terminal>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import AudioApi from '@/common/audio_api';
import DraalUploadTerminal from '../../components/terminal/UploadTerminal.vue';

export default {
    name: 'DraalUploadUtils',
    components: {
        DraalUploadTerminal
    },
    data() {
        return {
            uploadFn: AudioApi.uploadFile.bind(AudioApi)
        };
    }
};
</script>
