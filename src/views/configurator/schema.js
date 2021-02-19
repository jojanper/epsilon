// Timeline table definition
const HEADERS = [
    {
        text: 'Event position',
        align: 'left',
        filterable: false,
        sortable: false,
        value: 'position'
    },
    {
        text: 'Direction',
        value: 'angleDir',
        sortable: false,
        filterable: false
    },
    {
        text: 'Angle',
        value: 'angle',
        sortable: false,
        filterable: false
    },
    {
        text: 'Zoom %',
        value: 'zoom',
        sortable: false,
        filterable: false
    }
];

export const SCHEMA = [
    {
        type: 'text',
        placeholder: 'Enter device UUID',
        label: 'Device ID',
        name: 'device',
        rules: 'required',
        clearable: true,
        outlined2: true,
        help: {
            title: 'Device UUID',
            body: 'UUID in the form of xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.'
        }
    },
    {
        type: 'group-input',
        name: 'row',
        renderMode: 'row',
        dividerStart: {
            label: 'Group input',
            class: 'w-75 mb-10'
        },
        dividerEnd: {
            label: 'Group input end',
            class: 'w-75 mb-10'
        },
        schema: [
            {
                type: 'timeline',
                name: 'focusTimeline2',
                label: 'Timeline',
                placeholder: '',
                maxZoom: 15,
                timelineWidths: [
                    {
                        width: 15,
                        title: 'Timeline 15sec'
                    }
                ],
                dataRelTarget: ['input'],
                customSlots: ['angleDir', 'edit-dialog'],
                tableConfig: {
                    // Custom rendering via template slot is provided for this data item
                    customColumns: ['angleDir'],
                    headers: HEADERS
                },
                accessMethods: {
                    new() {
                        return {
                            angle: 0,
                            zoom: 0
                        };
                    },

                    save(source, data) {
                        /* eslint-disable no-param-reassign */
                        source.angle = data.angle;
                        source.zoom = data.zoom;
                        /* eslint-enable no-param-reassign */
                    }
                }
            },
            {
                type: 'text',
                placeholder: 'Enter device UUID 1',
                label: 'Device ID',
                name: 'device1',
                rules: 'required',
                help: {
                    title: 'Device UUID 1',
                    body: 'UUID in the form of xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.'
                },
                dataRelTarget: ['row.device2']
            },
            {
                type: 'text',
                placeholder: 'Enter device UUID 2',
                label: 'Device ID',
                name: 'device2',
                rules: 'required',
                help: {
                    title: 'Device UUID 2',
                    body: 'UUID in the form of xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.'
                }
            },
            {
                type: 'checkbox',
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
                rules: 'required'
            },
            {
                type: 'checkbox',
                placeholder: 'Windscreen 2',
                label: 'Windscreen',
                name: 'windscreen2',
                help: {
                    title: 'Audio Windscreen',
                    body: 'Audio Windscreen lets users capture crystal-clear audio quality on '
                        + 'their smartphone in less than ideal conditions. Sophisticated wind '
                        + 'detection algorithms identify and automatically adjust suppression '
                        + 'processing to suit the wind noise conditions. Clearer audio even when '
                        + 'conditions aren’t.'
                },
                rules: 'required'
            }
        ]
    },
    {
        type: 'select',
        placeholder: 'Select bitrate in kbps',
        label: 'Bitrate (kbps)',
        name: 'bitrate',
        rules: 'required',
        clearable: true,
        outlined: true,
        data: [192, 256, 512]
    },
    {
        type: 'file-open',
        placeholder: 'Click to select WAV input file or drop file to icon',
        dropTitle: 'Drop input WAV here',
        label: 'Input WAV file for recording',
        name: 'input',
        rules: 'required',
        wavAudioRule: true,
        clearable: true,
        outlined: true,
        loadingColor: 'pink'
    },
    {
        type: 'remote-file-save',
        placeholder: 'Click to select location of the output MP4 file or drag file to icon',
        label: 'Recording output MP4 file',
        name: 'output2',
        rules: 'required',
        clearable: true,
        outlined: true
    },
    {
        type: 'file-data-query',
        placeholder: 'Click to select the file or drag file to icon',
        label: 'ID file',
        name: 'id',
        rules: 'required',
        selectPlaceholder: 'Select ID',
        selectLabel: 'Select ID',
        customPlaceholder: 'Manually set the ID',
        customLabel: 'Enter your ID',
        dataKey: 'uuid',
        selectKey: 'uuid',
        queryRule: 'filequery',
        dividerEnd2: {
            label: 'ID file end',
            class: 'w-50 mb-10'
        },
        clearable2: true,
        outlined2: true
    },
    {
        type: 'text',
        placeholder: 'Enter notes',
        label: 'Comments',
        name: 'comments',
        rules: 'required',
        clearable2: true,
        outlined2: true
    },
    {
        type: 'file-open',
        placeholder: 'Click to select location of the JSON file or drag file to icon',
        label: 'JSON file',
        name: 'output',
        rules: 'required|jsonfile',
        fileObject: true,
        clearable2: true,
        outlined2: true
    },
    {
        type: 'checkbox',
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
        dividerStart: {
            label: 'Windscreen',
            class: 'w-50 mb-8'
        },
        dividerEnd2: {
            label: 'Windscreen',
            class: '',
            style: 'top: -25px'
        },
        outlined: true
    },
    {
        type: 'text',
        placeholder: 'Enter notes',
        label: 'Comments',
        name: 'comments2',
        rules: 'required'
    },
    {
        type: 'radio',
        name: 'radio',
        label: 'Radio selection',
        placeholder: '',
        data: [
            {
                label: 'Option 1'
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
        type: 'text',
        placeholder: 'Enter notes',
        label: 'Comments',
        name: 'comments2',
        rules: 'required'
    },
    {
        type: 'timeline',
        name: 'focusTimeline',
        label: 'Focus events timeline',
        placeholder: '',
        maxZoom: 15,
        outlined: true,
        help: {
            title: 'Timeline info',
            body: 'Timeline events can be created'
        },
        timelineWidths: [
            {
                width: 15,
                title: 'Timeline 15sec'
            },
            {
                width: 30,
                title: 'Timeline 30sec'
            },
            {
                width: 60,
                title: 'Timeline 60sec'
            },
            {
                width: 180,
                title: 'Timeline 180sec'
            }
        ],
        dataRelTarget: ['input'],
        customSlots: ['angleDir', 'toolbar-left', 'toolbar-right', 'toolbar-right.add'],
        tableConfig: {
            // Custom rendering via template slot is provided for this data item
            customColumns: ['angleDir'],
            headers: [...HEADERS, {
                text: 'Value',
                align: 'left',
                filterable: false,
                sortable: false,
                value: 'value'
            }],
            actions: ['edit', 'delete'],
            actionsConfig: {
                name: 'Actions'
            }
        },
        accessMethods: {
            new(type) {
                return type === 'type-2' ? { value: 3 } : { angle: 0, zoom: 0 };
            },

            save(source, data) {
                /* eslint-disable no-param-reassign */
                source.angle = data.angle;
                source.zoom = data.zoom;
                /* eslint-enable no-param-reassign */
            }
        }
    }
];
