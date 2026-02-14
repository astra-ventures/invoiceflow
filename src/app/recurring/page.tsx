"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Crown, Lock, Zap } from "lucide-react";
import { hasProAccess } from "@/lib/stripe";
import { AppNavbar } from "@/app/_components/AppNavbar";
import {
  getRecurringInvoices,
  saveRecurringInvoice,
  updateRecurringInvoice,
  deleteRecurringInvoice,
  getClients,
  getNextRecurringDate,
  type RecurringInvoice,
  type Client,
} from "@/lib/storage";

export default function RecurringPage() {
  const [isPro, setIsPro] = useState(false);
  const [recurring, setRecurring] = useState<RecurringInvoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    clientId: "",
    clientName: "",
    clientEmail: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    currency: "USD",
    taxRate: 0,
    notes: "",
    frequency: "monthly" as RecurringInvoice["frequency"],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    paymentTerms: "net_30",
    includeLateFee: true,
    lateFeePercent: 1.5,
  });

  useEffect(() => {
    setIsPro(hasProAccess());
    if (hasProAccess()) {
      setRecurring(getRecurringInvoices());
      setClients(getClients());
    }
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      clientId: "",
      clientName: "",
      clientEmail: "",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      currency: "USD",
      taxRate: 0,
      notes: "",
      frequency: "monthly",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      paymentTerms: "net_30",
      includeLateFee: true,
      lateFeePercent: 1.5,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setFormData({
        ...formData,
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
      });
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, unitPrice: 0 }],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    }
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setFormData({
      ...formData,
      items: formData.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleSave = () => {
    if (!formData.clientName || formData.items.every((i) => !i.description)) {
      alert("Please fill in client name and at least one line item");
      return;
    }

    const startDate = new Date(formData.startDate);
    const nextDueDate = getNextRecurringDate(formData.frequency, startDate);

    if (editingId) {
      updateRecurringInvoice(editingId, {
        ...formData,
        nextDueDate: nextDueDate.toISOString(),
        endDate: formData.endDate || undefined,
      });
      setRecurring(
        recurring.map((r) =>
          r.id === editingId
            ? { ...r, ...formData, nextDueDate: nextDueDate.toISOString() }
            : r
        )
      );
    } else {
      const newRecurring = saveRecurringInvoice({
        ...formData,
        nextDueDate: nextDueDate.toISOString(),
        endDate: formData.endDate || undefined,
        isActive: true,
      });
      setRecurring([newRecurring, ...recurring]);
    }

    resetForm();
  };

  const handleEdit = (rec: RecurringInvoice) => {
    setFormData({
      name: rec.name,
      clientId: rec.clientId,
      clientName: rec.clientName,
      clientEmail: rec.clientEmail || "",
      items: rec.items,
      currency: rec.currency,
      taxRate: rec.taxRate,
      notes: rec.notes || "",
      frequency: rec.frequency,
      startDate: rec.startDate.split("T")[0],
      endDate: rec.endDate?.split("T")[0] || "",
      paymentTerms: rec.paymentTerms,
      includeLateFee: rec.includeLateFee,
      lateFeePercent: rec.lateFeePercent,
    });
    setEditingId(rec.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this recurring invoice?")) {
      deleteRecurringInvoice(id);
      setRecurring(recurring.filter((r) => r.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    const rec = recurring.find((r) => r.id === id);
    if (rec) {
      updateRecurringInvoice(id, { isActive: !rec.isActive });
      setRecurring(
        recurring.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
      );
    }
  };

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      weekly: "Weekly",
      biweekly: "Every 2 Weeks",
      monthly: "Monthly",
      quarterly: "Quarterly",
      yearly: "Yearly",
    };
    return labels[freq] || freq;
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    return subtotal * (1 + formData.taxRate / 100);
  };

  const currencySymbol: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
  };

  // Pro Gate - Show upgrade prompt if not Pro
  if (!isPro) {
    return (
      <div className="min-h-screen bg-[#0A0F1E]">
        <AppNavbar />
        
        <div className="pt-24 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-[#6366F1]/20 text-[#6366F1] rounded-full flex items-center justify-center mx-auto mb-8">
              <Crown className="w-10 h-10" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Recurring Invoice Automation
            </h1>
            <p className="text-xl text-[#9CA3AF] mb-8 max-w-2xl mx-auto">
              Set up automated recurring invoices and never manually send the same invoice twice. 
              Perfect for subscriptions, retainers, and ongoing services.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
                <div className="w-12 h-12 bg-[#6366F1]/20 text-[#6366F1] rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Auto-Generated</h3>
                <p className="text-sm text-[#9CA3AF]">Invoices created automatically based on your schedule</p>
              </div>
              
              <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
                <div className="w-12 h-12 bg-[#10B981]/20 text-[#10B981] rounded-lg flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Client Templates</h3>
                <p className="text-sm text-[#9CA3AF]">Save recurring templates for each client</p>
              </div>
              
              <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
                <div className="w-12 h-12 bg-[#F59E0B]/20 text-[#F59E0B] rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Reminders</h3>
                <p className="text-sm text-[#9CA3AF]">Automatic email reminders with payment links</p>
              </div>
            </div>

            <Link
              href="/upgrade"
              className="inline-flex items-center gap-2 bg-[#6366F1] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#818CF8] hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all"
            >
              <Crown className="w-5 h-5" />
              Upgrade to Pro ($12/month)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <AppNavbar />
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Invoice<span className="text-blue-600">Flow</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/create" className="text-slate-600 hover:text-slate-900">
              Create
            </Link>
            <Link href="/history" className="text-slate-600 hover:text-slate-900">
              History
            </Link>
            <Link href="/time" className="text-slate-600 hover:text-slate-900">
              Time
            </Link>
            <span className="text-blue-600 font-medium">Recurring</span>
            <Link href="/analytics" className="text-slate-600 hover:text-slate-900">
              Analytics
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Recurring Invoices</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Recurring
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <h2 className="font-semibold text-slate-900 mb-4">
              {editingId ? "Edit" : "New"} Recurring Invoice
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Monthly Retainer"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-600 mb-1">Client</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select client or type below</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {!formData.clientId && (
                  <>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) =>
                          setFormData({ ...formData, clientName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">
                        Client Email
                      </label>
                      <input
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, clientEmail: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Frequency
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          frequency: e.target.value as RecurringInvoice["frequency"],
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Every 2 Weeks</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD (C$)</option>
                      <option value="AUD">AUD (A$)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      End Date (optional)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Line Items */}
              <div className="space-y-4">
                <label className="block text-sm text-slate-600">Line Items</label>
                {formData.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      placeholder="Description"
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(idx, "quantity", parseFloat(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                      placeholder="Qty"
                    />
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)
                      }
                      className="w-24 px-2 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                      placeholder="Price"
                    />
                    {formData.items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addItem}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add Item
                </button>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Tax Rate (%)</span>
                    <input
                      type="number"
                      value={formData.taxRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          taxRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-2 py-1 rounded border border-slate-200 text-right text-sm"
                    />
                  </div>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total per Invoice</span>
                    <span>
                      {currencySymbol[formData.currency] || formData.currency}
                      {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {editingId ? "Save Changes" : "Create Recurring"}
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {recurring.length === 0 && !showForm ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No recurring invoices yet
            </h3>
            <p className="text-slate-500 mb-6">
              Set up recurring invoices for retainers, subscriptions, or regular
              services.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First Recurring Invoice
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recurring.map((rec) => {
              const total = rec.items.reduce(
                (sum, i) => sum + i.quantity * i.unitPrice,
                0
              );
              return (
                <div
                  key={rec.id}
                  className={`bg-white rounded-lg border p-4 ${
                    rec.isActive ? "border-slate-200" : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {rec.name || rec.clientName}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            rec.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {rec.isActive ? "Active" : "Paused"}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        {rec.clientName} • {getFrequencyLabel(rec.frequency)} •
                        Next:{" "}
                        {new Date(rec.nextDueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <div className="font-semibold text-slate-900">
                        {currencySymbol[rec.currency] || rec.currency}
                        {total.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {rec.generatedCount} sent
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleActive(rec.id)}
                        className={`p-2 rounded hover:bg-slate-100 transition ${
                          rec.isActive ? "text-green-600" : "text-slate-400"
                        }`}
                        title={rec.isActive ? "Pause" : "Activate"}
                      >
                        {rec.isActive ? "⏸" : "▶"}
                      </button>
                      <button
                        onClick={() => handleEdit(rec)}
                        className="p-2 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="p-2 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            📅 How Recurring Invoices Work
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              • Recurring invoices are templates that generate actual invoices on
              schedule
            </li>
            <li>
              • Generated invoices appear in your History and can be edited before
              sending
            </li>
            <li>
              • You&apos;ll receive a notification when a recurring invoice is due
            </li>
            <li>
              • Pause anytime without losing your setup — just click the pause
              button
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
