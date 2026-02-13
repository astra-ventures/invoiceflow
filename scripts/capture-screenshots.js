const puppeteer = require('puppeteer');

async function captureScreenshots() {
  let browser;
  
  try {
    console.log('🔨 Starting Product Hunt screenshot capture...');
    
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Screenshot 1: Hero Shot (Homepage)
    console.log('📸 Capturing 1/5: Hero Shot...');
    await page.setViewport({ width: 1270, height: 760, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3001', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'assets/product-hunt/invoiceflow-1-hero.png',
      type: 'png'
    });
    
    // Screenshot 2: Invoice Creator
    console.log('📸 Capturing 2/5: Invoice Creator...');
    await page.goto('http://localhost:3001/create', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'assets/product-hunt/invoiceflow-2-creator.png',
      type: 'png'
    });
    
    // Screenshot 3: Same page with some interaction (fallback)
    console.log('📸 Capturing 3/5: Invoice Form...');
    await page.screenshot({ 
      path: 'assets/product-hunt/invoiceflow-3-invoice.png',
      type: 'png'
    });
    
    // Screenshot 4: Try analytics, fallback to homepage
    console.log('📸 Capturing 4/5: Features...');
    try {
      await page.goto('http://localhost:3001/analytics', { 
        waitUntil: 'networkidle0',
        timeout: 5000 
      });
    } catch (e) {
      await page.goto('http://localhost:3001', { 
        waitUntil: 'networkidle0',
        timeout: 5000 
      });
    }
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'assets/product-hunt/invoiceflow-4-features.png',
      type: 'png'
    });
    
    // Screenshot 5: Mobile View
    console.log('📸 Capturing 5/5: Mobile View...');
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3001', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'assets/product-hunt/invoiceflow-5-mobile.png',
      type: 'png'
    });
    
    console.log('✅ All screenshots captured successfully!');
    console.log('📁 Files saved to: assets/product-hunt/');
    
  } catch (error) {
    console.error('❌ Screenshot capture failed:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run with proper error handling
captureScreenshots().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});