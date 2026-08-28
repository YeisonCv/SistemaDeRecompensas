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


async function getCustomer( document: string){
    const database = await readDatabase();
    
    const customer = database.customers.find(
        customer => customer.document === document
    );
    
    if (!customer) {
        throw new Error('Customer not found');
    }
    return customer;
}

async function getPoints(document: string) {
    const customer = await getCustomer(document);

    return { 
        document: customer.document,
        name : customer.name,
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

    if(!customer) {
        throw new Error('Customer not found');
    }

    const pointsEarned = calculatePoints(value);

    const newPurchanse = {
        id: database.purchases.length + 1,
        customer_id: customer.id,
        product,
        value,
        date: new Date().toLocaleDateString('sv-SE') // Formato YYYY-MM-DD [en-US (EE. UU.): 8/26/2026 (MM/DD/YYYY), es-ES (España/Latam): 26/8/2026 (DD/MM/YYYY), sv-SE (Suecia): 2026-08-26 (YYYY-MM-DD)]
    };

    database.purchases.push(newPurchanse);
    customer.points += pointsEarned;
    await writeDatabase(database);
    
    return {
        purchase: newPurchanse,
        pointsEarned,
        totalPoints: customer.points
    };
}

async function getPurchases(document: string) {
    const database = await readDatabase();

    const customer = database.customers.find(
        customer => customer.document === document
    )

    if(!customer) {
        throw new Error('Customer not found');
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
        throw new Error('Customer not found');
    }

    return database.redemptions.filter(
        redemption => redemption.customer_id === customer.id
    );
}

async function redeemPoints(customerId: string, points: number) {
    const database = await readDatabase();

    const customer = database.customers.find(
        customer => customer.document === customerId
    );

    if (!customer) {
        throw new Error('Customer not found');
    }

    if (!Number.isInteger(points) || points <= 0) {
        throw new Error('Points to redeem must be a positive integer');
    }

    if (points > customer.points) {
        throw new Error('Insufficient points');
    }

    customer.points -= points;

    const value = calculateRedeemedPoints(points);

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

export{
    getCustomer,
    getPoints,
    registerPurchase,
    getPurchases,
    getRedemptions,
    redeemPoints
};