import { 
    readDatabase, 
    writeDatabase, 
    Customer, 
    Purchase 
} from '../config/database';

import {
    calculatePoints
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

async function getCustomer( document: string){
    const validDocument = validateDocument(document);
    const database = await readDatabase();
    
    return findCustomerByDocument(database.customers, validDocument);
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

    const newPurchanse = {
        id: database.purchases.length + 1,
        customer_id: customer.id,
        product: purchaseData.product,
        value: purchaseData.value,
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
  
export{
    getCustomer,
    getPoints,
    registerPurchase,
    getPurchases,
    findCustomerByDocument
};