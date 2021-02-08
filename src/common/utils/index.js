export function isElectron() {
    return process.env.VUE_APP_IS_ELECTRON === 'true';
}

export function getTimestamp(prefix) {
    const now = new Date();

    const year = now.getFullYear();
    const month = `${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    const day = `${now.getDay().toString().padStart(2, '0')}`;
    const hours = `${now.getHours().toString().padStart(2, '0')}`;
    const mins = `${now.getMinutes().toString().padStart(2, '0')}`;
    const secs = `${now.getSeconds().toString().padStart(2, '0')}`;

    return `${prefix}-${year}-${month}-${day}--${hours}-${mins}-${secs}`;
}

/**
 * Get filename from HTTP Content-Disposition reponse.
 *
 * @param {*} disposition Content disposition response header.
 * @returns Filename, null if no name found
 */
export function getContentDispositionFilename(disposition) {
    if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
            return matches[1].replace(/['"]/g, '');
        }
    }

    return null;
}

/**
 * Find data item from object that matches the specified target.
 *
 * @param {*} object Data object.
 * @param {*} target Target data field to find.
 * @param {*} prop Property field from data object for target matching.
 * @returns Data item on success, null on failure
 */
export function getDataField(object, target, prop) {
    for (let i = 0; i < object.length; i++) {
        const fieldName = object[i][prop];
        if (fieldName === target) {
            return object[i];
        }
    }

    return null;
}

/**
 * Reset data using schema definition as guidance.
 *
 * @param {*} schema Data schema.
 * @param {*} data Data to reset.
 * @param {*} prefix Name prefix for reset function.
 * @param {*} resetCb Reset function.
 */
export function resetDataBySchema(schema, data, prefix, resetCb) {
    /* eslint-disable no-param-reassign */
    for (let i = 0; i < schema.length; i++) {
        const fieldName = schema[i].name;
        if (schema[i].schema) {
            resetDataBySchema(schema[i].schema, data[fieldName], `${prefix}${fieldName}.`, resetCb);
        } else if (Array.isArray(data[fieldName])) {
            data[fieldName].splice(0, data[fieldName].length);
        } else {
            data[fieldName] = resetCb(`${prefix}${fieldName}`);
        }
    }
    /* eslint-enable no-param-reassign */
}

/**
 * Determine imported child slot name(s) and component slot name(s) from specified JSON
 * schema. The slots can then be used in the template to expose child slots as
 * component slots.
 *
 * @param {*} inputSlots Array receiving the slot names.
 * @param {*} schema JSON schema.
 * @param {*} prefix Name prefix used for slot names.
 * @param {*} childPrefix Prefix name used for child slot name.
 * @param {*} componentPrefix Prefix names used for component slot name.
 */
export function slotMapping(inputSlots, schema, prefix, childPrefix, componentPrefix) {
    schema.forEach(entry => {
        if (entry.schema && entry.schema.length) {
            slotMapping(inputSlots, entry.schema,
                `${prefix}${entry.name}.`, // Extend the name prefix
                childPrefix, componentPrefix);
        } else {
            const slots = entry.customSlots || [];
            slots.forEach(column => inputSlots.push({
                // Child slot name
                childSlot: `${childPrefix}.${prefix}${entry.name}.${column}`,

                // Component slot name
                componentSlot: `${componentPrefix}.${prefix}${entry.name}.${column}`
            }));
        }
    });
}

/**
 * Read file or blob and return parsed JSON object on success.
 *
 * @param {*} file File or Blob.
 * @returns Promise that resolves to parsed JSON object.
 */
export function readJson(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
            try {
                resolve(JSON.parse(event.target.result));
            } catch (e) {
                reject(e);
            }
        };

        reader.onerror = reject;
        reader.readAsText(file);
    });
}

/**
 * Serialize object to JSON.
 *
 * @param {*} data Object for JSON serialization.
 * @param {Array} keys Optional data fields to include for serialization.
 * @returns Serialized JSON data.
 */
export function serializeObject(data, keys = []) {
    const target = Array.isArray(data) ? data : [data];
    let data2Serialize = keys.length ? [] : target;

    if (keys.length) {
        data.forEach(item => {
            const obj = {};
            keys.forEach(key => {
                obj[key] = item[key];
            });

            data2Serialize.push(obj);
        });

        if (!Array.isArray(data)) {
            [data2Serialize] = data2Serialize;
        }
    }

    return JSON.stringify(data2Serialize, null, 4);
}

/**
 * Get URL object from JSON.
 *
 * @param {*} data JSON data.
 * @returns URL object.
 */
export function urlObject4Json(json) {
    const blob = new Blob([json], { type: 'application/json' });
    return URL.createObjectURL(blob);
}

export const timer = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export * from './ansicolors';
export * from './media';
export * from './rxjs';
export * from './debounce';
