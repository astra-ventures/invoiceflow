"use client";

import { Copy, MessageCircle, MessageSquare, Mail, Printer, Download } from "lucide-react";

interface InvoiceActionsProps {
  invoiceNumber: string;
  fromName: string;
  toName: string;
  toEmail: string;
  toPhone: string;
  total: string;
  dueDate: string;
  stripePaymentLink?: string;
  onCopyReminder: () => void;
  onWhatsApp: () => void;
  onSMS: () => void;
  onEmail: () => void;
  onPrint: () => void;
}

export function InvoiceActions({
  invoiceNumber,
  fromName,
  toName,
  toEmail,
  toPhone,
  total,
  dueDate,
  stripePaymentLink,
  onCopyReminder,
  onWhatsApp,
  onSMS,
  onEmail,
  onPrint,
}: InvoiceActionsProps) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Share & Actions</h3>
        <div className="text-sm text-[#9CA3AF]">
          Total: {total}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Copy Reminder */}
        <button
          onClick={onCopyReminder}
          className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-[#0A0F1E] transition-colors text-left group"
        >
          <div className="w-10 h-10 bg-[#6366F1]/20 text-[#6366F1] rounded-lg flex items-center justify-center group-hover:bg-[#6366F1]/30">
            <Copy className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium text-white">Copy Reminder</div>
            <div className="text-xs text-[#9CA3AF]">Payment reminder text</div>
          </div>
        </button>

        {/* Email */}
        <button
          onClick={onEmail}
          disabled={!toEmail}
          className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-[#0A0F1E] transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 bg-[#10B981]/20 text-[#10B981] rounded-lg flex items-center justify-center group-hover:bg-[#10B981]/30">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium text-white">Email Invoice</div>
            <div className="text-xs text-[#9CA3AF]">
              {toEmail || "No email address"}
            </div>
          </div>
        </button>

        {/* WhatsApp */}
        <button
          onClick={onWhatsApp}
          disabled={!toPhone}
          className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-[#0A0F1E] transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 bg-[#34D399]/20 text-[#34D399] rounded-lg flex items-center justify-center group-hover:bg-[#34D399]/30">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium text-white">WhatsApp</div>
            <div className="text-xs text-[#9CA3AF]">
              {toPhone || "No phone number"}
            </div>
          </div>
        </button>

        {/* SMS */}
        <button
          onClick={onSMS}
          disabled={!toPhone}
          className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-[#0A0F1E] transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 bg-[#6366F1]/20 text-[#6366F1] rounded-lg flex items-center justify-center group-hover:bg-[#6366F1]/30">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium text-white">SMS</div>
            <div className="text-xs text-[#9CA3AF]">
              {toPhone || "No phone number"}
            </div>
          </div>
        </button>
      </div>

      {/* Print/Download Section */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <button
          onClick={onPrint}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#6366F1] hover:bg-[#818CF8] transition-colors text-white"
        >
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Printer className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="font-medium">Print / Download PDF</div>
            <div className="text-xs text-blue-100">Save or print your invoice</div>
          </div>
        </button>
      </div>
    </div>
  );
}