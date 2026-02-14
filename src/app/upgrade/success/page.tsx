'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Crown, Zap } from 'lucide-react'
import { activateProTier } from '@/lib/stripe'

export default function UpgradeSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Activate pro tier when user lands on success page
    activateProTier()
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[#10B981]/20 text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="w-10 h-10" />
        </div>

        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to InvoiceFlow Pro! 🎉
        </h1>
        <p className="text-xl text-[#9CA3AF] mb-8 max-w-lg mx-auto">
          Your subscription is now active. You have access to all pro features including Stripe payment links!
        </p>

        {/* Pro Features Activated */}
        <div className="bg-[#111827] rounded-xl border border-[#10B981]/30 p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center justify-center">
            <Crown className="w-6 h-6 text-[#6366F1] mr-2" />
            Pro Features Now Active
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#6366F1]/20 text-[#6366F1] rounded-full flex items-center justify-center mr-3">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-white">Stripe payment links on invoices</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#F59E0B]/20 text-[#F59E0B] rounded-full flex items-center justify-center mr-3">
                <Crown className="w-4 h-4" />
              </div>
              <span className="text-white">Custom branding & logos</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#10B981]/20 text-[#10B981] rounded-full flex items-center justify-center mr-3">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-white">Recurring invoice automation</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#38BDF8]/20 text-[#38BDF8] rounded-full flex items-center justify-center mr-3">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-white">Cloud sync & backup</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => router.push('/create')}
            className="bg-[#6366F1] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#818CF8] hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all"
          >
            Create Pro Invoice with Stripe
          </button>
          
          <button
            onClick={() => router.push('/settings')}
            className="border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/5 transition-all"
          >
            Customize Branding
          </button>
        </div>

        {/* Subscription Info */}
        <div className="bg-[#1F2937] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Subscription Details</h3>
          <p className="text-[#9CA3AF] mb-4">
            InvoiceFlow Pro - $9/month
          </p>
          <p className="text-sm text-[#6B7280]">
            Your subscription will automatically renew monthly. You can cancel anytime from your settings.
          </p>
        </div>

        {/* Support */}
        <p className="text-[#6B7280] mt-8">
          Need help getting started?{' '}
          <a href="mailto:support@invoiceflow.app" className="text-[#6366F1] hover:text-[#818CF8] transition-colors">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  )
}