'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { toast } from 'sonner';

interface Sale {
  id: string;
  product_name: string;
  quantity: number;
  total_price: number;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
}

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchReportData = async () => {
    setLoading(true);
    const { data: salesData } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
    const { data: prodData } = await supabase.from('products').select('*');

    setSales(salesData || []);
    setProducts(prodData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  // Compute Analytics
  const totalRevenue = sales.reduce((acc, curr) => acc + Number(curr.total_price), 0);
  const totalItemsSold = sales.reduce((acc, curr) => acc + curr.quantity, 0);
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="text-sm text-blue-400 hover:underline">← Back to Dashboard</Link>
            <h1 className="text-3xl font-bold mt-2">Reports & Analytics</h1>
            <p className="text-sm text-slate-400">Business overview and inventory performance metrics.</p>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Revenue</h3>
            <p className="text-3xl font-bold text-emerald-400 mt-2">₱{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Items Sold</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">{totalItemsSold}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Low Stock Alerts</h3>
            <p className="text-3xl font-bold text-amber-400 mt-2">{lowStockProducts.length} items</p>
          </div>
        </div>

        {/* Low Stock Warning Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-amber-400">Low Stock Inventory (≤ 5 remaining)</h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-slate-500">All products have sufficient stock levels.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-white">{p.name}</h4>
                    <p className="text-xs text-slate-400">SKU: {p.sku}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-950 text-amber-400 border border-amber-800 rounded text-xs font-bold">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sales Performance Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <h2 className="p-4 text-md font-semibold border-b border-slate-800">Complete Sales Audit Trail</h2>
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan={5} className="p-4 text-center text-slate-500">Loading reports...</td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-slate-500">No sales transactions recorded.</td></tr>
              ) : (
                sales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-mono text-xs text-slate-500">{s.id}</td>
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