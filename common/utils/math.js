export function calcDistance(pos1, pos2) {
    return Math.sqrt(Math.pow((pos1.x - pos2.x), 2) + Math.pow((pos1.y - pos2.y), 2));
}
export function getDiagLength(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}
/**
 * Returns the unit vector of length 1 pointing from (from) to (target).
 */
export function getUnitVec(from, target) {
    let deltaX = target.x - from.x;
    let deltaY = target.y - from.y;
    let distance = calcDistance(from, target);
    return { dx: deltaX / distance, dy: deltaY / distance };
}
/**
 * Returns the unit vector of length 1 representing the sum of the IVector Array
 * Intended for when there are multiple preys insight, and deciding the direction of movement
 */
export function getEscapeVec(runDirection) {
    let deltaX = 0;
    let deltaY = 0;
    for (let i = 0; i < runDirection.length; i++) {
        deltaX += runDirection[i].dx;
        deltaY += runDirection[i].dy;
    }
    let normCoeff = calcDistance({ x: 0, y: 0 }, { x: deltaX, y: deltaY });
    return { dx: deltaX / normCoeff, dy: deltaY / normCoeff };
}
/**
 * This example returns a random integer between the specified values. The value
 * is no lower than min (or the next integer greater than min if min isn't an
 * integer), and is less than (but not equal to) max.
 *
 * The maximum is exclusive and the minimum is inclusive
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
