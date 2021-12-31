<template>
  <div>
    <div class="text-left mb-4 text-lg-subtitle-1">
      Example form with various inputs
    </div>
    <draal-form-generator
      :schema="schema"
      v-model="formData"
      v-on:submit="submit"
      :options="options"
    ></draal-form-generator>
  </div>
</template>

<script>
import { configuratorMixin } from './mixin';

import {
    initDataFromSchema, LOCAL_AUDIOFILE_INPUT, FILE_DATA_QUERY_INPUT,
    SELECT_INPUT, CHECKBOX_INPUT, RADIO_INPUT, TEXT_INPUT, FILE_OPEN_INPUT
} from '@/components/core/form/input';
import DraalFormGenerator from '@/components/core/form/Form.vue';

const SCHEMA = [
    {
        type: FILE_OPEN_INPUT,
        mode: 'filesystem',
        storeId: 'bin',
        placeholder: 'Enter binary name',
        label: 'Binary',
        name: 'bin',
        rules: 'required',
        clearable: true,
        help: {
            title: 'Binary name',
            body: 'Binary used for execution.'
        }
    },
    {
        type: LOCAL_AUDIOFILE_INPUT,
        placeholder: 'Enter audio file name',
        label: 'WAVE file',
        name: 'audio',
        wavAudioRule: true,
        rules: 'required|fileext:.wav',
        fileExt: '.wav',
        storeId: 'inputWav',
        clearable: true,
        help: {
            title: 'Audio file',
            body: 'Audio as WAVE file.'
        }
    },
    {
        type: FILE_DATA_QUERY_INPUT,
        mode: 'filesystem',
        fileExt: '.license',
        storeId: 'license',
        placeholder: 'Enter ID file',
        label: 'ID file',
        name: 'fileid',
        rules: 'required|fileext:.license',
        selectPlaceholder: 'Select ID',
        selectLabel: 'Select ID',
        customPlaceholder: 'Manually set the ID',
        customLabel: 'Enter your ID',
        dataKey: 'uuid',
        selectKey: 'uuid',
        queryRule: 'filequery',
        clearable: true,
        help: {
            title: 'ID file',
            body: 'Target ID selection.'
        }
    },
    {
        type: TEXT_INPUT,
        placeholder: 'Enter notes',
        label: 'Comments',
        name: 'comments2',
        rules: 'required',
        dataRelTarget: ['device'],
        dataRelTargetHandler: data => (data === 1 ? 'foo.txt' : 'foo.mp4')
    },
    {
        type: TEXT_INPUT,
        placeholder: 'Enter notes 3',
        label: 'Comments 3',
        name: 'comments3',
        rules: 'required',
        defaultValue: 'I am default value'
    },
    {
        type: RADIO_INPUT,
        name: 'device',
        label: 'Radio selection',
        placeholder: '',
        data: [
            {
                label: 'Option 1',
                default: true
            },
            {
                label: 'Option 2'
            }
        ],
        help: {
            title: 'Radio options',
            body: 'Option 1 does this and Option 2 does that'
        },
        rules: 'required',
        outlined: true
    },
    {
        type: SELECT_INPUT,
        placeholder: 'Select bitrate in kbps',
        label: 'Bitrate (kbps)',
        name: 'bitrate',
        rules: 'required',
        multiple: true,
        clearable: true,
        outlined: true,
        data: [192, 256, 512]
    },
    {
        type: CHECKBOX_INPUT,
        placeholder: 'Windscreen',
        label: 'Windscreen',
        name: 'windscreen',
        help: {
            title: 'Audio Windscreen',
            body: 'Audio Windscreen lets users capture crystal-clear audio quality on '
                + 'their smartphone in less than ideal conditions. Sophisticated wind '
                + 'detection algorithms identify and automatically adjust suppression '
                + 'processing to suit the wind noise conditions. Clearer audio even when '
                + 'conditions aren’t.'
        },
        rules: 'required',
        outlined: true,
        defaultValue: true
    }
];

export default {
    name: 'DraalExampleForm1',
    mixins: [configuratorMixin],
    components: {
        DraalFormGenerator
    },
    data() {
        const schema = [...SCHEMA];
        this.setSchemaCallbacks(schema);

        return {
            schema,
            formData: initDataFromSchema(schema)
        };
    }
};
</script>
