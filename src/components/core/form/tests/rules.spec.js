import { rules } from '../rules';

describe('Form input rules', () => {
    let result;

    it('wavaudio', () => {
        const rule = rules.wavaudio;

        result = rule.validate('foo.txt', { target: 10 });
        expect(result).toEqual(false);

        result = rule.validate('foo.wav', { target: 10 });
        expect(result).toEqual(true);
    });

    it('fileext', () => {
        const rule = rules.fileext;

        result = rule.validate('foo.txt', { ext: '.mp4' });
        expect(result).toEqual(false);

        result = rule.validate('foo.txt', { ext: '.txt' });
        expect(result).toEqual(true);
    });

    it('filequery', () => {
        const rule = rules.filequery;
        const value = {};

        // Value is available and selected data exists and does not request custom value
        result = rule.validate(value, { selected: {} });
        expect(result).toEqual(true);

        // Only value is available
        result = rule.validate(value, {});
        expect(result).toEqual(false);

        // Custom input is requested but not present
        result = rule.validate(value, { selected: { custom: true } });
        expect(result).toEqual(false);

        // Custom input is requested but its value is null
        result = rule.validate(value, { selected: { custom: true }, custom: null });
        expect(result).toEqual(false);

        // Custom input is requested but its does not have value
        result = rule.validate(value, { selected: { custom: true }, custom: '' });
        expect(result).toEqual(false);

        // Custom input is requested but its value is valid
        result = rule.validate(value, { selected: { custom: true }, custom: 'file' });
        expect(result).toEqual(true);
    });
});
