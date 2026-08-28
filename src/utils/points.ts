function calculatePoints(value: number): number {
    return Math.floor(value / 1000);
}

function calculateRedeemedPoints(points: number): number {
    return points * 100;
}

export {
    calculatePoints,
    calculateRedeemedPoints
};