const MIN_PURCHASE_VALUE = 1000;
const POINTS_PER_CURRENCY = 1000;
const REDEEM_VALUE_PER_POINT = 100;

function calculatePoints(value: number): number {
    if (value < MIN_PURCHASE_VALUE) {
        return 0;
    }

    return Math.floor(value / POINTS_PER_CURRENCY);
}

function validateRedemption(points: number, currentBalance: number): void {
    if (!Number.isInteger(points)) {
        throw new Error('Los puntos a redimir deben ser un número entero');
    }

    if (points <= 0) {
        throw new Error('No se pueden redimir 0 puntos');
    }

    if (points > currentBalance) {
        throw new Error('No hay puntos suficientes para redimir');
    }
}

function calculateRedeemedPoints(points: number, currentBalance: number): number {
    validateRedemption(points, currentBalance);
    return points * REDEEM_VALUE_PER_POINT;
}

export {
    calculatePoints,
    calculateRedeemedPoints,
    validateRedemption
};
