import { promises as fs } from 'fs';
import path from 'path';

interface Customer {
    id: number;
    document: string;
    name: string;
    points: number;
}

interface Purchase {
    id: number;
    customer_id: number;
    product: string;
    value: number;
    date: string; // Formato YYYY-MM-DD
}

interface Redemption {
    id: number;
    customer_id: number;
    points_redeemed: number;
    date: string; // Formato YYYY-MM-DD
}

interface Database {
    customers: Customer[];
    purchases: Purchase[];
    redemptions: Redemption[];
}

const databaseFilePath = path.join(
    __dirname, 
    '../../data/database.json'
);

async function readDatabase(): Promise<Database> {
    const data = await fs.readFile(databaseFilePath, 'utf8');
    return JSON.parse(data) as Database;
}

async function writeDatabase(data: Database): Promise<void> { 
    await fs.writeFile(
        databaseFilePath,
        JSON.stringify(data, null, 2),
        'utf8'
    );
}

export {
    Customer,
    Purchase,
    Redemption,
    Database,
    readDatabase,
    writeDatabase
};

