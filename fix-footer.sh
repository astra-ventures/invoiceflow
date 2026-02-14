#!/bin/bash
# Script to fix footer links

# Replace the footer links
sed -i '' 's|href="#"|href="/privacy"|1' src/components/landing/Footer.tsx
sed -i '' 's|href="#"|href="/terms"|1' src/components/landing/Footer.tsx  
sed -i '' 's|href="#"|href="/api-docs"|1' src/components/landing/Footer.tsx

echo "Footer links updated successfully"