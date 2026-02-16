"use client";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoicePreviewProps {
  invoiceNumber: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  dueDate: string;
  items: LineItem[];
  taxRate: number;
  notes: string;
  currency: string;
  stripePaymentLink?: string;
}

export function InvoicePreview({
  invoiceNumber,
  fromName,
  fromEmail,
  fromAddress,
  toName,
  toEmail,
  toAddress,
  dueDate,
  items,
  taxRate,
  notes,
  currency,
  stripePaymentLink,
}: InvoicePreviewProps) {
  const currencySymbol: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
  };

  const formatCurrency = (amount: number) => {
    return `${currencySymbol[currency] || currency + " "}${amount.toFixed(2)}`;
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="w-full h-full overflow-auto">
      {/* Invoice Document - White Paper with Shadow */}
      <div className="bg-white rounded-lg shadow-2xl shadow-black/20 p-12 text-gray-900 mx-4 my-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <div className="text-lg text-gray-600">
              Invoice #{invoiceNumber || "INV-001"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Date</div>
            <div className="text-lg font-semibold">
              {new Date().toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500 mb-1 mt-4">Due Date</div>
            <div className="text-lg font-semibold">
              {dueDate ? new Date(dueDate).toLocaleDateString() : "—"}
            </div>
          </div>
        </div>

        {/* From/To Section */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              From
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">
                {fromName || "Your Business Name"}
              </div>
              {fromEmail && (
                <div className="text-gray-600">{fromEmail}</div>
              )}
              {fromAddress && (
                <div className="text-gray-600 whitespace-pre-line">
                  {fromAddress}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Bill To
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">
                {toName || "Client Name"}
              </div>
              {toEmail && (
                <div className="text-gray-600">{toEmail}</div>
              )}
              {toAddress && (
                <div className="text-gray-600 whitespace-pre-line">
                  {toAddress}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Description
                </th>
                <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Qty
                </th>
                <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Rate
                </th>
                <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {items.filter(item => item.description).map((item, index) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-4 text-gray-900">
                    {item.description}
                  </td>
                  <td className="text-right py-4 text-gray-700">
                    {item.quantity || 1}
                  </td>
                  <td className="text-right py-4 text-gray-700">
                    {formatCurrency(item.unitPrice || 0)}
                  </td>
                  <td className="text-right py-4 font-semibold text-gray-900">
                    {formatCurrency((item.quantity || 1) * (item.unitPrice || 0))}
                  </td>
                </tr>
              ))}
              
              {/* Empty state */}
              {items.filter(item => item.description).length === 0 && (
                <tr>
                  <td className="py-8 text-center text-gray-400" colSpan={4}>
                    <div className="space-y-2">
                      <div className="text-lg">📝</div>
                      <div>Add line items to see your invoice</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Tax ({taxRate}%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Link */}
        {stripePaymentLink && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">💳</span>
              </div>
              <span className="font-semibold text-blue-800">
                Pay Online
              </span>
            </div>
            <div className="text-blue-700 text-sm break-all">
              {stripePaymentLink}
            </div>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div className="border-t border-gray-200 pt-8">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Notes
            </div>
            <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
              {notes}
            </div>
          </div>
        )}

        {/* Thank You */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <div className="text-2xl font-light text-gray-600">
            Thank you for your business!
          </div>
        </div>
      </div>
    </div>
  );
}