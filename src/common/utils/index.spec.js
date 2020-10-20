/* eslint-disable no-restricted-syntax */
import { getTimestamp, ansiColors, getContentDispositionFilename } from './index';

describe('utils', () => {
    it('getTimestamp', () => {
        const ts = getTimestamp('abc');
        expect(ts.startsWith('abc')).toBeTruthy();

        // Verify timestamp format
        const tsPostfix = ts.replace('abc-', '');
        const parts = tsPostfix.split('--');
        expect(parts[0].split('-').length).toEqual(3);
        expect(parts[1].split('-').length).toEqual(3);
    });

    it('ansiColors', () => {
        let str;

        const fgColors = {
            30: 'black',
            31: 'red',
            32: 'green',
            33: 'yellow',
            34: 'blue',
            35: 'purple',
            36: 'cyan',
            37: 'white'
        };

        // Color testing
        const codes = Object.keys(fgColors);
        for (const code of codes) {
            str = `\u001b[${code}mThis is a test\x1b[0m\n`;
            const decoded = ansiColors(str).trim();
            expect(decoded).toEqual(`<span style="color: ${fgColors[code]}">This is a test</span>`);
        }

        // Bold
        str = '\u001b[1mThis is a test\x1b[22m\n';
        expect(ansiColors(str).trim()).toEqual('<b>This is a test</b>');

        // Italics
        str = '\u001b[3mThis is a test\x1b[23m\n';
        expect(ansiColors(str).trim()).toEqual('<i>This is a test</i>');
    });

    it('getContentDispositionFilename', () => {
        expect(getContentDispositionFilename('attachment')).toBeNull();
        expect(getContentDispositionFilename('attachment; filename="name.jpg')).toEqual('name.jpg');
    });
});
