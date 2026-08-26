const { readDatabase, writeDatabase } = require('../config/database');
const { calculatePoints, calculateRedeemedValue } = require('../utils/points.js');


async function getCustomer(document) {
    const database = await readDatabase();
    const customer = database.customers.find(
        customer => customer.document === document
    );
    
    if (!customer) {
        throw new Error('Customer not found');
    }
    return customer;
}

async function getPoints(document) {
    const customer = await getCustomer(document);
    return { 
        document: customer.document,
        name : customer.name,
        points: customer.points 
    }; 
}

async function registerPurchase(document, product, value) {
    const database = await readDatabase();

    const customer = database.customers.find(
        customer => customer.document === document
    );

    if(!customer) {
        throw new Error('Customer not found');
    }

    const newPurchanse = {
        id: database.purchases.length + 1,
        customer_id: customer.id,
        product,
        value,
        date: new Date().toLocaleDateString('sv-SE') // Formato YYYY-MM-DD [en-US (EE. UU.): 8/26/2026 (MM/DD/YYYY), es-ES (España/Latam): 26/8/2026 (DD/MM/YYYY), sv-SE (Suecia): 2026-08-26 (YYYY-MM-DD)]
    };

    database.purchases.push(newPurchanse);
    customer.points += calculatePoints(value);
    await writeDatabase(database);
    
    return {
        purchase: newPurchanse,
        pointsEarned: calculatePoints(value),
        totalPoints: customer.points
    };
}

async function getPurchases(document) {
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
  
module.exports = {
    getCustomer,
    getPoints,
    registerPurchase,
    getPurchases
};