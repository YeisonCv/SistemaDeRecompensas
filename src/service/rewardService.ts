import {
    readDatabase,
    writeDatabase,
    Customer,
    Purchase
} from '../config/database';

import {
    calculatePoints,
    calculateRedeemedPoints
} from '../utils/points';

import {
    validateDocument,
    validatePurchaseData
} from '../utils/validation';


function findCustomerByDocument(
    customers: Customer[],
    document: string
): Customer {
    const customer = customers.find(
        customer => customer.document === document
    );

    if (!customer) {
        throw new Error('Cliente no encontrado');
    }

    return customer;
}


async function getCustomer(document: string) {
    const validDocument = validateDocument(document);

    const database = await readDatabase();

    return findCustomerByDocument(
        database.customers,
        validDocument
    );
}


async function getPoints(document: string) {
    const customer = await getCustomer(document);

    return {
        document: customer.document,
        name: customer.name,
        points: customer.points
    };
}


async function registerPurchase(
    document: string,
    product: unknown,
    value: unknown
) {
    const validDocument = validateDocument(document);
    const purchaseData = validatePurchaseData(product, value);

    const database = await readDatabase();

    const customer = findCustomerByDocument(
        database.customers,
        validDocument
    );

    const pointsEarned = calculatePoints(purchaseData.value);

    const newPurchase = {
        id: database.purchases.length + 1,
        customer_id: customer.id,
        product: purchaseData.product,
        value: purchaseData.value,
        date: new Date().toLocaleDateString('sv-SE')
    };

    database.purchases.push(newPurchase);

    customer.points += pointsEarned;

    await writeDatabase(database);

    return {
        purchase: newPurchase,
        pointsEarned,
        totalPoints: customer.points
    };
}


async function getPurchases(document: string) {
    const validDocument = validateDocument(document);

    const database = await readDatabase();

    const customer = findCustomerByDocument(
        database.customers,
        validDocument
    );

    return database.purchases.filter(
        purchase => purchase.customer_id === customer.id
    );
}


async function getRedemptions(document: string) {
    const validDocument = validateDocument(document);

    const database = await readDatabase();

    const customer = findCustomerByDocument(
        database.customers,
        validDocument
    );

    return database.redemptions.filter(
        redemption => redemption.customer_id === customer.id
    );
}


async function redeemPoints(document: string, points: number) {
    const validDocument = validateDocument(document);

    const database = await readDatabase();

    const customer = findCustomerByDocument(
        database.customers,
        validDocument
    );

    const value = calculateRedeemedPoints(points, customer.points);
    customer.points -= points;

    const newRedemption = {
        id: database.redemptions.length + 1,
        customer_id: customer.id,
        points_used: points,
        date: new Date().toLocaleDateString('sv-SE'),
        redeemed_value: value
    };

    database.redemptions.push(newRedemption);

    await writeDatabase(database);

    return {
        redemption: newRedemption,
        pointsRedeemed: points,
        valueRedeemed: value,
        remainingPoints: customer.points
    };
}


export {
    getCustomer,
    getPoints,
    registerPurchase,
    getPurchases,
    getRedemptions,
    redeemPoints,
    findCustomerByDocument
};

