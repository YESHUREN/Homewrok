import { chromium } from 'playwright';

async function run() {
  console.log("Launching headless browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.error('[BROWSER ERROR] Uncaught exception:', err);
  });

  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED] ${request.url()}: ${request.failure()?.errorText}`);
  });

  try {
    console.log("Navigating to http://localhost:3000 ...");
    await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 10000 });
    console.log("Page loaded. Waiting 3 seconds for client-side rendering/errors...");
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.error("Navigation failed:", error);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
}

run().catch(console.error);
