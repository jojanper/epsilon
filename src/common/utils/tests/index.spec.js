/* eslint-disable no-restricted-syntax */
import {
    getTimestamp, ansiColors, getContentDispositionFilename,
    getDataField, resetDataBySchema, slotMapping, readJson,
    serializeObject, clone, isObject
} from '../index';

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

    it('getDataField', () => {
        const data = [
            {
                name: 'first',
                data: 'b'
            },
            {
                name: 'second',
                data: 'c'
            }
        ];

        const ret = getDataField(data, 'first', 'name');
        expect(ret.name).toEqual('first');
        expect(ret.data).toEqual('b');
        expect(getDataField(data, 'third', 'name')).toBeNull();
    });

    const SCHEMA = [
        {
            type: 'text',
            name: 'a'
        },
        {
            type: 'text',
            name: 'b'
        },
        {
            type: 'group',
            name: 'group',
            schema: [
                {
                    type: 'radio',
                    name: 'c',
                    customSlots: ['dataR']
                }
            ]
        },
        {
            type: 'timeline',
            name: 't',
            customSlots: ['dataT']
        }
    ];

    it('resetDataBySchema', () => {
        const data = {
            a: 'a',
            b: 'b',
            group: {
                c: 'c'
            },
            t: [1, 2, 3]
        };

        const resetNames = [];

        resetDataBySchema(SCHEMA, data, '', name => {
            resetNames.push(name);
            return undefined;
        });

        expect(resetNames).toEqual(['a', 'b', 'group.c']);
        expect(data.a).toEqual(undefined);
        expect(data.b).toEqual(undefined);
        expect(data.group.c).toEqual(undefined);
        expect(data.t.length).toEqual(0);
    });

    it('slotMapping', () => {
        const slots = [];
        slotMapping(slots, SCHEMA, '', 'input', 'form');

        expect(slots).toEqual([
            {
                childSlot: 'input.group.c.dataR',
                componentSlot: 'form.group.c.dataR'
            },
            {
                childSlot: 'input.t.dataT',
                componentSlot: 'form.t.dataT'
            }
        ]);
    });

    it('readJson', async done => {
        const json = { a: 'foo', b: [1, 2, 3] };
        const blob = new Blob([JSON.stringify(json, null, 4)], { type: 'application/json' });

        // Reading JSON from file/blob succeeds
        const data = await readJson(blob);
        expect(data).toEqual(json);

        const blob2 = new Blob(['Text here'], { type: 'plain/text' });

        // Reading non-JSON file/blob fails
        const data2 = await readJson(blob2).catch(err => err);
        expect(data2.message).toEqual('Unexpected token T in JSON at position 0');

        done();
    });

    it('serializeObject', () => {
        const object = { a: 'foo', b: [1, 2, 3], c: 'c' };

        let data = serializeObject(object);
        expect(JSON.parse(data)).toEqual(object);

        data = serializeObject(object, ['a']);
        expect(JSON.parse(data)).toEqual({ a: 'foo' });

        data = serializeObject([object], ['a']);
        expect(JSON.parse(data)).toEqual([{ a: 'foo' }]);
    });

    it('clone', () => {
        let a = 'foo';
        const b = clone(a);

        expect(b).toEqual('foo');

        a = 'foo';
        expect(b).toEqual('foo');

        const c = { a: 'foo', b: [1, 2, 3], c: 'c' };
        const d = clone(c);

        c.b[2] = 300;
        expect(d).toEqual({ a: 'foo', b: [1, 2, 3], c: 'c' });
    });

    it('isObject', () => {
        expect(isObject({})).toBeTruthy();
        expect(isObject(1)).toBeFalsy();
        expect(isObject('string')).toBeFalsy();
    });
});
