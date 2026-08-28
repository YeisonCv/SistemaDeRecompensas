import { resetDatabase } from './helpers/reset-database';

export default async function globalSetup(): Promise<void> {
    await resetDatabase();
}
