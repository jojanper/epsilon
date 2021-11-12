import { encodeAngle, decodeAngle } from '../transform';

describe('Coordinate transforms', () => {
    it('encode and decode angle', () => {
        let angle = 0.25;
        let enc = encodeAngle(angle);
        let angleDec = decodeAngle(enc);
        expect(enc).toEqual(encodeAngle(angleDec));

        angle = 2.49;
        enc = encodeAngle(angle);
        angleDec = decodeAngle(enc);
        expect(enc).toEqual(encodeAngle(angleDec));

        angle = 0;
        enc = encodeAngle(angle);
        angleDec = decodeAngle(enc);
        expect(enc).toEqual(Math.abs(encodeAngle(angleDec)));

        expect(0).toEqual(encodeAngle());
    });
});
