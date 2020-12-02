export const SCHEMA = [
    {
        fieldType: 'TextInput',
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
        fieldType: 'SelectInput',
        placeholder: 'Select bitrate in kbps',
        label: 'Bitrate (kbps)',
        name: 'bitrate',
        rules: 'required',
        selectlist: [192, 256, 512]
    },
    {
        fieldType: 'FileOpenInput',
        placeholder: 'Click to select WAV input file or drop file to icon',
        dropTitle: 'Drop input WAV here',
        label: 'Input WAV file for recording',
        name: 'input',
        rules: 'required',
        duration: true
    },
    {
        fieldType: 'RemoteFileSaveInput',
        placeholder: 'Click to select location of the output MP4 file or drag file to icon',
        label: 'Recording output MP4 file',
        name: 'output',
        rules: 'required'
    },
    {
        fieldType: 'FileQueryInput',
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
        fieldType: 'CheckboxInput',
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
        fieldType: 'FocusTimeline',
        name: 'focusTimeline',
        label: 'Focus events timeline',
        maxZoom: 10,
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
        ]
    }
];
