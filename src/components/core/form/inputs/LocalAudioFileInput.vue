<template>
  <ValidationObserver>
    <ValidationProvider
      ref="provider"
      v-slot="{ errors }"
      :name="name"
      :rules="inputRules"
    >
      <v-autocomplete
        ref="autocomplete"
        :class="classes"
        v-model="fieldValue"
        :error-messages="loading ? [$t('form.fileInfoQuery')] : errors"
        :items="items"
        :search-input.sync="search"
        :label="label"
        :placeholder="placeholder"
        @input="changeEvent"
        @paste="onPaste"
        v-bind="inputAttrs"
        :loading="loading"
        flat
        hide-no-data
        cache-items
      >
        <input-help
          v-if="help"
          slot="append-outer"
          @form-input-help="inputHelpEvent"
        ></input-help>
      </v-autocomplete>
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
import { fileListingMixin } from './fileListingMixin';
import { dataQuery } from './options';

import { debounce } from '@/common/utils';

/**
 * Audio file with backend validation.
 *
 * @displayName LocalAudioFileInput
 */
export default {
    name: 'LocalAudioFileInput',
    mixins: [fileInputMixin, fileListingMixin],
    props: {
        dataQuery
    },
    created() {
        // Debounce change event to reduce backend calls and smooth the UI behaviour
        this.changeEvent = debounce(this.getAudioInfo, 100);
    },
    methods: {
        // Get file details if input is valid
        getAudioInfo(value) {
            this.disableLoading();
            this.mediaDuration = 0;

            // Make sure file extension matches the expected
            if (this.validExtension(value)) {
                this.fieldValueInt = value;
                this.enableLoading(true);

                // Query the audio details
                this.dataQuery(value).subscribe(({ data }) => {
                    this.disableLoading();
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
