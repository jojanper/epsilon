// Text input
export const TEXT_INPUT = 'text';

// Select input
export const SELECT_INPUT = 'select';

// Checkbox input
export const CHECKBOX_INPUT = 'checkbox';

// Switch input
export const SWITCH_INPUT = 'switch';

// Radio input
export const RADIO_INPUT = 'radio';

// Wheel input
export const WHEEL_INPUT = 'wheel';

// File open input
export const FILE_OPEN_INPUT = 'file-open';

// Remove file save input
export const REMOTE_FILE_SAVE_INPUT = 'remote-file-save';

// File data query and selection input
export const FILE_DATA_QUERY_INPUT = 'file-data-query';

// Local audio file data with backend validation
export const LOCAL_AUDIOFILE_INPUT = 'local-audio-file';

// Timeline input
export const TIMELINE_INPUT = 'timeline';

// Form group wrapper (inputs are grouped into some grid element; row etc)
export const GROUP_INPUT_WRAPPER = 'group-input';

// Input type mappings into component names
const INPUT_TYPES = {};
INPUT_TYPES[TEXT_INPUT] = 'TextInput';
INPUT_TYPES[SELECT_INPUT] = 'SelectInput';
INPUT_TYPES[CHECKBOX_INPUT] = 'CheckboxInput';
INPUT_TYPES[SWITCH_INPUT] = 'SwitchInput';
INPUT_TYPES[RADIO_INPUT] = 'RadioInput';
INPUT_TYPES[WHEEL_INPUT] = 'WheelInput';
INPUT_TYPES[FILE_OPEN_INPUT] = 'FileOpenInput';
INPUT_TYPES[LOCAL_AUDIOFILE_INPUT] = 'LocalAudioFileInput';
INPUT_TYPES[REMOTE_FILE_SAVE_INPUT] = 'RemoteFileSaveInput';
INPUT_TYPES[FILE_DATA_QUERY_INPUT] = 'FileQueryInput';
INPUT_TYPES[TIMELINE_INPUT] = 'TimelineInput';
INPUT_TYPES[GROUP_INPUT_WRAPPER] = 'GroupInput';

/**
 * Map schema input name into corresponding component name.
 *
 * @param {*} inType Input type name (typically in the schema).
 * @returns Component name.
 */
export function getFormInputName(inType) {
    return INPUT_TYPES[inType];
}

/**
 * Initializes data object for form handling based on specified input schema.
 *
 * @param {*} schema Form schema.
 * @returns Form data object.
 */
export function initDataFromSchema(schema) {
    const data = {};

    schema.forEach(item => {
        if (item.type === GROUP_INPUT_WRAPPER) {
            data[item.name] = initDataFromSchema(item.schema);
        } else if (item.type === TIMELINE_INPUT) {
            data[item.name] = [];
        } else {
            data[item.name] = null;
        }
    });

    return data;
}
