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

export const timer = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export * from './ansicolors';
export * from './media';
export * from './rxjs';
