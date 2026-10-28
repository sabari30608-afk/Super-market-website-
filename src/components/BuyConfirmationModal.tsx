import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Receipt, ShoppingBag, X } from 'lucide-react';

interface BuyConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  orderId?: string;
  onViewReceipt: () => void;
  onContinueShopping: () => void;
}

export const BuyConfirmationModal: React.FC<BuyConfirmationModalProps> = ({
  isOpen,
  onClose,
  productName,
  quantity,
  unit,
  totalAmount,
  orderId,
  onViewReceipt,
  onContinueShopping,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff9900', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-center p-6 sm:p-8">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-amber-50/50">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-extrabold text-[#0f1111] tracking-tight mb-1">
          Thanks for buying! 🎉
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Your order has been placed & inventory deducted in real-time.
        </p>

        {/* Order Details Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-left space-y-3 mb-6">
          <div className="flex justify-between items-center text-xs text-slate-500 pb-2 border-b border-slate-200">
            <span>Order Reference</span>
            <span className="font-mono font-semibold text-slate-700">
              {orderId || `KDG-${Math.floor(100000 + Math.random() * 900000)}`}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Product:</span>
            <span className="font-bold text-slate-900">{productName}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Quantity Purchased:</span>
            <span className="font-semibold text-slate-800">
              {quantity} {unit}
            </span>
          </div>

          <div className="flex justify-between items-center text-base pt-2 border-t border-slate-200">
            <span className="font-bold text-slate-900">Total Paid:</span>
            <span className="font-extrabold text-xl text-[#0f1111]">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onClose();
              onViewReceipt();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#ff9900] hover:bg-[#e68a00] text-slate-950 font-bold rounded-xl transition shadow-md shadow-amber-500/20 active:scale-[0.98]"
          >
            <Receipt className="w-4 h-4" />
            View & Print Official Receipt
          </button>

          <button
            onClick={() => {
              onClose();
              onContinueShopping();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
