import fs from 'fs/promises';
import path from 'path';

const seedPath = path.join(__dirname, '../fixtures/database.seed.json');
const dbPath = path.join(process.cwd(), 'data/database.json');

export async function resetDatabase(): Promise<void> {
    const seed = await fs.readFile(seedPath, 'utf8');
    await fs.writeFile(dbPath, seed, 'utf8');
}
