const {
    calculatePoints,
    calculateRedeemedValue
} = require('../../src/utils/points');

console.log('--- POINTS ---');

console.log('$999:', calculatePoints(999));
console.log('$1000:', calculatePoints(1000));
console.log('$1900:', calculatePoints(1900));
console.log('$1999:', calculatePoints(1999));
console.log('$2000:', calculatePoints(2000));
console.log('$2500:', calculatePoints(2500));

console.log('\n--- REDEMPTION ---');

console.log('1 point:', calculateRedeemedValue(1));
console.log('10 points:', calculateRedeemedValue(10));
console.log('500 points:', calculateRedeemedValue(500));