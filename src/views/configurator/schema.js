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
        fieldType: 'RemoteFileOpenInput',
        placeholder: 'Click to select WAV input file or drop file to icon',
        dropTitle: 'Drop input WAV here',
        label: 'Input WAV file for recording',
        name: 'input',
        rules: 'required'
    },
    {
        fieldType: 'RemoteFileSaveInput',
        placeholder: 'Click to select location of the output MP4 file or drag file to icon',
        label: 'Recording output MP4 file',
        name: 'output',
        rules: 'required'
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
                width: 69,
                title: 'Timeline 60sec'
            },
            {
                width: 180,
                title: 'Timeline 180sec'
            }
        ]
    }
];
