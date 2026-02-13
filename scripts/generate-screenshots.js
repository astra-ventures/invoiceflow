#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_CONFIG = [
  {
    name: '1-hero-shot',
    url: 'http://localhost:3001',
    description: 'Homepage with main headline',
    width: 1270,
    height: 760,
    delay: 2000
  },
  {
    name: '2-invoice-creator',
    url: 'http://localhost:3001/create',
    description: 'Invoice creation form',
    width: 1270,
    height: 760,
    delay: 3000,
    actions: [
      { type: 'type', selector: 'input[name="businessName"]', text: 'Acme Digital Studio' },
      { type: 'type', selector: 'input[name="businessEmail"]', text: 'billing@acmedigital.com' },
      { type: 'type', selector: 'input[name="clientName"]', text: 'TechCorp Inc.' },
      { type: 'type', selector: 'input[name="clientEmail"]', text: 'accounts@techcorp.com' },
      { type: 'type', selector: 'input[data-testid="description-0"]', text: 'Website Development' },
      { type: 'type', selector: 'input[data-testid="amount-0"]', text: '2500' }
    ]
  },
  {
    name: '3-generated-invoice',
    url: 'http://localhost:3001/create',
    description: 'Generated invoice preview',
    width: 1270,
    height: 760,
    delay: 3000,
    actions: [
      { type: 'type', selector: 'input[name="businessName"]', text: 'Professional Services Inc.' },
      { type: 'type', selector: 'input[name="businessEmail"]', text: 'invoices@professional.com' },
      { type: 'type', selector: 'input[name="clientName"]', text: 'Global Tech Solutions' },
      { type: 'type', selector: 'input[name="clientEmail"]', text: 'billing@globaltech.com' },
      { type: 'type', selector: 'input[data-testid="description-0"]', text: 'Consulting Services' },
      { type: 'type', selector: 'input[data-testid="amount-0"]', text: '5000' },
      { type: 'click', selector: 'button[type="submit"]' }
    ],
    waitForGeneration: true
  },
  {
    name: '4-features-overview',
    url: 'http://localhost:3001/analytics',
    description: 'Analytics dashboard',
    width: 1270,
    height: 760,
    delay: 2500
  },
  {
    name: '5-mobile-view',
    url: 'http://localhost:3001',
    description: 'Mobile responsive view',
    width: 750,
    height: 1334,
    delay: 2000,
    mobile: true
  }
];

async function generateScreenshots() {
  // Create assets directory if it doesn't exist
  const assetsDir = path.join(__dirname, '../assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  console.log('🚀 Starting Product Hunt screenshot generation...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const config of SCREENSHOTS_CONFIG) {
      console.log(`📸 Capturing: ${config.name} - ${config.description}`);
      
      const page = await browser.newPage();
      
      // Set viewport
      await page.setViewport({ 
        width: config.width, 
        height: config.height,
        deviceScaleFactor: 2 // High DPI for crisp screenshots
      });

      // Navigate to URL
      await page.goto(config.url, { waitUntil: 'networkidle0' });
      
      // Wait for initial load
      await page.waitForTimeout(config.delay);

      // Execute any actions (form filling, clicking, etc.)
      if (config.actions) {
        for (const action of config.actions) {
          try {
            switch (action.type) {
              case 'type':
                await page.waitForSelector(action.selector, { timeout: 5000 });
                await page.type(action.selector, action.text);
                break;
              case 'click':
                await page.waitForSelector(action.selector, { timeout: 5000 });
                await page.click(action.selector);
                break;
            }
            await page.waitForTimeout(500); // Small delay between actions
          } catch (error) {
            console.log(`⚠️  Action failed for ${action.selector}: ${error.message}`);
          }
        }
      }

      // Wait for generation if needed
      if (config.waitForGeneration) {
        await page.waitForTimeout(3000); // Extra time for invoice generation
      }

      // Take screenshot
      const screenshotPath = path.join(assetsDir, `${config.name}.png`);
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: false,
        type: 'png'
      });
      
      console.log(`✅ Saved: ${screenshotPath}`);
      
      await page.close();
    }
    
    console.log('\n🎉 All screenshots generated successfully!');
    console.log(`📁 Screenshots saved to: ${assetsDir}`);
    console.log('\n📋 Generated files:');
    
    // List generated files
    const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png'));
    files.forEach(file => {
      const stats = fs.statSync(path.join(assetsDir, file));
      console.log(`   - ${file} (${Math.round(stats.size / 1024)}KB)`);
    });

    console.log('\n🚀 Ready for Product Hunt upload!');
    
  } catch (error) {
    console.error('❌ Screenshot generation failed:', error);
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  generateScreenshots().catch(console.error);
}

module.exports = { generateScreenshots };