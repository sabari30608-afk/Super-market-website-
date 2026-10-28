import React, { useState } from 'react';
import { Eye, Minus, Plus, ShoppingCart, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onQuickView,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const subtotal = product.price * (quantity || 0);

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < Math.max(1, product.stock)) {
      setQuantity(quantity + 1);
    } else {
      // allow selecting more to let stock validation trigger if requested
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val <= 0) {
      setQuantity(1);
    } else {
      setQuantity(val);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product, quantity);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 hover:border-amber-300/80 cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs border border-slate-100">
            {product.category}
          </span>
          {product.organic && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-600 text-white shadow-xs">
              🌿 100% Organic
            </span>
          )}
        </div>

        {/* Stock Badge Overlay */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-md bg-rose-600 text-white shadow-sm flex items-center gap-1">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-500 text-white shadow-sm flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              Low: {product.stock} left
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              In Stock ({product.stock})
            </span>
          )}
        </div>

        {/* Quick View Button Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="px-3.5 py-1.5 bg-white/95 text-slate-900 text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-xs transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            Quick View
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Origin */}
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.rating && (
              <span className="text-xs font-semibold text-amber-500 shrink-0 flex items-center">
                ★ {product.rating.toFixed(1)}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] mb-3 leading-relaxed">
            {product.description}
          </p>

          {/* Unit Price */}
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-xl font-extrabold text-[#0f1111]">
              ₹{product.price}
            </span>
            <span className="text-xs font-medium text-slate-500">
              / {product.unit}
            </span>
          </div>
        </div>

        {/* Interactive Controls & Real-time Subtotal */}
        <div className="pt-3 border-t border-slate-100 space-y-3" onClick={(e) => e.stopPropagation()}>
          {/* Quantity Selector + Real-time Subtotal */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={isOutOfStock || quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="1"
                disabled={isOutOfStock}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-10 h-8 text-center text-xs font-bold text-slate-900 bg-white border-x border-slate-200 outline-none focus:bg-amber-50/50"
              />
              <button
                type="button"
                onClick={handleIncrement}
                disabled={isOutOfStock}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Real-time Subtotal Calculation Display right on card */}
            <div className="text-right">
              <span className="text-[10px] block text-slate-400 font-medium">Subtotal</span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                ₹{product.price} × {quantity} = <span className="text-slate-950 font-extrabold">₹{subtotal}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToCartClick}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-xl border transition-all active:scale-[0.97] ${
                justAdded
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {justAdded ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 text-slate-600" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNowClick}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-[0.97] ${
                isOutOfStock
                  ? 'bg-rose-100 text-rose-700 cursor-not-allowed'
                  : 'bg-[#ff9900] hover:bg-[#f08804] text-slate-950 hover:shadow-md hover:shadow-amber-500/20'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{isOutOfStock ? 'Sold Out' : 'Buy Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
