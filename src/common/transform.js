export function encodeAngle(angle) {
    let a = angle || 0;

    if (a !== 0) {
        a = ((a / Math.PI) * 180 + 90) % 360;
        if (a > 180) {
            a = -(360 - a);
        }
        a = -Math.round(a);
    }

    return a;
}

export function decodeAngle(angle) {
    let a = -angle;
    if (a < -90 && a > -180) {
        a = 360 + a;
    }

    a = ((a - 90) / 180) * Math.PI;

    return a;
}
