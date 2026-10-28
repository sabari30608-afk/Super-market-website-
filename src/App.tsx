import { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Clock,
  ShieldCheck,
  Truck,
  Code2,
  RefreshCcw,
  ChevronRight,
  Database,
  Terminal,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from './data/products';
import { USER_PROFILES } from './data/users';
import { Product, CategoryName, CartItem, UserProfile, Invoice } from './types';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { BuyConfirmationModal } from './components/BuyConfirmationModal';
import { StockErrorModal } from './components/StockErrorModal';
import { TaxInvoiceModal } from './components/TaxInvoiceModal';
import { ProjectHubModal } from './components/ProjectHubModal';
import { StoreManagerModal } from './components/StoreManagerModal';
import { Logo } from './components/Logo';

export default function App() {
  // State: Products Inventory (allows real-time deduction & restocking)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kaadugal_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // State: Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | 'All Items'>('All Items');
  const [searchQuery, setSearchQuery] = useState('');

  // State: Shopping Cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kaadugal_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State: Current User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(USER_PROFILES[0]);

  // State: Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isProjectHubOpen, setIsProjectHubOpen] = useState(false);
  const [isStoreManagerOpen, setIsStoreManagerOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // State: Buy Now Confirmation Modal
  const [celebrationModalData, setCelebrationModalData] = useState<{
    isOpen: boolean;
    productName: string;
    quantity: number;
    unit: string;
    totalAmount: number;
    orderId: string;
  }>({
    isOpen: false,
    productName: '',
    quantity: 1,
    unit: 'kg',
    totalAmount: 0,
    orderId: '',
  });

  // State: Stock Error Modal
  const [stockErrorData, setStockErrorData] = useState<{
    isOpen: boolean;
    productName: string;
    requestedQty: number;
    availableStock: number;
    unit: string;
  }>({
    isOpen: false,
    productName: '',
    requestedQty: 1,
    availableStock: 0,
    unit: 'kg',
  });

  // Save state helpers
  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('kaadugal_products', JSON.stringify(newProducts));
    } catch (e) {
      console.error(e);
    }
  };

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    try {
      localStorage.setItem('kaadugal_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error(e);
    }
  };

  // Product Counts by Category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'All Items' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart Metrics
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Add to Cart Handler
  const handleAddToCart = (product: Product, quantity: number) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    if (existing) {
      const updated = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      updateCart(updated);
    } else {
      updateCart([...cartItems, { product, quantity }]);
    }
  };

  // Update Cart Quantity
  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      updateCart(cartItems.filter((i) => i.product.id !== productId));
    } else {
      updateCart(
        cartItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Remove from Cart
  const handleRemoveCartItem = (productId: string) => {
    updateCart(cartItems.filter((i) => i.product.id !== productId));
  };

  // Clear Cart
  const handleClearCart = () => {
    updateCart([]);
  };

  // Buy Now Handler with Stock Validation
  const handleBuyNow = (product: Product, requestedQty: number) => {
    // 1. Fetch latest product from state
    const currentProduct = products.find((p) => p.id === product.id) || product;

    // 2. Validate Stock
    if (requestedQty > currentProduct.stock || currentProduct.stock <= 0) {
      setStockErrorData({
        isOpen: true,
        productName: currentProduct.name,
        requestedQty,
        availableStock: currentProduct.stock,
        unit: currentProduct.unit,
      });
      return;
    }

    // 3. Calculate total & deduct stock in real-time
    const totalAmount = currentProduct.price * requestedQty;
    const updatedStock = currentProduct.stock - requestedQty;

    const newProducts = products.map((p) =>
      p.id === currentProduct.id ? { ...p, stock: updatedStock } : p
    );
    updateProducts(newProducts);

    // Also update cart if this item was in the cart
    const updatedCart = cartItems.map((c) =>
      c.product.id === currentProduct.id
        ? { ...c, product: { ...c.product, stock: updatedStock } }
        : c
    );
    updateCart(updatedCart);

    // 4. Generate Order ID & Invoice
    const orderId = `KDG-${Math.floor(100000 + Math.random() * 900000)}`;
    const tax = totalAmount * 0.05;
    const delivery = totalAmount >= 400 ? 0 : 40;

    const invoice: Invoice = {
      orderId,
      date: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      customerName: currentUser.name,
      customerRole: currentUser.role,
      items: [
        {
          id: currentProduct.id,
          name: currentProduct.name,
          price: currentProduct.price,
          unit: currentProduct.unit,
          quantity: requestedQty,
          subtotal: totalAmount,
        },
      ],
      subtotal: totalAmount,
      discount: 0,
      tax,
      deliveryFee: delivery,
      total: totalAmount + tax + delivery,
      paymentMethod: 'Instant UPI / Card',
      storeName: 'kaadugal Supermarket',
      gstin: '33AAAAA0000A1Z5',
    };

    setCurrentInvoice(invoice);

    // Close quick view if open
    setQuickViewProduct(null);

    // 5. Open Celebration Confirmation Popup
    setCelebrationModalData({
      isOpen: true,
      productName: currentProduct.name,
      quantity: requestedQty,
      unit: currentProduct.unit,
      totalAmount: totalAmount + tax + delivery,
      orderId,
    });
  };

  // Cart Checkout Handler with Full Inventory Validation
  const handleCartCheckout = (couponCode: string | null, discountAmount: number) => {
    // 1. Verify all cart items against live stock
    for (const item of cartItems) {
      const liveProduct = products.find((p) => p.id === item.product.id);
      if (!liveProduct || item.quantity > liveProduct.stock) {
        setIsCartOpen(false);
        setStockErrorData({
          isOpen: true,
          productName: item.product.name,
          requestedQty: item.quantity,
          availableStock: liveProduct ? liveProduct.stock : 0,
          unit: item.product.unit,
        });
        return;
      }
    }

    // 2. All items valid! Deduct stock for all items
    const newProducts = products.map((prod) => {
      const inCart = cartItems.find((i) => i.product.id === prod.id);
      if (inCart) {
        return { ...prod, stock: prod.stock - inCart.quantity };
      }
      return prod;
    });
    updateProducts(newProducts);

    // 3. Compute final bill
    const orderId = `KDG-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = cartSubtotal;
    const discounted = Math.max(0, subtotal - discountAmount);
    const tax = discounted * 0.05;
    const delivery = subtotal >= 400 || subtotal === 0 ? 0 : 40;
    const finalTotal = discounted + tax + delivery;

    const invoice: Invoice = {
      orderId,
      date: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      customerName: currentUser.name,
      customerRole: currentUser.role,
      items: cartItems.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        unit: i.product.unit,
        quantity: i.quantity,
        subtotal: i.product.price * i.quantity,
      })),
      subtotal,
      discount: discountAmount,
      couponCode: couponCode || undefined,
      tax,
      deliveryFee: delivery,
      total: finalTotal,
      paymentMethod: 'Prepaid (Card / UPI)',
      storeName: 'kaadugal Supermarket',
      gstin: '33AAAAA0000A1Z5',
    };

    setCurrentInvoice(invoice);

    // Clear cart & close drawer
    updateCart([]);
    setIsCartOpen(false);

    // Open celebration modal
    setCelebrationModalData({
      isOpen: true,
      productName: `${cartItems.length} Products Bundle`,
      quantity: cartItemCount,
      unit: 'items',
      totalAmount: finalTotal,
      orderId,
    });
  };

  // Stock Adjustment for Store Manager
  const handleUpdateStock = (productId: string, newStock: number) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p
    );
    updateProducts(updated);
  };

  const handleResetAllStock = () => {
    updateProducts(INITIAL_PRODUCTS);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0f1111] flex flex-col antialiased selection:bg-[#ff9900]/30 selection:text-slate-900">
      {/* 1 & 2. Top Navigation Bar (Starts directly at the top with NO extra promotional bars above it) */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartItemCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProjectHub={() => setIsProjectHubOpen(true)}
        currentUser={currentUser}
        onSwitchUser={setCurrentUser}
        onOpenStoreManager={() => setIsStoreManagerOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* 3. Category Filter Bar (Sticky under navbar) */}
      <div id="categories">
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            scrollToSection('products');
          }}
          productCounts={productCounts}
        />
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative bg-linear-to-b from-amber-50/40 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0f1111] leading-tight">
                Fresh supermarket groceries, delivered to your doorstep.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                Welcome to <strong>kaadugal</strong>. Explore our catalog of 31+ farm-fresh fruits,
                crisp vegetables, daily staples, organic foods, and snacks with live stock validation
                and real-time cart subtotal calculations.
              </p>

              {/* Badges / Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center">
                  <Truck className="w-5 h-5 text-amber-600 mb-1" />
                  <span className="text-xs font-bold text-slate-800">Free Delivery</span>
                  <span className="text-[10px] text-slate-500">On orders &gt; ₹400</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center">
                  <Clock className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold text-slate-800">Fresh Daily</span>
                  <span className="text-[10px] text-slate-500">Direct from farms</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-xs font-bold text-slate-800">GST Verified</span>
                  <span className="text-[10px] text-slate-500">Official tax invoices</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('products')}
                  className="flex items-center gap-2 px-6 py-3 bg-[#ff9900] hover:bg-[#e68a00] text-slate-950 font-extrabold text-sm rounded-xl transition shadow-md shadow-amber-500/20 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Start Shopping</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsProjectHubOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm rounded-xl transition active:scale-[0.98]"
                >
                  <Code2 className="w-4 h-4 text-amber-600" />
                  <span>Inspect Java & SQL Code</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Right Feature Showcase Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white p-4">
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                    alt="kaadugal supermarket fresh produce"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="px-2.5 py-0.5 bg-[#ff9900] text-slate-950 font-black text-xs rounded-md w-fit mb-1">
                      SEASONAL HIGHLIGHT
                    </span>
                    <h3 className="text-lg font-bold">100% Organic Produce</h3>
                    <p className="text-xs text-slate-200">
                      Sourced directly from local farmers in Tamil Nadu & Nilgiris.
                    </p>
                  </div>
                </div>

                {/* College Architecture Highlights Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span>Java OOP Architecture</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Database className="w-4 h-4 text-slate-400" />
                    <span>MySQL InnoDB Schema</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Products Catalog Section */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1111] tracking-tight">
                {selectedCategory === 'All Items'
                  ? 'All Supermarket Products'
                  : `${selectedCategory} Collection`}
              </h2>
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                {filteredProducts.length} items
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select quantities, inspect real-time subtotals, and buy with live stock validation.
            </p>
          </div>

          {/* Quick Filters / Search indicator */}
          {searchQuery && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <span>Searching for: <strong>"{searchQuery}"</strong></span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-amber-800 hover:text-amber-950 font-bold"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No products found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              We couldn't find any products matching your query "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Items');
              }}
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* College Project Architecture Quick Banner */}
      <section className="bg-slate-900 text-slate-200 py-10 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Academic College Submission Ready
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Inspect Java OOP Entities & MySQL DDL Schema
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Includes <code className="text-amber-400">Product.java</code>,{' '}
                <code className="text-amber-400">CartItem.java</code>,{' '}
                <code className="text-amber-400">Purchase.java</code>, Singleton Database Connection,
                and REST API Server alongside the complete MySQL seed database.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsProjectHubOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#ff9900] hover:bg-[#e68a00] text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-500/20"
              >
                <Code2 className="w-4 h-4" />
                <span>Open Project Files Hub</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <Logo size="sm" />
              <div>
                <p className="text-xs text-slate-700 font-semibold">
                  © {new Date().getFullYear()} kaadugal Supermarket. All rights reserved.
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Copyright: <a href="mailto:sabari30608@gmail.com" className="text-amber-600 hover:underline font-mono font-semibold">sabari30608@gmail.com</a> • Developed by <span className="font-bold text-slate-800">Rajasabari.P</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setIsProjectHubOpen(true)}
                className="hover:text-amber-600 transition"
              >
                Project Files
              </button>
              <button
                type="button"
                onClick={() => setIsStoreManagerOpen(true)}
                className="hover:text-amber-600 transition"
              >
                Store Inventory
              </button>
              <button
                type="button"
                onClick={handleResetAllStock}
                className="hover:text-rose-600 transition flex items-center gap-1"
                title="Reset stock to default"
              >
                <RefreshCcw className="w-3 h-3" />
                Reset Inventory
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODALS & DRAWERS --- */}

      {/* 1. Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckout={handleCartCheckout}
      />

      {/* 3. Celebration Confirmation Modal (Thanks for buying! 🎉) */}
      <BuyConfirmationModal
        isOpen={celebrationModalData.isOpen}
        onClose={() => setCelebrationModalData((prev) => ({ ...prev, isOpen: false }))}
        productName={celebrationModalData.productName}
        quantity={celebrationModalData.quantity}
        unit={celebrationModalData.unit}
        totalAmount={celebrationModalData.totalAmount}
        orderId={celebrationModalData.orderId}
        onViewReceipt={() => setIsInvoiceOpen(true)}
        onContinueShopping={() => setCelebrationModalData((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* 4. Stock Error Modal */}
      <StockErrorModal
        isOpen={stockErrorData.isOpen}
        onClose={() => setStockErrorData((prev) => ({ ...prev, isOpen: false }))}
        productName={stockErrorData.productName}
        requestedQty={stockErrorData.requestedQty}
        availableStock={stockErrorData.availableStock}
        unit={stockErrorData.unit}
        onAdjustQuantity={(maxQty) => {
          // If product found, trigger buy now with maximum available
          const found = products.find((p) => p.name === stockErrorData.productName);
          if (found && maxQty > 0) {
            handleBuyNow(found, maxQty);
          }
        }}
      />

      {/* 5. Official Tax Invoice Modal */}
      <TaxInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        invoice={currentInvoice}
      />

      {/* 6. Academic Project Hub Modal */}
      <ProjectHubModal
        isOpen={isProjectHubOpen}
        onClose={() => setIsProjectHubOpen(false)}
      />

      {/* 7. Store Manager Restock Modal */}
      <StoreManagerModal
        isOpen={isStoreManagerOpen}
        onClose={() => setIsStoreManagerOpen(false)}
        products={products}
        onUpdateStock={handleUpdateStock}
        onResetAllStock={handleResetAllStock}
      />
    </div>
  );
}
