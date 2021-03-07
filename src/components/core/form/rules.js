// Custom WAV audio file validation. Duration must be available and file ends with .wav
const wavaudio = {
    params: ['target'],
    validate(value, { target }) {
        return target > 0 && value.endsWith('.wav');
    }
};

// Custom file extension validation
const fileext = {
    params: ['ext'],
    validate(value, { ext }) {
        return value.endsWith(ext);
    }
};

// Custom validator for file input data query
// Input consists of 3 elements
// - File
// - Selection list determined from the file (content etc)
// - Optional text input for manually inputing the value (and overriding the select list values)
const filequery = {
    params: ['selected', 'custom'],
    validate(value, { selected, custom }) {
        // File exists, selected data exists and it is not equesting manual input
        if (value && selected && !selected.custom) {
            return true;
        }

        // File exists, selected data exists and it is requesting manual input
        if (value && selected && selected.custom === true) {
            // Manual input exists
            if (custom && custom.length > 0) {
                return true;
            }
        }

        // None of the above
        return false;
    }
};

export const rules = {
    wavaudio,
    filequery,
    fileext
};
