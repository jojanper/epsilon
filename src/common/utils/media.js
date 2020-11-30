/**
 * Get duration of specified media file.
 *
 * @param {*} file Media file.
 * @param {*} successCb Success callback.
 * @param {*} errorCb Error callback.
 */
export function getMediaDuration(file, successCb, errorCb) {
    const reader = new FileReader();

    // When the file has been succesfully read
    reader.onload = event => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(event.target.result).then(successCb).catch(errorCb);
    };

    reader.readAsArrayBuffer(file);
}
