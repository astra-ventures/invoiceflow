# Product Hunt Screenshots - Manual Capture Instructions

**Status:** Ready for manual capture  
**Server:** ✅ Running at http://localhost:3001  
**Script:** ❌ Automated capture failed (browser connection issue)  
**Next:** Manual screenshot capture required  

## Quick Manual Capture (15 minutes)

### Setup
1. ✅ Dev server is running at http://localhost:3001
2. Open browser and navigate to localhost:3001
3. Use browser dev tools for precise dimensions (F12 → Device Toolbar)

### Screenshots Needed (5 total)

#### 1. Hero Shot (1270x760)
- **URL:** http://localhost:3001
- **Viewport:** Set to 1270x760 in dev tools
- **Filename:** `invoiceflow-1-hero.png`
- **Focus:** Homepage with "Free Invoice Generator" headline and clean design

#### 2. Invoice Creator (1270x760) 
- **URL:** http://localhost:3001/create
- **Viewport:** Set to 1270x760 in dev tools
- **Filename:** `invoiceflow-2-creator.png`
- **Sample Data to Fill:**
  - Business: Acme Digital Studio
  - Client: TechCorp Inc.
  - Service: Website Development - $2,500

#### 3. Features/Dashboard (1270x760)
- **URL:** http://localhost:3001/analytics (or /time if analytics doesn't exist)
- **Viewport:** Set to 1270x760 in dev tools  
- **Filename:** `invoiceflow-3-features.png`
- **Focus:** Multi-feature view showing dashboard/analytics

#### 4. Generated Invoice (1270x760)
- **URL:** Create invoice from /create page, capture result
- **Viewport:** Set to 1270x760 in dev tools
- **Filename:** `invoiceflow-4-invoice.png`  
- **Focus:** Professional invoice output/PDF preview

#### 5. Mobile View (750x1334)
- **URL:** http://localhost:3001
- **Viewport:** Set to 750x1334 (iPhone 12 Pro) in dev tools
- **Filename:** `invoiceflow-5-mobile.png`
- **Focus:** Mobile responsive design

### Save Location
All screenshots should be saved to:
```
./invoiceflow/assets/product-hunt/
```

### Quality Check
- [ ] All 5 screenshots captured
- [ ] Correct dimensions (1270x760 for desktop, 750x1334 for mobile)
- [ ] Professional sample data used
- [ ] No browser UI elements visible
- [ ] PNG format, high quality

### After Capture
Run this to verify all files:
```bash
ls -la ./invoiceflow/assets/product-hunt/
```

Expected output:
```
invoiceflow-1-hero.png      (1270x760)
invoiceflow-2-creator.png   (1270x760)
invoiceflow-3-features.png  (1270x760)  
invoiceflow-4-invoice.png   (1270x760)
invoiceflow-5-mobile.png    (750x1334)
```

## Assets Status Summary

### ✅ Complete
- Tagline: "Create professional invoices in 60 seconds — no signup required"
- Description: Multiple lengths (120, 240, 500 chars) ready for Product Hunt
- Server: Running and ready for screenshots
- Directory structure: Created and ready

### 🔄 In Progress  
- Screenshots: Server ready, manual capture needed (15 min task)

### 📋 Ready for Josh
Once screenshots are complete, InvoiceFlow will have:
- ✅ Vercel deployment config
- ✅ Product Hunt copy (taglines, descriptions)
- ✅ Product Hunt screenshots (5 total)
- ✅ SEO optimization
- ✅ Full V2 feature testing

**Total remaining time:** 15-20 minutes for manual screenshot capture

---

**Instructions prepared by:** Forge  
**Date:** February 15, 2026, 7:35 AM  
**Server Status:** ✅ Ready at localhost:3001