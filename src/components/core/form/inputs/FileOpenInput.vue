<template>
  <ValidationObserver>
    <ValidationProvider
      ref="provider"
      v-slot="{ errors }"
      :name="name"
      :rules="inputRules"
    >
      <v-text-field
        v-if="mode === RENDER_MODES.file"
        :class="`file-input ${classes}`"
        v-model="fieldValue"
        :error-messages="errors"
        :label="label"
        :placeholder="placeholder"
        @click="clicked"
        :readonly="true"
        @input="inputChangeEvent"
        v-bind="inputAttrs"
        @dragenter="setDragging(true)"
        @dragend="setDragging(false)"
        @dragleave="setDragging(false)"
        @dragover.prevent
        @drop="drop"
        :loading="loading"
      >
        <v-progress-linear
          v-if="dragging"
          slot="progress"
          :value="100"
          :color="draggingColor"
          absolute
          height="5"
        ></v-progress-linear>

        <input-help
          v-if="help"
          slot="append-outer"
          @form-input-help="inputHelpEvent"
        ></input-help>
        <draal-file-drop
          @fileDrop="onDrop"
          slot="append"
          :title="dropTitle || $t('form.remoteInputDropTitle')"
        >
        </draal-file-drop>
      </v-text-field>

      <v-autocomplete
        ref="autocomplete"
        v-if="mode === RENDER_MODES.filesystem"
        :class="classes"
        v-model="fieldValue"
        :error-messages="loading && inputRules ? [$t('form.fileInfoQuery')] : errors"
        :items="items"
        :search-input.sync="search"
        :label="label"
        :placeholder="placeholder"
        @input="inputChangeEvent"
        @paste="onPaste"
        v-bind="fileInputAttrs"
        :loading="loading"
        flat
        hide-no-data
      >
        <slot
          slot="append-outer"
          :name="getComponentSlotName('', 'append-outer')"
        >
          <input-help
            v-if="help"
            @form-input-help="inputHelpEvent"
          ></input-help>
        </slot>
        <slot
          slot="prepend"
          :name="getComponentSlotName('', 'prepend')"
        ></slot>
      </v-autocomplete>
    </ValidationProvider>

    <!-- Media file duration is available in hidden input -->
    <ValidationProvider
      name="duration"
      class="d-none"
    >
      <v-text-field v-model="mediaDuration"></v-text-field>
    </ValidationProvider>

    <!-- Media file duration is checked using this element -->
    <audio
      v-if="wavAudioRule"
      :src="fileSrc"
      ref="audio"
    ></audio>

    <!-- File dialog is also hidden -->
    <draal-file-dialog
      v-model="fileDialog"
      @file-select="onDrop"
    >
    </draal-file-dialog>
  </ValidationObserver>
</template>

<script>
import { fileInputMixin } from './fileInputMixin';
import { fileListingMixin } from './fileListingMixin';

/**
 * File input with support for different file validators.
 *
 * @displayName FileOpenInput
 */
export default {
    name: 'FileOpenInput',
    mixins: [fileInputMixin, fileListingMixin]
};
</script>
