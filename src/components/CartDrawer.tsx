import React, { useState } from 'react';
import { Minus, Plus, Trash2, X, ShoppingBag, ArrowRight, Tag, Check, Truck, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (couponCode: string | null, discountAmount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Free delivery threshold: ₹400
  const FREE_DELIVERY_THRESHOLD = 400;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : 40;
  const neededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  // Discounts
  let discountRate = 0;
  if (appliedCoupon === 'KAADUGAL20') discountRate = 0.2;
  else if (appliedCoupon === 'COLLEGE10') discountRate = 0.1;

  const discountAmount = subtotal * discountRate;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  // 5% GST Tax
  const tax = discountedSubtotal * 0.05;
  const grandTotal = subtotal > 0 ? discountedSubtotal + tax + deliveryFee : 0;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    if (code === 'KAADUGAL20') {
      setAppliedCoupon('KAADUGAL20');
      setCouponError(null);
      setCouponInput('');
    } else if (code === 'COLLEGE10') {
      setAppliedCoupon('COLLEGE10');
      setCouponError(null);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try KAADUGAL20 or COLLEGE10');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const handleCheckoutClick = () => {
    onCheckout(appliedCoupon, discountAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">
              Shopping Cart
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-700">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Bar */}
        <div className="px-4 py-3 bg-amber-50/70 border-b border-amber-100 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-600" />
              {isFreeDelivery
                ? '🎉 Congratulations! You have unlocked FREE Delivery.'
                : `Add ₹${neededForFreeDelivery} more to get FREE Delivery!`}
            </span>
          </div>
          <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#ff9900] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-base text-slate-700 mb-1">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Explore our fresh fruits, vegetables, groceries, and bakery foods to add items.
              </p>
              <button
                onClick={onClose}
                className="py-2.5 px-6 bg-[#0f1111] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => {
              const itemTotal = product.price * quantity;
              const isOverStock = quantity > product.stock;

              return (
                <div
                  key={product.id}
                  className={`flex gap-3 p-3 rounded-xl border transition-all ${
                    isOverStock
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Thumbnail */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-100"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {product.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          ₹{product.price} / {product.unit}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isOverStock && (
                      <div className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold">
                        <AlertCircle className="w-3 h-3" />
                        Only {product.stock} left in stock!
                      </div>
                    )}

                    {/* Quantity & Row Total */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-slate-900 font-mono">
                        ₹{itemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Voucher & Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 space-y-4">
            {/* Promo Voucher */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Coupon Applied: {appliedCoupon}</span>
                    <span className="text-emerald-600">
                      ({appliedCoupon === 'KAADUGAL20' ? '20% OFF' : '10% OFF'})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-rose-600 hover:text-rose-800 font-bold text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl uppercase font-mono font-semibold placeholder:font-normal placeholder:capitalize focus:border-amber-500 outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                    >
                      Apply
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-medium pl-1">{couponError}</p>
                  )}

                  {/* Quick coupon buttons */}
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span>Try:</span>
                    <button
                      onClick={() => handleApplyCoupon('KAADUGAL20')}
                      className="px-2 py-0.5 bg-white border border-dashed border-amber-400 text-amber-800 font-mono font-bold rounded hover:bg-amber-50 transition"
                    >
                      KAADUGAL20
                    </button>
                    <button
                      onClick={() => handleApplyCoupon('COLLEGE10')}
                      className="px-2 py-0.5 bg-white border border-dashed border-amber-400 text-amber-800 font-mono font-bold rounded hover:bg-amber-50 transition"
                    >
                      COLLEGE10
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bill Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-slate-800">₹{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedCoupon}):</span>
                  <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>GST Tax (5%):</span>
                <span className="font-mono font-semibold text-slate-800">₹{tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    `₹${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-[#0f1111] pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="font-mono text-lg text-emerald-700">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleCheckoutClick}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#ff9900] hover:bg-[#e68a00] text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
