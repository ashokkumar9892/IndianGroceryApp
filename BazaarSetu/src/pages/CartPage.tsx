import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, ChevronRight, Store } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { STORES } from '../data/mockStores';
import { formatPrice } from '../utils/formatters';

const CartPage: React.FC = () => {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const getStoreItems = useCartStore((s) => s.getStoreItems);
  const getStoreTotal = useCartStore((s) => s.getStoreTotal);
  const getStoreIds = useCartStore((s) => s.getStoreIds);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const storeIds = getStoreIds();
  const grandTotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

  const handleCheckout = (storeId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/checkout/${storeId}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-sm w-full">
          <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-400 mb-6">
            Looks like you haven't added anything yet. Browse stores to find your favorite Indian groceries.
          </p>
          <Link
            to="/stores"
            className="inline-flex items-center gap-2 bg-[#f57314] hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition active:scale-95"
          >
            Browse Stores
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-[#f57314]" />
              Your Cart
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {getItemCount()} item{getItemCount() !== 1 ? 's' : ''} from {storeIds.length} store{storeIds.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Grand Total</p>
            <p className="text-xl font-extrabold text-gray-900">{formatPrice(grandTotal)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {storeIds.map((storeId) => {
          const store = STORES.find((s) => s.id === storeId);
          const storeItems = getStoreItems(storeId);
          const storeTotal = getStoreTotal(storeId);

          return (
            <div key={storeId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Store header */}
              <div
                className="flex items-center gap-3 px-5 py-4 border-b border-gray-50"
                style={{ backgroundColor: store?.bannerColor ?? '#f3f4f6' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: store?.logoColor ?? '#6b7280' }}
                >
                  {store ? store.name.slice(0, 2).toUpperCase() : <Store className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900">{store?.name ?? storeId}</h2>
                  <p className="text-xs text-gray-500">{store?.city}, {store?.state}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Subtotal</p>
                  <p className="font-bold text-gray-900">{formatPrice(storeTotal)}</p>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {storeItems.map((item) => (
                  <div key={item.storeProductId} className="flex items-center gap-4 px-5 py-4">
                    {/* Emoji */}
                    <div className="w-12 h-12 flex items-center justify-center bg-orange-50 rounded-xl flex-shrink-0 text-2xl">
                      {item.emoji}
                    </div>

                    {/* Name + price */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.productName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatPrice(item.unitPrice)} each</p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-1 py-1">
                      <button
                        onClick={() => updateQty(item.storeProductId, item.qty - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-[#f57314] transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-gray-800">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.storeProductId, item.qty + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-[#f57314] transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right w-16 flex-shrink-0">
                      <p className="font-bold text-gray-900 text-sm">{formatPrice(item.unitPrice * item.qty)}</p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.storeProductId)}
                      className="text-gray-300 hover:text-red-500 transition ml-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Checkout button */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Store total</p>
                  <p className="text-lg font-extrabold text-gray-900">{formatPrice(storeTotal)}</p>
                </div>
                <button
                  onClick={() => handleCheckout(storeId)}
                  className="flex items-center gap-2 bg-[#f57314] hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition active:scale-95"
                >
                  Checkout
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Grand total summary */}
        {storeIds.length > 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
            <p className="font-semibold text-gray-700">Grand Total ({storeIds.length} stores)</p>
            <p className="text-xl font-extrabold text-gray-900">{formatPrice(grandTotal)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
