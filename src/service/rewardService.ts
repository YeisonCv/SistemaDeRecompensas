import {
    readDatabase,
    writeDatabase
} from '../config/database';

import {
    calculatePoints,
    calculateRedeemedPoints
} from '../utils/points';


async function getCustomer(document: string) {

    const database = await readDatabase();

    const customer = database.customers.find(
        customer => customer.document === document
    );

    if (!customer) {
        throw new Error('Cliente no encontrado');
    }

    return customer;
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
    product: string,
    value: number
) {

    const database = await readDatabase();

    const customer = database.customers.find(
        customer => customer.document === document
    );

    if (!customer) {
        throw new Error('Cliente no encontrado');
    }

    const pointsEarned = calculatePoints(value);

    const newPurchase = {
        id: database.purchases.length + 1,
        customer_id: customer.id,
        product,
        value,
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

    const database = await readDatabase();

    const customer = database.customers.find(
        customer => customer.document === document
    );

    if (!customer) {
        throw new Error('Cliente no encontrado');
    }

    return database.purchases.filter(
        purchase => purchase.customer_id === customer.id
    );
}


async function getRedemptions(document: string) {

    const database = await readDatabase();

    const customer = database.customers.find(
        customer => customer.document === document
    );

    if (!customer) {
        throw new Error('Cliente no encontrado');
    }

    return database.redemptions.filter(
        redemption => redemption.customer_id === customer.id
    );
}


async function redeemPoints(
    customerId: string,
    points: number
) {

    const database = await readDatabase();

    const customer = database.customers.find(
        customer => customer.document === customerId
    );

    if (!customer) {
        throw new Error('Cliente no encontrado');
    }

    if (!Number.isInteger(points) || points <= 0) {
        throw new Error(
            'Points to redeem must be a positive integer'
        );
    }

    if (points >= customer.points) {
        throw new Error('Insufficient points');
    }

    customer.points -= points;

    const value = calculateRedeemedPoints(points);

    const newRedemption = {
        id: database.redemptions.length + 1,
        customer_id: customer.id,
        points_used: points,
        points_redeemed: points,
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
    redeemPoints
};