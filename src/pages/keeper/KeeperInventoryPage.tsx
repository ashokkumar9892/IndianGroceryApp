import { useState, useRef, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import KeeperLayout from '../../components/keeper/KeeperLayout';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { useAuthStore } from '../../store/authStore';
import { useInventoryStore } from '../../store/inventoryStore';
import { STORES } from '../../data/mockStores';
import { PRODUCTS } from '../../data/mockProducts';
import { CATEGORIES } from '../../types';
import { formatPrice, formatDate } from '../../utils/formatters';
import type { StoreProduct, Category } from '../../types';

const PAGE_SIZE = 20;

export default function KeeperInventoryPage() {
  const { currentUser } = useAuthStore();
  const { getStoreProducts, updateStoreProduct } = useInventoryStore();

  const storeId = currentUser?.assignedStoreId ?? '';
  const store = STORES.find((s) => s.id === storeId);
  const storeProducts = getStoreProducts(storeId);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | ''>('');
  const [page, setPage] = useState(1);

  // Inline edit state: { spId, field, value }
  const [editState, setEditState] = useState<{
    id: string;
    field: 'stockQty' | 'price';
    value: string;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const enriched = storeProducts.map((sp) => ({
    sp,
    product: PRODUCTS.find((p) => p.id === sp.productId),
  }));

  const filtered = enriched.filter(({ product }) => {
    if (!product) return false;
    const matchSearch =
      !search ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || product.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startEdit = (sp: StoreProduct, field: 'stockQty' | 'price') => {
    const current =
      field === 'stockQty' ? String(sp.stockQty) : String((sp.price / 100).toFixed(2));
    setEditState({ id: sp.id, field, value: current });
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = useCallback(() => {
    if (!editState) return;
    const { id, field, value } = editState;
    if (field === 'stockQty') {
      const qty = parseInt(value, 10);
      if (!isNaN(qty) && qty >= 0) {
        updateStoreProduct(id, { stockQty: qty });
      }
    } else {
      const price = parseFloat(value);
      if (!isNaN(price) && price > 0) {
        updateStoreProduct(id, { price: Math.round(price * 100) });
      }
    }
    setEditState(null);
  }, [editState, updateStoreProduct]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setEditState(null);
  };

  const toggleAvailability = (sp: StoreProduct) => {
    updateStoreProduct(sp.id, { isAvailable: !sp.isAvailable });
  };

  const rowBg = (sp: StoreProduct) => {
    if (sp.stockQty === 0) return 'bg-red-50 hover:bg-red-100/60';
    if (sp.stockQty < 5) return 'bg-yellow-50 hover:bg-yellow-100/60';
    return 'bg-white hover:bg-gray-50';
  };

  return (
    <ProtectedRoute role="storekeeper">
      <KeeperLayout>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-500 text-sm mt-1">{store?.name ?? 'Store'} — {filtered.length} products</p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-3 h-3 rounded bg-red-200 border border-red-300" />
              Out of stock
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-3 h-3 rounded bg-yellow-200 border border-yellow-300" />
              Low stock (1–4)
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-3 h-3 rounded bg-white border border-gray-300" />
              In stock
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 bg-white"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value as Category | ''); setPage(1); }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron-400 bg-white text-gray-700"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-semibold">Product</th>
                    <th className="text-left px-3 py-3 font-semibold hidden md:table-cell">Category</th>
                    <th className="text-center px-3 py-3 font-semibold">Stock Qty</th>
                    <th className="text-center px-3 py-3 font-semibold">Price (₹)</th>
                    <th className="text-center px-3 py-3 font-semibold">Status</th>
                    <th className="text-left px-3 py-3 font-semibold hidden lg:table-cell">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                        No products found.
                      </td>
                    </tr>
                  )}
                  {paginated.map(({ sp, product }) => {
                    const isEditingQty = editState?.id === sp.id && editState.field === 'stockQty';
                    const isEditingPrice = editState?.id === sp.id && editState.field === 'price';

                    return (
                      <tr key={sp.id} className={`transition-colors ${rowBg(sp)}`}>
                        {/* Product */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl flex-shrink-0">{product?.emoji ?? '📦'}</span>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate max-w-[180px]">
                                {product?.name ?? sp.productId}
                              </p>
                              <p className="text-xs text-gray-400">{product?.brand}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-3 py-3 hidden md:table-cell">
                          {(() => {
                            const cat = CATEGORIES.find((c) => c.value === product?.category);
                            return (
                              <span className="text-xs text-gray-600">
                                {cat?.emoji} {cat?.label}
                              </span>
                            );
                          })()}
                        </td>

                        {/* Stock Qty — inline editable */}
                        <td className="px-3 py-3 text-center">
                          {isEditingQty ? (
                            <div className="flex items-center gap-1 justify-center">
                              <input
                                ref={inputRef}
                                type="number"
                                min="0"
                                value={editState!.value}
                                onChange={(e) =>
                                  setEditState((prev) => prev ? { ...prev, value: e.target.value } : prev)
                                }
                                onKeyDown={handleKeyDown}
                                onBlur={commitEdit}
                                className="w-16 text-center text-sm border border-saffron-400 rounded-lg px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-saffron-300"
                              />
                              <button onClick={commitEdit} className="text-green-600 hover:text-green-700">
                                <Save size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(sp, 'stockQty')}
                              className={`px-3 py-1 rounded-full text-xs font-semibold cursor-text hover:ring-2 hover:ring-saffron-300 transition ${
                                sp.stockQty === 0
                                  ? 'bg-red-100 text-red-700'
                                  : sp.stockQty < 5
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-50 text-green-700'
                              }`}
                              title="Click to edit"
                            >
                              {sp.stockQty}
                            </button>
                          )}
                        </td>

                        {/* Price — inline editable */}
                        <td className="px-3 py-3 text-center">
                          {isEditingPrice ? (
                            <div className="flex items-center gap-1 justify-center">
                              <span className="text-gray-500 text-sm">₹</span>
                              <input
                                ref={inputRef}
                                type="number"
                                min="0"
                                step="0.5"
                                value={editState!.value}
                                onChange={(e) =>
                                  setEditState((prev) => prev ? { ...prev, value: e.target.value } : prev)
                                }
                                onKeyDown={handleKeyDown}
                                onBlur={commitEdit}
                                className="w-20 text-center text-sm border border-saffron-400 rounded-lg px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-saffron-300"
                              />
                              <button onClick={commitEdit} className="text-green-600 hover:text-green-700">
                                <Save size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(sp, 'price')}
                              className="text-sm font-medium text-gray-800 hover:text-saffron-600 hover:underline cursor-text transition"
                              title="Click to edit"
                            >
                              {formatPrice(sp.price)}
                            </button>
                          )}
                        </td>

                        {/* Status toggle */}
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => toggleAvailability(sp)}
                            className={`flex items-center gap-1.5 mx-auto text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                              sp.isAvailable
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {sp.isAvailable ? (
                              <ToggleRight size={14} />
                            ) : (
                              <ToggleLeft size={14} />
                            )}
                            {sp.isAvailable ? 'Available' : 'Unavailable'}
                          </button>
                        </td>

                        {/* Last Updated */}
                        <td className="px-3 py-3 text-xs text-gray-400 hidden lg:table-cell">
                          {sp.lastUpdated ? formatDate(sp.lastUpdated) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 py-1 text-xs font-medium text-gray-700">
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </KeeperLayout>
    </ProtectedRoute>
  );
}
