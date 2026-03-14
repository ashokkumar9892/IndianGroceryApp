import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, X, Scale, ShoppingCart, Plus } from 'lucide-react';
import { PRODUCTS } from '../data/mockProducts';
import { STORES } from '../data/mockStores';
import { useInventoryStore } from '../store/inventoryStore';
import { useCartStore } from '../store/cartStore';
import { formatPrice, effectivePrice } from '../utils/formatters';
import type { Product } from '../types';

const MAX_COMPARE = 4;

const ComparePage: React.FC = () => {
  const location = useLocation();
  const initialIds: string[] = location.state?.productIds ?? [];

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds.slice(0, MAX_COMPARE));
  const [searchQuery, setSearchQuery] = useState('');

  const getAllProducts = useInventoryStore((s) => s.getAllProducts);
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const allStoreProducts = getAllProducts();

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        !selectedIds.includes(p.id) &&
        (p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.nameHindi?.toLowerCase().includes(q) ?? false))
    ).slice(0, 8);
  }, [searchQuery, selectedIds]);

  const selectedProducts = PRODUCTS.filter((p) => selectedIds.includes(p.id));

  const addToCompare = (product: Product) => {
    if (selectedIds.length >= MAX_COMPARE) return;
    setSelectedIds((prev) => [...prev, product.id]);
    setSearchQuery('');
  };

  const removeFromCompare = (productId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleAddToCart = (sp: { id: string; productId: string; storeId: string; price: number; discountPercent?: number }, storeName: string, product: Product) => {
    const ep = effectivePrice(sp.price, sp.discountPercent);
    addItem({
      storeProductId: sp.id,
      productId: product.id,
      storeId: sp.storeId,
      productName: product.name,
      storeName,
      qty: 1,
      unitPrice: ep,
      emoji: product.emoji,
    });
  };

  // Build cell data: for each product x store, find storeProduct
  const getCellData = (productId: string, storeId: string) => {
    return allStoreProducts.find((sp) => sp.productId === productId && sp.storeId === storeId);
  };

  // For each product, find the lowest effective price (for highlighting)
  const getLowestPrice = (productId: string) => {
    const prices = allStoreProducts
      .filter((sp) => sp.productId === productId && sp.isAvailable && sp.stockQty > 0)
      .map((sp) => effectivePrice(sp.price, sp.discountPercent));
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const getHighestPrice = (productId: string) => {
    const prices = allStoreProducts
      .filter((sp) => sp.productId === productId && sp.isAvailable && sp.stockQty > 0)
      .map((sp) => effectivePrice(sp.price, sp.discountPercent));
    return prices.length > 0 ? Math.max(...prices) : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Scale className="w-6 h-6 text-[#f57314]" />
            <h1 className="text-2xl font-bold text-gray-900">Price Comparison</h1>
          </div>
          <p className="text-sm text-gray-500">
            Compare up to {MAX_COMPARE} products across all stores
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search to add products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-sm font-semibold text-gray-700">
              Add products to compare ({selectedIds.length}/{MAX_COMPARE})
            </p>
          </div>

          {/* Selected product chips */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium px-3 py-1 rounded-full"
                >
                  <span>{p.emoji}</span>
                  <span className="max-w-[120px] truncate">{p.name}</span>
                  <button
                    onClick={() => removeFromCompare(p.id)}
                    className="ml-0.5 text-orange-400 hover:text-orange-700 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedIds.length < MAX_COMPARE && (
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products to add…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f57314]/40 focus:border-[#f57314] transition"
              />
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                  {searchSuggestions.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addToCompare(p)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition text-left"
                    >
                      <span className="text-xl">{p.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                      <Plus className="w-4 h-4 text-[#f57314]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Empty state */}
        {selectedIds.length === 0 && (
          <div className="text-center py-20">
            <Scale className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">No products selected</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Use the search box above to add up to {MAX_COMPARE} products and compare their prices across all stores.
            </p>
          </div>
        )}

        {/* Compare table */}
        {selectedIds.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600 w-36">Store</th>
                  {selectedProducts.map((p) => (
                    <th key={p.id} className="px-4 py-3 text-center min-w-[160px]">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{p.emoji}</span>
                        <span className="text-xs font-semibold text-gray-800 leading-tight max-w-[140px] text-center">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-gray-400">{p.brand}</span>
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="text-[10px] text-red-400 hover:text-red-600 mt-0.5 flex items-center gap-0.5"
                        >
                          <X className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STORES.map((store) => (
                  <tr key={store.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    {/* Store */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: store.logoColor }}
                        >
                          {store.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{store.name}</p>
                          <p className="text-xs text-gray-400">{store.city}</p>
                        </div>
                      </div>
                    </td>

                    {/* Price cells */}
                    {selectedProducts.map((product) => {
                      const sp = getCellData(product.id, store.id);
                      const lowest = getLowestPrice(product.id);
                      const highest = getHighestPrice(product.id);

                      if (!sp) {
                        return (
                          <td key={product.id} className="px-4 py-4 text-center">
                            <span className="text-sm text-gray-300">N/A</span>
                          </td>
                        );
                      }

                      const ep = effectivePrice(sp.price, sp.discountPercent);
                      const isLowest = ep === lowest && lowest !== null;
                      const isHighest = ep === highest && highest !== null && lowest !== highest;
                      const isOutOfStock = !sp.isAvailable || sp.stockQty === 0;
                      const inCart = cartItems.some((i) => i.storeProductId === sp.id);

                      return (
                        <td key={product.id} className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span
                              className={`text-base font-bold ${
                                isLowest
                                  ? 'text-green-600'
                                  : isHighest
                                  ? 'text-red-500'
                                  : 'text-gray-800'
                              }`}
                            >
                              {isOutOfStock ? (
                                <span className="text-gray-300 text-sm font-normal">Out of stock</span>
                              ) : (
                                formatPrice(ep)
                              )}
                            </span>

                            {!isOutOfStock && sp.discountPercent && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(sp.price)}
                              </span>
                            )}

                            {isLowest && !isOutOfStock && (
                              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Best Price
                              </span>
                            )}
                            {isHighest && !isOutOfStock && (
                              <span className="text-[10px] font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                                Highest
                              </span>
                            )}

                            {!isOutOfStock && (
                              <button
                                onClick={() => handleAddToCart(sp, store.name, product)}
                                className={`mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  inCart
                                    ? 'bg-green-500 text-white'
                                    : 'bg-[#f57314] text-white hover:bg-orange-600 active:scale-95'
                                }`}
                              >
                                <ShoppingCart className="w-3 h-3" />
                                {inCart ? 'Added' : 'Add'}
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
