'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Package, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Receipt
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku?: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  }

  // Add item to cart or increment quantity
  function addToCart(product: Product) {
    setSuccessMessage('');
    setErrorMessage('');

    if (product.stock <= 0) {
      setErrorMessage(`${product.name} is out of stock!`);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          setErrorMessage(`Cannot add more. Reached maximum available stock for ${product.name}.`);
          return prevCart;
        }
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  }

  // Update item quantity in cart
  function updateQuantity(id: string, delta: number) {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty > item.stock) {
            setErrorMessage(`Cannot exceed available stock (${item.stock}).`);
            return item;
          }
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  }

  // Remove item completely from cart
  function removeFromCart(id: string) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Process Checkout & Deduct Stock from Supabase
  async function handleCheckout() {
    if (cart.length === 0) return;
    setProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Loop through cart items and update stock in Supabase
      for (const item of cart) {
        const newStock = item.stock - item.quantity;
        
        const { error } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);

        if (error) throw error;
      }

      setSuccessMessage('Checkout successful! Inventory stock has been updated.');
      setCart([]);
      fetchProducts(); // Refresh products list
    } catch (error: any) {
      setErrorMessage(`Checkout failed: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          Loading POS Terminal...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
            <ShoppingCart className="w-3.5 h-3.5" /> Point of Sale Terminal
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Hope ERP Storefront</h1>
          <p className="text-xs text-slate-400">Select items to purchase and process live inventory checkouts.</p>
        </div>

        <Link
          href="/dashboard"
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-2xl border border-slate-700 transition flex items-center gap-2 shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs rounded-2xl flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs rounded-2xl flex items-center gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Products Catalog & Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Products Section (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[650px] overflow-y-auto pr-2">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 text-xs">
                No products found in inventory.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => addToCardHandler(product)}
                  className={`group bg-slate-900/90 border p-5 rounded-3xl transition duration-300 flex flex-col justify-between shadow-xl ${
                    product.stock > 0 
                      ? 'border-slate-800 hover:border-emerald-500/50 cursor-pointer hover:bg-slate-800/60' 
                      : 'border-rose-950/40 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                        <Package className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        product.stock > 5 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : product.stock > 0 
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">{product.name}</h3>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-800/60 mt-4">
                    <span className="text-lg font-black text-emerald-400">₱{product.price.toFixed(2)}</span>
                    <button
                      disabled={product.stock <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white disabled:text-slate-600 text-xs font-bold rounded-xl transition shadow-lg cursor-pointer disabled:cursor-not-allowed"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cart & Checkout Panel (1 Column) */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col justify-between h-[720px]">
          
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" /> Current Order
              </h2>
              <span className="text-xs text-slate-400 font-semibold">{cart.length} items</span>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <ShoppingCart className="w-8 h-8 opacity-40" />
                  <p>Your cart is empty. Click items to add.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-rose-400 hover:text-rose-300 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-400 font-semibold">₱{(item.price * item.quantity).toFixed(2)}</span>
                      
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-white px-1">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Checkout Summary & Action */}
          <div className="border-t border-slate-800 pt-4 space-y-4 mt-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₱{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (0%)</span>
                <span>₱0.00</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-emerald-400">₱{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              disabled={cart.length === 0 || processing}
              onClick={handleCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 text-white disabled:text-slate-600 font-bold text-xs rounded-2xl shadow-lg shadow-emerald-950/50 transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Checkout...
                </>
              ) : (
                'Complete Purchase & Deduct Stock'
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

// Helper function placeholder for event binding
function addToCardHandler(product: Product) {
  // Handled inline
}