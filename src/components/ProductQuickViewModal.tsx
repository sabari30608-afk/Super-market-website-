import React, { useState, useEffect } from 'react';
import { Minus, Plus, ShoppingCart, X, Zap, ShieldCheck, Truck, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setJustAdded(false);
  }, [product]);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const subtotal = product.price * (quantity || 0);

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-white/80 rounded-full hover:bg-slate-100 transition shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image */}
          <div className="relative bg-slate-100 aspect-square md:aspect-auto flex items-center justify-center p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-xs text-xs font-bold rounded-full text-slate-800 shadow-xs">
                {product.category}
              </span>
              {product.organic && (
                <span className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-extrabold rounded-full shadow-xs">
                  🌿 100% Organic Certified
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Origin: {product.origin || 'South India'}</span>
                <span className="text-amber-500 font-bold">★ {product.rating || 4.8} / 5.0</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1111] tracking-tight mb-2">
                {product.name}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Price & Unit */}
              <div className="flex items-baseline gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-3xl font-black text-[#0f1111]">₹{product.price}</span>
                <span className="text-sm font-semibold text-slate-500">per {product.unit}</span>
                <span className="ml-auto text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Stock Inventory Tracker */}
              <div className="mb-6 p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Inventory Status:</span>
                  {isOutOfStock ? (
                    <span className="font-bold text-rose-600 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Low Stock ({product.stock} {product.unit} remaining)
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-600">
                      In Stock ({product.stock} {product.unit} available)
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOutOfStock ? 'w-0' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (product.stock / (product.initialStock || 40)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Subtotal & Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Select Quantity</span>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden mt-1 shadow-2xs">
                    <button
                      onClick={handleDecrement}
                      disabled={isOutOfStock || quantity <= 1}
                      className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      disabled={isOutOfStock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-12 h-9 text-center font-bold text-sm bg-white border-x border-slate-200 outline-none"
                    />
                    <button
                      onClick={handleIncrement}
                      disabled={isOutOfStock}
                      className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Live Total</span>
                  <span className="text-2xl font-black text-[#0f1111] font-mono">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-bold text-sm transition-all active:scale-[0.98] ${
                    justAdded
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {justAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98] ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-[#ff9900] hover:bg-[#e68a00] text-slate-950 shadow-amber-500/20'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  {isOutOfStock ? 'Sold Out' : 'Buy Now'}
                </button>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-100 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-slate-600" />
                  <span>Free Over ₹400</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Quality Assured</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className="w-4 h-4 text-amber-600" />
                  <span>Daily Restock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
