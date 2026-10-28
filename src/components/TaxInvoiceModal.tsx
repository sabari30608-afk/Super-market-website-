import React from 'react';
import { Download, Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { Invoice } from '../types';
import { Logo } from './Logo';

interface TaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const textReceipt = `
======================================================
                 kaadugal SUPERMARKET
        Fresh Groceries, Produce & Daily Staples
        GSTIN: ${invoice.gstin} | Ph: 1800-425-425
        No. 42, Anna Salai, Chennai, TN - 600002
======================================================
TAX INVOICE / CASH MEMO
------------------------------------------------------
Invoice No   : ${invoice.orderId}
Date & Time  : ${invoice.date}
Customer     : ${invoice.customerName} (${invoice.customerRole})
Payment Mode : ${invoice.paymentMethod}
------------------------------------------------------
ITEMS PURCHASED:
${invoice.items
  .map(
    (item, index) =>
      `${index + 1}. ${item.name.padEnd(20)} ${item.quantity.toString().padStart(2)} ${item.unit.padEnd(6)} @ ₹${item.price.toFixed(2)}  = ₹${item.subtotal.toFixed(2)}`
  )
  .join('\n')}
------------------------------------------------------
Subtotal          : ₹${invoice.subtotal.toFixed(2)}
Discount          : -₹${invoice.discount.toFixed(2)} ${invoice.couponCode ? `(${invoice.couponCode})` : ''}
GST Tax (5%)      : ₹${invoice.tax.toFixed(2)}
Delivery Charge   : ${invoice.deliveryFee === 0 ? 'FREE' : `₹${invoice.deliveryFee.toFixed(2)}`}
======================================================
NET TOTAL PAYABLE : ₹${invoice.total.toFixed(2)}
======================================================
Thank you for shopping at kaadugal!
Save nature. Support organic and fresh farm produce.
College Academic Demonstration System - Java OOP & MySQL
`;

    const blob = new Blob([textReceipt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kaadugal-Invoice-${invoice.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Official Supermarket Tax Invoice</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff9900] hover:bg-[#e68a00] text-slate-950 text-xs font-bold rounded-lg transition"
              title="Download text receipt"
            >
              <Download className="w-3.5 h-3.5" />
              Download .TXT
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-white text-slate-900">
          {/* Supermarket Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
            <div>
              <Logo size="md" />
              <p className="text-xs text-slate-500 mt-1">
                No. 42 Anna Salai, Chennai, Tamil Nadu - 600002
              </p>
              <p className="text-xs text-slate-500">
                GSTIN: <span className="font-mono font-semibold">{invoice.gstin}</span> | FSSAI: 12421008000412
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
                PAID & VERIFIED
              </span>
              <p className="font-mono text-xs text-slate-500">Invoice: #{invoice.orderId}</p>
              <p className="text-xs text-slate-500">{invoice.date}</p>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-100 bg-slate-50/60 -mx-6 px-6">
            <div>
              <span className="text-slate-400 block font-medium">Billed To:</span>
              <span className="font-bold text-slate-800 text-sm">{invoice.customerName}</span>
              <span className="text-slate-500 block text-xs">Role: {invoice.customerRole}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block font-medium">Payment Mode:</span>
              <span className="font-semibold text-slate-800">{invoice.paymentMethod}</span>
              <span className="text-emerald-600 block flex items-center justify-end gap-1 font-medium">
                <CheckCircle className="w-3 h-3 inline" /> Real-time Stock Deducted
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">#</th>
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id} className="text-slate-700">
                    <td className="py-2.5 text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 font-medium text-slate-900">{item.name}</td>
                    <td className="py-2.5 text-right font-mono">₹{item.price.toFixed(2)}</td>
                    <td className="py-2.5 text-center font-mono">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2.5 text-right font-semibold font-mono text-slate-900">
                      ₹{item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Summary */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="w-full sm:w-72 ml-auto space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-mono font-medium">₹{invoice.subtotal.toFixed(2)}</span>
              </div>

              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({invoice.couponCode}):</span>
                  <span className="font-mono">-₹{invoice.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>GST Tax (5%):</span>
                <span className="font-mono font-medium">₹{invoice.tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge:</span>
                <span className="font-mono font-medium">
                  {invoice.deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-semibold">FREE (Order &gt; ₹400)</span>
                  ) : (
                    `₹${invoice.deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-[#0f1111] pt-3 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="font-mono text-lg text-emerald-700">
                  ₹{invoice.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Barcode & Footer Notice */}
          <div className="mt-8 pt-6 border-t border-dashed border-slate-200 text-center space-y-2">
            <div className="flex justify-center items-center gap-1 font-mono tracking-widest text-xs text-slate-400">
              ||||| | ||||| || |||||| | |||| |||||||| |||||
            </div>
            <p className="text-[11px] text-slate-400">
              kaadugal Supermarket • Developed by Rajasabari.P (sabari30608@gmail.com) • Java OOP Architecture
            </p>
          </div>
        </div>

        {/* Modal footer close button */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
