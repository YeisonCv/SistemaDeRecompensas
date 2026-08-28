import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    workers: 1,
    reporter: [['list'], ['html', { open: 'never' }]],
    globalSetup: './tests/global-setup.ts',
    use: {
        baseURL: 'http://localhost:3000',
    },
    webServer: {
        command: 'npm run build && npm start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
