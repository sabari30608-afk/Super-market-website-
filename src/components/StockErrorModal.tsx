import React from 'react';
import { AlertCircle, ArrowRight, PackageX, X } from 'lucide-react';

interface StockErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  requestedQty: number;
  availableStock: number;
  unit: string;
  onAdjustQuantity?: (maxQty: number) => void;
}

export const StockErrorModal: React.FC<StockErrorModalProps> = ({
  isOpen,
  onClose,
  productName,
  requestedQty,
  availableStock,
  unit,
  onAdjustQuantity,
}) => {
  if (!isOpen) return null;

  const isOutOfStock = availableStock <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden text-center p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="mx-auto w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-rose-50/50">
          <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            {isOutOfStock ? <PackageX className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
        </div>

        {/* Error Header */}
        <h2 className="text-xl font-extrabold text-[#0f1111] tracking-tight mb-1">
          Sorry, requested quantity is not available.
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {isOutOfStock
            ? `"${productName}" is currently completely out of stock.`
            : `We cannot fulfill your request for "${productName}" due to current inventory limits.`}
        </p>

        {/* Comparison Box */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 text-left space-y-3 mb-6">
          <div className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
            Stock Inventory Discrepancy
          </div>

          <div className="flex justify-between items-center text-sm py-1 border-b border-rose-100">
            <span className="text-slate-600">Requested Quantity:</span>
            <span className="font-bold text-rose-600">
              {requestedQty} {unit}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm py-1">
            <span className="text-slate-600">Current Available Stock:</span>
            <span
              className={`font-bold ${
                availableStock > 0 ? 'text-amber-700 font-semibold' : 'text-slate-400'
              }`}
            >
              {availableStock} {unit}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {availableStock > 0 && onAdjustQuantity ? (
            <button
              onClick={() => {
                onAdjustQuantity(availableStock);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0f1111] hover:bg-slate-800 text-white font-semibold rounded-xl transition shadow-sm active:scale-[0.98]"
            >
              <span>Buy available max ({availableStock} {unit})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition active:scale-[0.98]"
          >
            Adjust Selection
          </button>
        </div>
      </div>
    </div>
  );
};
