export const SCHEMA = [
    {
        type: 'text',
        placeholder: 'Enter device UUID',
        label: 'Device ID',
        name: 'device',
        rules: 'required',
        help: {
            title: 'Device UUID',
            body: 'UUID in the form of xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.'
        }
    },
    {
        type: 'group-input',
        name: 'row',
        renderMode: 'row',
        schema: [
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
            }
        ]
    },
    {
        type: 'select',
        placeholder: 'Select bitrate in kbps',
        label: 'Bitrate (kbps)',
        name: 'bitrate',
        rules: 'required',
        selectlist: [192, 256, 512]
    },
    {
        type: 'file-open',
        placeholder: 'Click to select WAV input file or drop file to icon',
        dropTitle: 'Drop input WAV here',
        label: 'Input WAV file for recording',
        name: 'input',
        rules: 'required',
        duration: true
    },
    {
        type: 'remote-file-save',
        placeholder: 'Click to select location of the output MP4 file or drag file to icon',
        label: 'Recording output MP4 file',
        name: 'output',
        rules: 'required'
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
        queryRule: 'filequery'
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
        }
    },
    {
        type: 'timeline',
        name: 'focusTimeline',
        label: 'Focus events timeline',
        maxZoom: 15,
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
        dataRelTarget: ['input']
    }
];
