import React from 'react';
import { ShoppingCart, Award, TrendingDown } from 'lucide-react';
import type { StoreProduct } from '../../types';
import { PRODUCTS } from '../../data/mockProducts';
import { STORES } from '../../data/mockStores';
import { useInventoryStore } from '../../store/inventoryStore';
import { useCartStore } from '../../store/cartStore';
import { formatPrice, effectivePrice } from '../../utils/formatters';

interface PriceCompareTableProps {
  productId: string;
}

const PriceCompareTable: React.FC<PriceCompareTableProps> = ({ productId }) => {
  const getAllProducts = useInventoryStore((s) => s.getAllProducts);
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const product = PRODUCTS.find((p) => p.id === productId);
  const allStoreProducts = getAllProducts();

  // Get all storeProduct entries for this product across all stores
  const entries = allStoreProducts
    .filter((sp) => sp.productId === productId)
    .map((sp) => ({
      sp,
      store: STORES.find((s) => s.id === sp.storeId),
      effPrice: effectivePrice(sp.price, sp.discountPercent),
    }))
    .filter((e) => e.store)
    .sort((a, b) => a.effPrice - b.effPrice);

  if (!product) return null;
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>This product is not available in any store currently.</p>
      </div>
    );
  }

  const lowestPrice = entries[0]?.effPrice;

  const handleAddToCart = (sp: StoreProduct, storeName: string) => {
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

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Store</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Price</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Stock</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(({ sp, store, effPrice: ep }) => {
            const isBest = ep === lowestPrice;
            const inCart = cartItems.some((i) => i.storeProductId === sp.id);
            const hasDiscount = !!sp.discountPercent && sp.discountPercent > 0;

            return (
              <tr
                key={sp.id}
                className={`border-b border-gray-50 transition-colors ${
                  isBest ? 'bg-green-50' : 'hover:bg-gray-50'
                }`}
              >
                {/* Store name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: store!.logoColor }}
                    >
                      {store!.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{store!.name}</div>
                      <div className="text-xs text-gray-400">{store!.city}</div>
                    </div>
                    {isBest && (
                      <span className="ml-1 inline-flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 border border-green-300 px-2 py-0.5 rounded-full">
                        <Award className="w-3 h-3" />
                        Best Price
                      </span>
                    )}
                  </div>
                </td>

                {/* Price */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isBest ? 'text-green-700 text-base' : 'text-gray-800'}`}>
                      {formatPrice(ep)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-xs text-gray-400 line-through">{formatPrice(sp.price)}</span>
                        <span className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <TrendingDown className="w-3 h-3" />
                          {sp.discountPercent}%
                        </span>
                      </>
                    )}
                  </div>
                </td>

                {/* Stock */}
                <td className="px-4 py-3">
                  {sp.isAvailable && sp.stockQty > 0 ? (
                    <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      {sp.stockQty} left
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </td>

                {/* Action */}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleAddToCart(sp, store!.name)}
                    disabled={!sp.isAvailable || sp.stockQty === 0}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      !sp.isAvailable || sp.stockQty === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : inCart
                        ? 'bg-green-500 text-white'
                        : 'bg-[#f57314] text-white hover:bg-orange-600 active:scale-95'
                    }`}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    {inCart ? 'Added' : 'Add'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PriceCompareTable;
