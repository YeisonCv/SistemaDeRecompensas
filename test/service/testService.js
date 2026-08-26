const {
    getCustomer,
    getPoints,
    registerPurchase,
    getPurchases
} = require('../../src/service/rewardService');

async function testService() {
    try {
        console.log('--- GET CUSTOMER ---');

        const customer = await getCustomer('1234567890');
        console.log(customer);


        console.log('\n--- GET POINTS ---');

        const points = await getPoints('1234567890');
        console.log(points);


        console.log('\n--- REGISTER PURCHASE ---');

        const purchase = await registerPurchase(
            '1234567890',
            'Monitor',
            1900
        );

        console.log(purchase);


        console.log('\n--- GET PURCHASES ---');

        const purchases = await getPurchases('1234567890');
        console.log(purchases);

    } catch (error) {
        console.error('Service error:', error.message);
    }
}

testService();