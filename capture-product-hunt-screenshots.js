#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function captureProductHuntScreenshots() {
  console.log('🚀 Starting Product Hunt screenshot capture...');
  
  // Ensure assets directory exists
  const assetsDir = path.join(__dirname, 'assets', 'product-hunt');
  await fs.mkdir(assetsDir, { recursive: true });

  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Screenshot 1: Hero Shot (1270x760)
    console.log('📸 Capturing Hero Shot...');
    await page.setViewport({ width: 1270, height: 760 });
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: path.join(assetsDir, 'invoiceflow-1-hero.png'),
      fullPage: false
    });
    console.log('✅ Hero shot captured');

    // Screenshot 2: Invoice Creator (1270x760) 
    console.log('📸 Capturing Invoice Creator...');
    await page.goto('http://localhost:3001/create', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    // Fill in sample data
    try {
      await page.type('input[name="businessName"]', 'Acme Digital Studio', { delay: 50 });
      await page.type('input[name="businessEmail"]', 'billing@acmedigital.com', { delay: 50 });
      await page.type('input[name="clientName"]', 'TechCorp Inc.', { delay: 50 });
      await page.type('input[name="clientEmail"]', 'accounts@techcorp.com', { delay: 50 });
    } catch (e) {
      console.log('Note: Could not fill sample data (form fields may have different names)');
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: path.join(assetsDir, 'invoiceflow-2-creator.png'),
      fullPage: false
    });
    console.log('✅ Invoice creator captured');

    // Screenshot 3: Features/Analytics (1270x760)
    console.log('📸 Capturing Features Dashboard...');
    // Try analytics first, fallback to other feature pages
    const featureUrls = [
      'http://localhost:3001/analytics', 
      'http://localhost:3001/time',
      'http://localhost:3001/recurring',
      'http://localhost:3001'
    ];
    
    for (const url of featureUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 5000 });
        await page.waitForTimeout(2000);
        break;
      } catch (e) {
        console.log(`⚠️  Could not load ${url}, trying next...`);
      }
    }
    
    await page.screenshot({ 
      path: path.join(assetsDir, 'invoiceflow-3-features.png'),
      fullPage: false
    });
    console.log('✅ Features dashboard captured');

    // Screenshot 4: Generated Invoice - try to create one
    console.log('📸 Capturing Generated Invoice...');
    await page.goto('http://localhost:3001/create', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    // Try to fill and generate
    try {
      // Quick form fill for invoice generation
      await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach((input, i) => {
          if (input.type === 'text' || input.type === 'email' || input.tagName === 'TEXTAREA') {
            if (input.placeholder?.includes('business') || input.name?.includes('business')) {
              input.value = 'Acme Digital Studio';
            } else if (input.placeholder?.includes('client') || input.name?.includes('client')) {
              input.value = 'TechCorp Inc.';
            } else if (input.placeholder?.includes('email')) {
              input.value = 'test@example.com';
            } else if (input.placeholder?.includes('description') || input.placeholder?.includes('item')) {
              input.value = 'Website Development';
            } else if (input.placeholder?.includes('amount') || input.placeholder?.includes('price')) {
              input.value = '2500';
            }
          }
        });
      });
      
      // Look for generate/create button
      const generateButton = await page.$('button:contains("Generate"), button:contains("Create"), [type="submit"]');
      if (generateButton) {
        await generateButton.click();
        await page.waitForTimeout(3000);
      }
    } catch (e) {
      console.log('Note: Could not auto-generate invoice, capturing form view');
    }
    
    await page.screenshot({ 
      path: path.join(assetsDir, 'invoiceflow-4-invoice.png'),
      fullPage: false
    });
    console.log('✅ Generated invoice captured');

    // Screenshot 5: Mobile View (750x1334)
    console.log('📸 Capturing Mobile View...');
    await page.setViewport({ width: 750, height: 1334 });
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: path.join(assetsDir, 'invoiceflow-5-mobile.png'),
      fullPage: false
    });
    console.log('✅ Mobile view captured');

    console.log('🎉 All Product Hunt screenshots captured successfully!');
    
    // List captured files
    const files = await fs.readdir(assetsDir);
    console.log('\n📁 Generated files:');
    files.forEach(file => console.log(`   ${file}`));
    
    console.log(`\n📂 Screenshots saved to: ${assetsDir}`);
    
  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Run the script
if (require.main === module) {
  captureProductHuntScreenshots().catch(console.error);
}

module.exports = captureProductHuntScreenshots;