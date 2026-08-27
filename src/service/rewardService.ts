import { 
    readDatabase, 
    writeDatabase, 
    Customer, 
    Purchase 
} from '../config/database';

import {
    calculatePoints
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
  
export{
    getCustomer,
    getPoints,
    registerPurchase,
    getPurchases
};