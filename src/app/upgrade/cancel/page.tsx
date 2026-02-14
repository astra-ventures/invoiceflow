'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, MessageSquare } from 'lucide-react'

export default function UpgradeCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#F59E0B]/20 text-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-8">
          <ArrowLeft className="w-8 h-8" />
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-4">
          No Problem! 👋
        </h1>
        <p className="text-xl text-[#9CA3AF] mb-8">
          Your upgrade was cancelled. You can still use all our free features with no limits!
        </p>

        {/* Free Features Reminder */}
        <div className="bg-[#111827] rounded-xl border border-white/10 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            You Still Have Access To:
          </h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-center text-[#9CA3AF]">
              <div className="w-2 h-2 bg-[#10B981] rounded-full mr-3"></div>
              Unlimited invoices forever
            </li>
            <li className="flex items-center text-[#9CA3AF]">
              <div className="w-2 h-2 bg-[#10B981] rounded-full mr-3"></div>
              Time tracking & analytics
            </li>
            <li className="flex items-center text-[#9CA3AF]">
              <div className="w-2 h-2 bg-[#10B981] rounded-full mr-3"></div>
              WhatsApp & SMS delivery
            </li>
            <li className="flex items-center text-[#9CA3AF]">
              <div className="w-2 h-2 bg-[#10B981] rounded-full mr-3"></div>
              All essential features
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => router.push('/create')}
            className="w-full bg-[#6366F1] text-white py-3 rounded-lg font-semibold hover:bg-[#818CF8] transition-colors"
          >
            Continue with Free Plan
          </button>
          
          <button
            onClick={() => router.push('/upgrade')}
            className="w-full border border-white/20 text-white py-3 rounded-lg font-semibold hover:bg-white/5 transition-colors"
          >
            Learn More About Pro Features
          </button>
        </div>

        {/* Feedback */}
        <div className="bg-[#1F2937] rounded-lg p-6">
          <div className="flex items-center justify-center mb-3">
            <Heart className="w-5 h-5 text-[#F43F5E] mr-2" />
            <span className="text-white font-medium">Help Us Improve</span>
          </div>
          <p className="text-[#9CA3AF] text-sm mb-4">
            What would make you more likely to upgrade in the future?
          </p>
          <button
            onClick={() => {
              // In production, this would open a feedback form or survey
              alert('Thank you! We appreciate your feedback.')
            }}
            className="inline-flex items-center text-[#6366F1] hover:text-[#818CF8] text-sm font-medium transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Share Quick Feedback
          </button>
        </div>
      </div>
    </div>
  )
}