import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
    console.log('🚀 Starting E2E test global setup...');

    // Start the application server if needed
    const { webServer } = config.projects[0];
    if (webServer) {
        console.log('📡 Starting web server...');
        // The webServer configuration will handle starting the dev server
    }

    console.log('✅ Global setup completed');
}

export default globalSetup;
