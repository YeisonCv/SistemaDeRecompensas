function calculatePoints(value) {
    return Math.floor(value / 1000);
}

function calculateRedeemedValue(points) {
    return points * 100;
}

module.exports = {
    calculatePoints,
    calculateRedeemedValue
}