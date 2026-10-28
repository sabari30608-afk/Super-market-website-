import React, { useState } from 'react';
import { RefreshCw, X, ShieldAlert, Package, Check, RotateCcw } from 'lucide-react';
import { Product } from '../types';

interface StoreManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onResetAllStock: () => void;
}

export const StoreManagerModal: React.FC<StoreManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateStock,
  onResetAllStock,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  if (!isOpen) return null;

  const filtered = products.filter((p) => {
    const matchesCat = filterCategory === 'All' || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-[#ff9900] flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Store Manager - Inventory Control</h3>
              <p className="text-xs text-slate-400">Live Inventory Restocking & Low Stock Simulation</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetAllStock}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition"
              title="Reset all items to original stock levels"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-3 items-center justify-between text-xs">
          <input
            type="text"
            placeholder="Search items to restock..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-slate-800 w-full sm:w-64"
          />

          <div className="flex items-center gap-2 overflow-x-auto">
            {['All', 'Fruits', 'Vegetables', 'Groceries', 'Foods', 'Beverages', 'Snacks'].map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  filterCategory === c
                    ? 'bg-[#ff9900] text-slate-950 font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Stock List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {filtered.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-sm text-slate-900 truncate">{item.name}</div>
                  <div className="text-xs text-slate-500">
                    ₹{item.price} / {item.unit} • Category: {item.category}
                  </div>
                </div>
              </div>

              {/* Stock controls */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Current Stock</span>
                  <span
                    className={`font-mono text-sm font-bold ${
                      item.stock === 0
                        ? 'text-rose-600'
                        : item.stock <= 5
                        ? 'text-amber-600'
                        : 'text-emerald-700'
                    }`}
                  >
                    {item.stock} {item.unit}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateStock(item.id, Math.max(0, item.stock - 5))}
                    className="px-2 py-1 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-xs font-bold rounded border border-slate-200 transition"
                    title="Simulate stock reduction (-5)"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => onUpdateStock(item.id, 0)}
                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded border border-rose-200 transition"
                    title="Simulate Out of Stock (0)"
                  >
                    0 (OOS)
                  </button>
                  <button
                    onClick={() => onUpdateStock(item.id, item.stock + 10)}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded border border-emerald-200 transition"
                    title="Restock (+10)"
                  >
                    +10 Stock
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
