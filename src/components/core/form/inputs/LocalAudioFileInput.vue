<template>
  <ValidationObserver>
    <ValidationProvider
      ref="provider"
      v-slot="{ errors }"
      :name="name"
      :rules="inputRules"
    >
      <v-text-field
        :class="classes"
        v-model="fieldValue"
        :error-messages="loading ? [$t('form.audioInfoQuery')] : errors"
        :label="label"
        :placeholder="placeholder"
        @input="changeEvent"
        v-bind="inputAttrs"
        :loading="loading"
      >
        <input-help
          v-if="help"
          slot="append-outer"
          @form-input-help="inputHelpEvent"
        ></input-help>
      </v-text-field>
    </ValidationProvider>

    <!-- Media file duration is available in hidden input -->
    <ValidationProvider
      name="duration"
      class="d-none"
    >
      <v-text-field v-model="mediaDuration"></v-text-field>
    </ValidationProvider>
  </ValidationObserver>
</template>

<script>
import { fileInputMixin } from './fileInputMixin';
import { dataQuery } from './options';

import { debounce } from '@/common/utils';
import { rules } from '@/components/core/form/rules';

/**
 * Audio file with backend validation.
 *
 * @displayName LocalAudioFileInput
 */
export default {
    name: 'LocalAudioFileInput',
    mixins: [fileInputMixin],
    props: {
        dataQuery
    },
    created() {
        this.changeEvent = debounce(this.getAudioInfo, 400);
    },
    methods: {
        getAudioInfo(value) {
            this.loading = false;
            this.mediaDuration = 0;

            // Make sure file extension matches the expected
            if (value && rules.wavext.validate(value)) {
                this.fieldValueInt = value;
                this.loading = this.draggingColor;

                // Query from backend the audio details
                this.dataQuery(value).subscribe(({ data }) => {
                    this.loading = false;
                    if (data.duration) {
                        // Audio file seems valid
                        this.setMediaDuration({ duration: data.duration });
                    } else {
                        // No duration available, file is not valid
                        this.setMediaError();
                    }
                });
            }
        }
    }
};
</script>
