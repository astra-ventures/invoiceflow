# InvoiceFlow - Product Hunt Screenshots (Manual Guide)

**Status:** ✅ READY FOR CAPTURE  
**Server:** http://localhost:3001  
**Date:** February 13, 2026  

## Required Screenshots (5 total)

### 1. Hero Shot (1270x760) 
**URL:** http://localhost:3001  
**Description:** Homepage with main headline  
**Key Elements:**
- "Free Invoice Generator: Professional Invoices in 60 Seconds"
- Clean navigation bar with InvoiceFlow branding
- Hero CTA buttons: "Create Free Invoice" and "View Pricing"
- Feature highlights with icons (⚡ Lightning Fast, 💳 Stripe Payments, ⏱️ Time Tracking)

**Capture Notes:** Full homepage view, professional branding visible

---

### 2. Invoice Creator (1270x760)
**URL:** http://localhost:3001/create  
**Description:** Invoice creation form in action  
**Key Elements:**
- Clean, intuitive form interface
- Business info section (InvoiceFlow branding visible)
- Client details section
- Line items with easy add/remove
- Professional styling throughout

**Sample Data to Fill:**
```
Business Name: Acme Digital Studio
Business Email: billing@acmedigital.com  
Client Name: TechCorp Inc.
Client Email: accounts@techcorp.com
Service: Website Development - $2,500
```

---

### 3. Generated Invoice (1270x760)
**URL:** Create invoice and capture PDF preview  
**Description:** Professional invoice output  
**Key Elements:**
- Clean, professional invoice design
- All business and client details populated
- Line items clearly displayed
- Total calculations visible
- Professional branding/layout

**Process:** Fill out form completely → Generate invoice → Capture preview screen

---

### 4. Features Dashboard (1270x760)
**URL:** http://localhost:3001/analytics  
**Description:** Analytics/dashboard showing multiple features  
**Key Elements:**
- Revenue tracking charts/metrics
- Time tracking integration
- Analytics dashboard layout
- Multiple feature showcase
- Professional data visualization

**Fallback:** If analytics page not populated, use http://localhost:3001/time or recurring page

---

### 5. Mobile View (750x1334)
**URL:** http://localhost:3001 (mobile viewport)  
**Description:** Mobile responsive invoice creation  
**Key Elements:**
- Touch-friendly mobile interface
- Responsive design showcase
- Navigation adapted for mobile
- Easy-to-use mobile form elements

**Capture Method:** Browser dev tools → Toggle device toolbar → iPhone 12 Pro → Capture

---

## Screenshot Specifications

### Technical Requirements
- **Desktop Screenshots:** 1270x760 pixels
- **Mobile Screenshot:** 750x1334 pixels  
- **Format:** PNG (high quality)
- **DPI:** 2x (retina quality)
- **File Naming:** `invoiceflow-1-hero.png`, `invoiceflow-2-creator.png`, etc.

### Quality Guidelines
- Ensure all text is crisp and readable
- No browser UI elements (address bar, bookmarks, etc.)
- Professional sample data only
- Consistent lighting/contrast
- No personal information visible

---

## Manual Capture Process

### Using macOS Screenshot Tools
1. **Full Page:** `Cmd + Shift + 4` → Select exact area
2. **Window:** `Cmd + Shift + 4` → Spacebar → Click window
3. **Touch Bar:** Use Screenshot app for precise dimensions

### Using Browser Dev Tools
1. Open Developer Tools (`F12`)
2. Toggle device toolbar (`Cmd + Shift + M`)
3. Set custom dimensions (1270x760 or 750x1334)
4. Capture via screenshot tool

### Quality Check
- [ ] All screenshots captured at correct dimensions
- [ ] Text is sharp and readable at compressed sizes
- [ ] No browser chrome visible
- [ ] Professional sample data used
- [ ] Consistent visual styling

---

## File Organization

```
invoiceflow/assets/product-hunt/
├── invoiceflow-1-hero.png          (1270x760)
├── invoiceflow-2-creator.png       (1270x760)  
├── invoiceflow-3-invoice.png       (1270x760)
├── invoiceflow-4-features.png      (1270x760)
├── invoiceflow-5-mobile.png        (750x1334)
└── README.md                       (this file)
```

---

## Upload Checklist

Before uploading to Product Hunt:

- [ ] All 5 screenshots captured
- [ ] Correct dimensions verified
- [ ] Professional sample data used
- [ ] No personal/sensitive information
- [ ] High quality PNG format
- [ ] Files under 3MB each
- [ ] Compelling visual story told across images

---

## Alternative: Automated Capture Script

If manual capture becomes tedious, use this simple Node.js script:

```javascript
// capture-screenshots.js
const puppeteer = require('puppeteer');

async function captureScreenshots() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Screenshot 1: Hero
  await page.setViewport({ width: 1270, height: 760 });
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'assets/invoiceflow-1-hero.png' });
  
  // Add other screenshots...
  
  await browser.close();
}

captureScreenshots();
```

---

**Next Steps:** 
1. Start InvoiceFlow dev server: `npm run dev` ✅
2. Manually capture all 5 screenshots using guide above
3. Create `assets/` directory and organize files
4. Upload to Product Hunt when ready

**Estimated Time:** 15-20 minutes for all screenshots  
**Priority:** High (P0 InvoiceFlow Launch blocker)