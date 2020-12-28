<template>
  <ValidationObserver>
    <ValidationProvider ref="provider" v-slot="{ errors }" :name="name" :rules="inputRules">
      <v-text-field
        :class="`remote-input ${classes}`"
        v-model="fieldValue"
        :error-messages="errors"
        :label="label"
        :placeholder="placeholder"
        @click="clicked"
        :readonly="true"
        @input="$emit('input', fieldValue)"
      >
        <input-help v-if="help" slot="append-outer" @form-input-help="inputHelpEvent"></input-help>
        <draal-file-drop
          @fileDrop="onDrop"
          slot="append"
          :title="dropTitle || $t('form.remoteInputDropTitle')"
        ></draal-file-drop>
      </v-text-field>
    </ValidationProvider>

    <!-- Media file duration is available in hidden input -->
    <ValidationProvider name="duration" class="d-none">
      <v-text-field v-model="mediaDuration"></v-text-field>
    </ValidationProvider>

    <!-- File dialog is also hidden -->
    <draal-file-dialog v-model="fileDialog" @file-select="onDrop"></draal-file-dialog>
  </ValidationObserver>
</template>

<script>
import { fileInputMixin } from './fileInputMixin';

/**
 * File input with support for different file validators.
 *
 * @displayName FileOpenInput
 */
export default {
    name: 'FileOpenInput',
    mixins: [fileInputMixin]
};
</script>
