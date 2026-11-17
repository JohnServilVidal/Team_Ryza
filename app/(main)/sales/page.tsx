'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface Sale {
  transno: string;
  salesdate: string;
  custno?: string;
  empno?: string;
  is_deleted?: boolean;
  stamp?: string;
  salesdetail?: {
    prodcode: string;
    quantity: number;
  }[];
  customer?: {
    custName: string;
  };
  employee?: {
    lastName: string;
    firstName: string;
  };
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
 const [sales, setSales] = useState<Sale[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);

    // 1. Kunin ang role ng current logged-in user para sa RBAC
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile) setUserRole(profile.role);
    }

    // 2. Kunin ang LAHAT ng produkto para magamit sa product name matching sa history
    const { data: prodData } = await supabase.from('products').select('*');
    setProducts(prodData || []);

    // 3. Kunin ang active sales kasama ang customer, employee, at salesdetail
    const { data: salesData, error } = await supabase
      .from('sales')
      .select(`
        transno,
        salesdate,
        custno,
        empno,
        is_deleted,
        stamp,
        salesdetail (
          quantity,
          prodcode
      )
      `)
      .eq('is_deleted', false)
      .order('stamp', { ascending: false });

    if (error) {
      console.error('Error fetching sales:', error.message);
    } else {
      setSales((salesData as unknown as Sale[]) || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchData();
    };
    loadInitialData();
  }, []);

  const handleProcessSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return alert('Pumili ng produkto!');
    if (quantity > product.stock) return alert('Kulang ang stock!');

    const customTransno = `TR${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toLocaleString();

    // 1. I-save sa sales table (Header)
    const { error: saleError } = await supabase.from('sales').insert([
      {
        transno: customTransno,
        salesdate: today,
        custno: 'C0001',
        empno: '00005',
        is_deleted: false,
        stamp: `ADD system ${timestamp}`,
      },
    ]);

    if (saleError) return alert('Error saving sale header: ' + saleError.message);

    // 2. Kuhanin ang unang 6 na karakter ng SKU para sumunod sa varying(6) limit ng salesdetail.prodcode
    const productCode = String(product.sku || '').replace('-', '');

    // 3. I-save sa salesdetail table (Line Item)
    const { error: detailError } = await supabase.from('salesdetail').insert([
      {
        transno: customTransno,
        prodcode: productCode,
        quantity: quantity,
        is_deleted: false,
        stamp: `ADD system ${timestamp}`,
      },
    ]);

    if (detailError) return alert('Error saving sales detail: ' + detailError.message);

    // 4. Bawasan ang stock sa products table
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

  // Soft Delete Function (Admin & Super Admin lang)
  const handleSoftDelete = async (transno: string) => {
    const timestamp = new Date().toLocaleString();
    const { error } = await supabase
      .from('sales')
      .update({ 
        is_deleted: true, 
        stamp: `DELETE system ${timestamp}` 
      })
      .eq('transno', transno);

    if (error) {
      alert('Error deleting sale: ' + error.message);
    } else {
      fetchData();
    }
  };

  // I-filter ang mga may stock lang para sa dropdown ng POS form
  const availableProducts = products.filter((p) => p.stock > 0);

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
                {availableProducts.map((p) => (
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(parseInt(e.target.value) || 1)}
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
                <th className="p-4">Trans No</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Total</th>
                <th className="p-4">Balance</th>
                <th className="p-4">Sales Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan={7} className="p-4 text-center">Loading transactions...</td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan={7} className="p-4 text-center text-slate-500">No sales recorded yet.</td></tr>
              ) : (
                sales.map((s) => {
                  const detail = s.salesdetail && s.salesdetail.length > 0 ? s.salesdetail[0] : null;

                  
                  // Hanapin ang product name gamit ang sku o prodcode
                  const matchedProduct = detail
                    ? products.find(
                        (p) =>
                          p.sku === detail.prodcode ||
                          String(p.sku || '').replace('-', '') === detail.prodcode ||
                          p.id === detail.prodcode ||
                          String(p.sku || '').substring(0, 6) === detail.prodcode
                      )
                    : null;

                  const productName = matchedProduct
                    ? matchedProduct.name
                    : detail
                    ? detail.prodcode
                    : '—';

                    const numericTotal = matchedProduct && detail ? matchedProduct.price * detail.quantity : 0;
                    const totalAmount = numericTotal > 0 ? `₱${numericTotal.toFixed(2)}` : '—';

                    const payments = 0; // Pwede mong palitan kung may payment table ka na
                    const balanceAmount = numericTotal - payments;
                    const balanceDisplay = numericTotal > 0 ? `₱${balanceAmount.toFixed(2)}` : '—';

                    const customerName = s.custno || '—';

                  return (
                    <tr key={s.transno} className="hover:bg-slate-800/40">
                      <td className="p-4 font-medium text-white">{s.transno}</td>
                      <td className="p-4 text-slate-300">{customerName}</td>
                      <td className="p-4 text-emerald-400 font-medium">{productName}</td>
                      <td className="p-4">{detail ? `${detail.quantity}x` : '—'}</td>
                      <td className="p-4 text-slate-200">{totalAmount}</td>
                      <td className="p-4 text-amber-400 font-semibold">{balanceDisplay}</td> {/* <-- Ang Balance column */}
                      <td className="p-4">{s.salesdate}</td>
                      <td className="p-4 text-center">
                        {userRole !== 'staff' && userRole !== '' && (
                          <button
                            onClick={() => handleSoftDelete(s.transno)}
                            className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1 rounded text-xs transition"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}