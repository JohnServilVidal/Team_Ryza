'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Sale {
  id: string;
  product_name: string;
  quantity: number;
  total_price: number;
  created_at: string;
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: prodData } = await supabase.from('products').select('*').gt('stock', 0);
    const { data: salesData } = await supabase.from('sales').select('*').order('created_at', { ascending: false });

    setProducts(prodData || []);
    setSales(salesData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProcessSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return alert('Pumili ng produkto!');
    if (quantity > product.stock) return alert('Kulang ang stock!');

    const totalPrice = product.price * quantity;

    // 1. Record Sale
    const { error: saleError } = await supabase.from('sales').insert([
      {
        product_id: product.id,
        product_name: product.name,
        quantity: quantity,
        total_price: totalPrice,
      },
    ]);

    if (saleError) return alert('Error saving sale: ' + saleError.message);

    // 2. Deduct Stock
    const { error: stockError } = await supabase
      .from('products')
      .update({ stock: product.stock - quantity })
      .eq('id', product.id);

    if (stockError) return alert('Error updating stock: ' + stockError.message);

    alert('Transaction Successful!');
    setSelectedProductId('');
    setQuantity(1);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="text-sm text-blue-400 hover:underline">← Back to Dashboard</Link>
            <h1 className="text-3xl font-bold mt-2">Sales & Point of Sale</h1>
          </div>
        </div>

        {/* POS Form */}
        <form onSubmit={handleProcessSale} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold text-emerald-400">New Transaction</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white mt-1"
              >
                <option value="">-- Choose Item --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₱{p.price.toFixed(2)} | Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white mt-1"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg font-semibold transition"
              >
                Process Sale
              </button>
            </div>
          </div>
        </form>

        {/* Recent Transactions Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <h2 className="p-4 text-md font-semibold border-b border-slate-800">Recent Sales History</h2>
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan={4} className="p-4 text-center">Loading transactions...</td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-slate-500">No sales recorded yet.</td></tr>
              ) : (
                sales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-medium text-white">{s.product_name}</td>
                    <td className="p-4">{s.quantity}</td>
                    <td className="p-4 text-emerald-400 font-semibold">₱{Number(s.total_price).toFixed(2)}</td>
                    <td className="p-4 text-slate-400">{new Date(s.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}