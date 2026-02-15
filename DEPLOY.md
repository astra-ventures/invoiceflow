# InvoiceFlow Deployment Guide

## One-Click Vercel Deploy ✨

**Ready for immediate deployment!** 

1. **Import from GitHub**: https://github.com/astra-ventures/invoiceflow
2. **Click Deploy** - no environment variables required initially
3. **App will work immediately** with all free features enabled

## Post-Deploy: Add Stripe (Optional)

After deployment, add these environment variables in Vercel dashboard for Pro features:

```bash
# Required for Pro tier billing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
STRIPE_SECRET_KEY=sk_live_your_key_here  
STRIPE_PRO_MONTHLY_PRICE_ID=price_your_price_id_here

# Automatically set by Vercel
NEXT_PUBLIC_VERCEL_URL=your-app-url.vercel.app
```

## What Works Without Stripe

✅ **Free Tier (Full Functionality)**:
- Create unlimited invoices
- Time tracking & analytics  
- Client management
- WhatsApp/SMS delivery
- Professional PDF export
- All landing page features

✅ **Pro Features (Disabled Until Stripe Added)**:
- Stripe payment links
- Recurring invoice automation  
- Custom branding
- Advanced analytics

## Build Status

✅ **Production build passes**: 17 routes, all static
✅ **Zero required environment variables**
✅ **TypeScript compilation clean**
✅ **Responsive design verified**
✅ **SEO optimized** with proper metadata

## Domain Setup

1. **Primary**: `app.invoiceflow.com` (main application)
2. **Marketing**: `invoiceflow.com` (landing pages only)

Ready for Product Hunt launch! 🚀