/**
 * Common props definitions for form input. Each component is expected to pick up
 * relevant props. Custom props are defined in each component file.
 */

// Form input label
export const label = {
    type: String,
    required: true
};

// Form input name
export const name = {
    type: String,
    required: true
};

// Form input placeholder
export const placeholder = {
    type: String,
    required: true
};

// Form input validation rules
export const rules = {
    type: String,
    required: false,
    default: null
};

// Form input value
export const value = {
    required: true
};

// Form input help
export const help = {
    type: Object,
    required: false,
    default: null
};

// Form input classes
export const classes = {
    type: String,
    required: false,
    default: 'form-input mt-0 pt-0 pb-2'
};

// Form input data array (select list, radio list, etc)
export const data = {
    type: Array,
    required: true
};

// Data selection field from data object.
export const dataKey = {
    type: String,
    required: false,
    default: ''
};
