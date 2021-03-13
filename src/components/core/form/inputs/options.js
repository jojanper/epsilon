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
    default: ''
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

// Data drop icon tooltip text.
export const dropTitle = {
    type: String,
    required: false,
    default: ''
};

// Input is read only
export const readonly = {
    type: Boolean,
    required: false,
    default: false
};

// Add input clear functionality
export const clearable = {
    type: Boolean,
    required: false,
    default: false
};

// Apply the outlined style to the input.
export const outlined = {
    type: Boolean,
    required: false,
    default: false
};

// Dragging color for file inputs
export const draggingColor = {
    type: String,
    required: false,
    default: '#EE82EE' // violet
};

// Data query function. Must return observable.
export const dataQuery = {
    type: Function,
    required: true
};

// External loading status to component
export const loadingStatus = {
    type: Boolean,
    required: false,
    default: false
};
