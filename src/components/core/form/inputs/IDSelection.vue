<template>
  <file-query-select-input
    v-bind="$props"
    :dataQuery="dataQuery"
    @input="data => $emit('input', data)"
    queryRule="filequery"
    data-key="uuid"
  ></file-query-select-input>
</template>

<script>
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import FileQuerySelectInput from './FileQuerySelectInput.vue';

/**
 *
 * @displayName DraalIDSelectionInput
 */
export default {
    name: 'DraalIDSelectionInput',
    components: {
        FileQuerySelectInput
    },
    props: [
        'placeholder',
        'label',
        'name',
        'value',
        'rules',
        'help',
        'dropTitle',
        'selectPlaceholder',
        'selectLabel',
        'customPlaceholder',
        'customLabel'
    ],
    methods: {
        dataQuery(files) {
            console.log(files);

            return of([
                { uuid: 'UUID 1' },
                { uuid: 'UUID 2' },
                { uuid: 'UUID 3' },
                { uuid: 'UUID 4' },
                { uuid: 'UUID 5' },
                { uuid: 'Set your own ID', custom: true }
            ]).pipe(delay(2500));
        }
    }
};
</script>
