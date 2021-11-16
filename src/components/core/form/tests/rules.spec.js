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

        result = rule.validate({}, { selected: {} });
        expect(result).toEqual(true);

        result = rule.validate({}, {});
        expect(result).toEqual(false);

        result = rule.validate({}, { selected: { custom: true } });
        expect(result).toEqual(false);

        result = rule.validate({}, { selected: { custom: true }, custom: '' });
        expect(result).toEqual(false);

        result = rule.validate({}, { selected: { custom: true }, custom: 'file' });
        expect(result).toEqual(true);
    });
});
