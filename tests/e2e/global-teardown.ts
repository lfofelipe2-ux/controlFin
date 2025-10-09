import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
    console.log('🧹 Starting E2E test global teardown...');

    // Clean up any resources if needed
    console.log('✅ Global teardown completed');
}

export default globalTeardown;
