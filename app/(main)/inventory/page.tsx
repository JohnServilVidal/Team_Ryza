'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const supabase = createClient();

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert([
      { name, sku, price: parseFloat(price), stock: parseInt(stock) }
    ]);

    if (error) {
      alert('Error adding product: ' + error.message);
    } else {
      setName('');
      setSku('');
      setPrice('');
      setStock('');
      setIsAddOpen(false);
      fetchProducts();
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const { error } = await supabase
      .from('products')
      .update({
        name: editingProduct.name,
        sku: editingProduct.sku,
        price: editingProduct.price,
        stock: editingProduct.stock
      })
      .eq('id', editingProduct.id);

    if (error) {
      alert('Error updating product: ' + error.message);
    } else {
      setEditingProduct(null);
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Sigurado ka bang gusto mong burahin ang produktong ito?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Error deleting product: ' + error.message);
    } else {
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="text-sm text-blue-400 hover:underline">← Back to Dashboard</Link>
            <h1 className="text-3xl font-bold mt-2">Inventory Management</h1>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            + Add Product
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">No products found.</td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-medium text-white">{item.name}</td>
                    <td className="p-4 text-slate-400">{item.sku}</td>
                    <td className="p-4 text-emerald-400 font-semibold">₱{item.price.toFixed(2)}</td>
                    <td className="p-4">{item.stock}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingProduct(item)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4">
          <form onSubmit={handleAddProduct} className="bg-slate-900 border border-slate-800 p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold">Add New Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="SKU"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Stock"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-semibold rounded-lg"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4">
          <form onSubmit={handleUpdateProduct} className="bg-slate-900 border border-slate-800 p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold">Edit Product</h2>
            <div>
              <label className="text-xs text-slate-400">Product Name</label>
              <input
                type="text"
                required
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">SKU</label>
              <input
                type="text"
                required
                value={editingProduct.sku}
                onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400">Price (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Stock</label>
                <input
                  type="number"
                  required
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-sm font-semibold rounded-lg"
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}