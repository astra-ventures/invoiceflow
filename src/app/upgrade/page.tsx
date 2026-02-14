'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Crown, Zap, Shield, Cloud, Headphones } from 'lucide-react'
import { hasProAccess, activateProTier, STRIPE_CONFIG } from '@/lib/stripe'

export default function UpgradePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAlreadyPro, setIsAlreadyPro] = useState(hasProAccess())

  const handleUpgrade = async () => {
    setIsLoading(true)

    try {
      // TODO: In production, this would create a Stripe Checkout session
      // For demo purposes, simulate the upgrade process
      
      // Mock Stripe checkout redirect
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Activate pro tier locally (demo)
      activateProTier()
      setIsAlreadyPro(true)
      
      // Redirect to success page
      router.push('/upgrade/success')
    } catch (error) {
      console.error('Upgrade failed:', error)
      setIsLoading(false)
    }
  }

  if (isAlreadyPro) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#10B981]/20 text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            You're Already Pro! 🎉
          </h1>
          <p className="text-[#9CA3AF] mb-8">
            You have access to all pro features. Start creating professional invoices with Stripe payment links!
          </p>
          <button
            onClick={() => router.push('/create')}
            className="w-full bg-[#6366F1] text-white py-3 rounded-lg font-semibold hover:bg-[#818CF8] transition-colors"
          >
            Create Pro Invoice
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-[#6366F1]/20 text-[#6366F1] rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Upgrade to InvoiceFlow Pro
          </h1>
          <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto">
            Unlock professional features and get paid faster with Stripe integration, 
            custom branding, and advanced automation.
          </p>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Tier */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">Free Forever</h3>
              <div className="text-3xl font-bold text-white">$0</div>
              <p className="text-[#9CA3AF] mt-2">Perfect for getting started</p>
            </div>

            <ul className="space-y-4">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#10B981] mr-3" />
                <span className="text-[#9CA3AF]">Unlimited invoices</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#10B981] mr-3" />
                <span className="text-[#9CA3AF]">Time tracking</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#10B981] mr-3" />
                <span className="text-[#9CA3AF]">Basic analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#10B981] mr-3" />
                <span className="text-[#9CA3AF]">WhatsApp/SMS delivery</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#10B981] mr-3" />
                <span className="text-[#9CA3AF]">Standard templates</span>
              </li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-[#6366F1]/10 to-[#38BDF8]/10 border-2 border-[#6366F1] rounded-xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="bg-[#6366F1] text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">InvoiceFlow Pro</h3>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold text-white">$9</span>
                <span className="text-[#9CA3AF] ml-2">/month</span>
              </div>
              <p className="text-[#9CA3AF] mt-2">Everything in Free, plus:</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Zap className="w-5 h-5 text-[#6366F1] mr-3" />
                <span className="text-white font-medium">Stripe payment links on invoices</span>
              </li>
              <li className="flex items-center">
                <Crown className="w-5 h-5 text-[#F59E0B] mr-3" />
                <span className="text-white font-medium">Custom branding & logo</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#10B981] mr-3" />
                <span className="text-white font-medium">Recurring invoice automation</span>
              </li>
              <li className="flex items-center">
                <Cloud className="w-5 h-5 text-[#38BDF8] mr-3" />
                <span className="text-white font-medium">Cloud sync & backup</span>
              </li>
              <li className="flex items-center">
                <Shield className="w-5 h-5 text-[#10B981] mr-3" />
                <span className="text-white font-medium">Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <Headphones className="w-5 h-5 text-[#F59E0B] mr-3" />
                <span className="text-white font-medium">Priority support</span>
              </li>
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-[#6366F1] text-white py-4 rounded-lg font-bold hover:bg-[#818CF8] hover:shadow-lg hover:shadow-[#6366F1]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Upgrade to Pro ($9/month)'
              )}
            </button>

            <p className="text-xs text-[#6B7280] text-center mt-4">
              Cancel anytime. No questions asked.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-[#111827] rounded-xl border border-white/10 p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Why Upgrade to Pro?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#6366F1]/20 text-[#6366F1] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Get Paid Faster</h4>
              <p className="text-[#9CA3AF] text-sm">
                Stripe payment links let clients pay instantly with credit cards, Apple Pay, or Google Pay
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#F59E0B]/20 text-[#F59E0B] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Professional Brand</h4>
              <p className="text-[#9CA3AF] text-sm">
                Custom logos, colors, and branding make your invoices look professional and trustworthy
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#10B981]/20 text-[#10B981] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Save Time</h4>
              <p className="text-[#9CA3AF] text-sm">
                Recurring invoices and automation handle repeat billing automatically
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-[#6B7280]">
            Questions about Pro features?{' '}
            <a href="mailto:support@invoiceflow.app" className="text-[#6366F1] hover:text-[#818CF8] transition-colors">
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}