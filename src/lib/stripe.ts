import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default stripePromise;

// Stripe configuration
export const STRIPE_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  proPriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/upgrade/success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/upgrade/cancel`,
};

// Pro tier features
export const PRO_FEATURES = {
  stripePaymentLinks: true,
  recurringInvoices: true,
  customBranding: true,
  cloudSync: true,
  prioritySupport: true,
  advancedAnalytics: true,
} as const;

// Free tier limits (all unlimited in this implementation)
export const FREE_TIER = {
  maxInvoices: null, // unlimited
  maxClients: null, // unlimited
  timeTracking: true,
  basicAnalytics: true,
  whatsappSms: true,
  standardTemplates: true,
} as const;

// Check if user has pro features (placeholder - in real app would check subscription status)
export const hasProAccess = (): boolean => {
  // TODO: In production, this would check actual subscription status
  // For now, check localStorage or cookie for demo purposes
  if (typeof window !== 'undefined') {
    return localStorage.getItem('invoiceflow_pro') === 'true';
  }
  return false;
};

// Activate pro tier (for demo purposes)
export const activateProTier = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('invoiceflow_pro', 'true');
    localStorage.setItem('invoiceflow_pro_activated', new Date().toISOString());
  }
};

// Deactivate pro tier (for demo purposes) 
export const deactivateProTier = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('invoiceflow_pro');
    localStorage.removeItem('invoiceflow_pro_activated');
  }
};