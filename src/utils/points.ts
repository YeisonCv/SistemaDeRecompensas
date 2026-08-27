function calculatePoints(value: number): number {
    return Math.floor(value / 10);
}

function calculateRedeemedPoints(points: number): number {
    return points * 100;
}

export {
    calculatePoints,
    calculateRedeemedPoints
};