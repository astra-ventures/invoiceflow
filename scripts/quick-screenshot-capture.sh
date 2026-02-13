#!/bin/bash

# InvoiceFlow Product Hunt Screenshot Capture Script
# Requires: Chrome browser, macOS screenshot capability

echo "🚀 InvoiceFlow Product Hunt Screenshot Capture"
echo "=============================================="
echo ""
echo "Server Status:"
curl -s -o /dev/null -w "InvoiceFlow Server: %{http_code}\n" http://localhost:3001

if [ $? -ne 0 ]; then
    echo "❌ Server not running. Please start with: npm run dev"
    exit 1
fi

echo "✅ Server running on http://localhost:3001"
echo ""

# Create assets directory
mkdir -p ../assets/product-hunt

echo "📸 Screenshot Capture Instructions:"
echo ""
echo "1. HERO SHOT (1270x760)"
echo "   URL: http://localhost:3001"
echo "   Save as: assets/product-hunt/invoiceflow-1-hero.png"
echo ""

echo "2. INVOICE CREATOR (1270x760)" 
echo "   URL: http://localhost:3001/create"
echo "   Fill sample data:"
echo "   - Business: Acme Digital Studio"
echo "   - Client: TechCorp Inc."
echo "   - Service: Website Development - $2,500"
echo "   Save as: assets/product-hunt/invoiceflow-2-creator.png"
echo ""

echo "3. GENERATED INVOICE (1270x760)"
echo "   Create invoice from form above"
echo "   Capture PDF preview screen"
echo "   Save as: assets/product-hunt/invoiceflow-3-invoice.png"
echo ""

echo "4. FEATURES DASHBOARD (1270x760)"
echo "   URL: http://localhost:3001/analytics"
echo "   Save as: assets/product-hunt/invoiceflow-4-features.png"
echo ""

echo "5. MOBILE VIEW (750x1334)"
echo "   URL: http://localhost:3001 (mobile viewport)"
echo "   Use Chrome Dev Tools → Toggle Device Toolbar"
echo "   Save as: assets/product-hunt/invoiceflow-5-mobile.png"
echo ""

echo "🎯 Pro Tip: Use Chrome Dev Tools for exact dimensions:"
echo "   1. Open DevTools (F12)"
echo "   2. Toggle device toolbar (Cmd+Shift+M)"  
echo "   3. Set custom size: 1270x760 or 750x1334"
echo "   4. Use macOS screenshot: Cmd+Shift+4"
echo ""

echo "✅ When complete, run: ls -la assets/product-hunt/"
echo "   Should show 5 PNG files ready for Product Hunt upload"