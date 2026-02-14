"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AppNavbar } from "@/app/_components/AppNavbar";
import {
  getBusinessInfo,
  saveBusinessInfo,
  type BusinessInfo,
} from "@/lib/storage";

export default function SettingsPage() {
  const [info, setInfo] = useState<BusinessInfo>({
    name: "",
    email: "",
    address: "",
    phone: "",
    paymentTerms: "net_30",
    lateFeePercent: 1.5,
    defaultNotes: "",
    logo: "",
    brandColor: "#2563eb",
    website: "",
  });
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = getBusinessInfo();
    if (saved) {
      setInfo({ ...info, ...saved });
    }
  }, []);

  const handleSave = () => {
    saveBusinessInfo(info);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 500KB)
    if (file.size > 500 * 1024) {
      alert("Logo must be less than 500KB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setInfo({ ...info, logo: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setInfo({ ...info, logo: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <AppNavbar />

      <main className="max-w-2xl mx-auto px-6 py-8 pt-24">
        <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

        {/* Business Info */}
        <div className="bg-[#111827] rounded-xl border border-white/10 p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">Business Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                placeholder="Your Business Name"
                className="w-full px-4 py-2 rounded-lg border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-1">Email</label>
                <input
                  type="email"
                  value={info.email}
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  placeholder="billing@example.com"
                  className="w-full px-4 py-2 rounded-lg border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-1">Phone</label>
                <input
                  type="tel"
                  value={info.phone || ""}
                  onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2 rounded-lg border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-1">Address</label>
              <textarea
                value={info.address}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
                placeholder="123 Business St&#10;City, State 12345"
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-1">Website</label>
              <input
                type="url"
                value={info.website || ""}
                onChange={(e) => setInfo({ ...info, website: e.target.value })}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-2 rounded-lg border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-[#111827] rounded-xl border border-white/10 p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">Branding</h2>
          <div className="space-y-4">
            {/* Logo */}
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">
                Company Logo
              </label>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center bg-[#0A0F1E] overflow-hidden">
                  {info.logo ? (
                    <img
                      src={info.logo}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-3xl text-slate-300">📷</span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-block bg-[#111827] border border-white/10 px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-[#0A0F1E] cursor-pointer transition"
                  >
                    Upload Logo
                  </label>
                  {info.logo && (
                    <button
                      onClick={removeLogo}
                      className="ml-2 text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                  <p className="text-xs text-[#9CA3AF] mt-2">
                    PNG, JPG, or SVG. Max 500KB. Square logos work best.
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Color */}
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">
                Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={info.brandColor || "#2563eb"}
                  onChange={(e) => setInfo({ ...info, brandColor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border border-white/10"
                />
                <input
                  type="text"
                  value={info.brandColor || "#2563eb"}
                  onChange={(e) => setInfo({ ...info, brandColor: e.target.value })}
                  placeholder="#2563eb"
                  className="w-32 px-3 py-2 rounded-lg border border-white/10 text-sm font-mono"
                />
                <span className="text-sm text-[#9CA3AF]">
                  Used for invoice accents
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Defaults */}
        <div className="bg-[#111827] rounded-xl border border-white/10 p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">Invoice Defaults</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-1">
                  Default Payment Terms
                </label>
                <select
                  value={info.paymentTerms || "net_30"}
                  onChange={(e) =>
                    setInfo({ ...info, paymentTerms: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-white/10 focus:border-blue-500 outline-none"
                >
                  <option value="due_on_receipt">Due on Receipt</option>
                  <option value="net_15">Net 15</option>
                  <option value="net_30">Net 30</option>
                  <option value="net_60">Net 60</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-1">
                  Default Late Fee (%)
                </label>
                <input
                  type="number"
                  value={info.lateFeePercent || 1.5}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      lateFeePercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  max="10"
                  step="0.5"
                  className="w-full px-4 py-2 rounded-lg border border-white/10 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-1">
                Default Notes
              </label>
              <textarea
                value={info.defaultNotes || ""}
                onChange={(e) =>
                  setInfo({ ...info, defaultNotes: e.target.value })
                }
                placeholder="Thank you for your business!&#10;Payment methods: Bank transfer, PayPal, Stripe"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              />
              <p className="text-xs text-[#9CA3AF] mt-1">
                These notes will be pre-filled on new invoices.
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-[#111827] rounded-xl border border-white/10 p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">Preview</h2>
          <div className="border border-white/10 rounded-lg p-6 bg-[#0A0F1E]">
            <div className="flex items-center gap-4 mb-4">
              {info.logo && (
                <img
                  src={info.logo}
                  alt="Logo"
                  className="w-16 h-16 object-contain"
                />
              )}
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: info.brandColor || "#2563eb" }}
                >
                  {info.name || "Your Business Name"}
                </h3>
                <p className="text-sm text-[#9CA3AF]">{info.email}</p>
              </div>
            </div>
            <div
              className="h-2 rounded-full w-full"
              style={{ backgroundColor: info.brandColor || "#2563eb" }}
            />
            <p className="text-xs text-slate-400 mt-4 text-center">
              This is how your invoices will look
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-[#6366F1] text-white px-8 py-3 rounded-lg hover:bg-[#818CF8] transition flex items-center gap-2"
          >
            {saved ? (
              <>✓ Saved!</>
            ) : (
              <>Save Settings</>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
