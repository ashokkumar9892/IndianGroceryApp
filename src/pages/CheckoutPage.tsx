import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, ArrowLeft, CheckCircle, FileText } from 'lucide-react';
import { STORES } from '../data/mockStores';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { generatePickupSlots } from '../utils/pickupSlots';
import { formatPrice } from '../utils/formatters';
import type { PickupSlot, OrderItem } from '../types';

const CheckoutPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();

  const { currentUser, isAuthenticated } = useAuthStore();
  const getStoreItems = useCartStore((s) => s.getStoreItems);
  const getStoreTotal = useCartStore((s) => s.getStoreTotal);
  const clearStoreCart = useCartStore((s) => s.clearStoreCart);
  const { placeOrder, getStoreOrders } = useOrderStore();

  const [selectedSlot, setSelectedSlot] = useState<PickupSlot | null>(null);
  const [instructions, setInstructions] = useState('');
  const [placing, setPlacing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const store = STORES.find((s) => s.id === storeId);
  const cartItems = storeId ? getStoreItems(storeId) : [];
  const total = storeId ? getStoreTotal(storeId) : 0;
  const storeOrders = storeId ? getStoreOrders(storeId) : [];

  const slots = useMemo(() => {
    if (!store) return [];
    return generatePickupSlots(store, storeOrders);
  }, [store, storeOrders]);

  if (!store || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <span className="text-4xl mb-3">🛒</span>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Nothing to checkout</h2>
        <Link to="/cart" className="mt-3 text-[#f57314] hover:underline font-semibold">
          Back to Cart
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    if (!selectedSlot || !currentUser || !storeId) return;
    setPlacing(true);

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      productId: item.productId,
      storeProductId: item.storeProductId,
      productName: item.productName,
      emoji: item.emoji,
      qty: item.qty,
      unitPrice: item.unitPrice,
      subtotal: item.unitPrice * item.qty,
    }));

    placeOrder({
      customerId: currentUser.id,
      customerName: currentUser.name,
      storeId: store.id,
      storeName: store.name,
      items: orderItems,
      pickupSlot: selectedSlot,
      specialInstructions: instructions.trim() || undefined,
    });

    clearStoreCart(storeId);
    setPlacing(false);
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#f57314] mb-3 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ordering from{' '}
            <span className="font-semibold text-gray-700">{store.name}</span>
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-800">Order Summary</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {cartItems.map((item) => (
              <div key={item.storeProductId} className="flex items-center gap-3 px-5 py-3">
                <span className="text-xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-400">
                    {formatPrice(item.unitPrice)} × {item.qty}
                  </p>
                </div>
                <p className="font-semibold text-gray-800 text-sm">
                  {formatPrice(item.unitPrice * item.qty)}
                </p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 bg-orange-50 border-t border-orange-100 flex items-center justify-between">
            <span className="font-bold text-gray-800">Total</span>
            <span className="text-xl font-extrabold text-[#f57314]">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Pickup slot selector */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#f57314]" />
            <h2 className="font-bold text-gray-800">Select Pickup Slot</h2>
          </div>
          <div className="p-4">
            {slots.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No pickup slots available. Please try again later.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => {
                  const isFull = slot.id.endsWith('-full');
                  const isSelected = selectedSlot?.id === slot.id;

                  return (
                    <button
                      key={slot.id}
                      onClick={() => !isFull && setSelectedSlot(slot)}
                      disabled={isFull}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                        isFull
                          ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#f57314] border-[#f57314] text-white shadow'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-[#f57314] hover:text-[#f57314]'
                      }`}
                    >
                      {slot.label}
                      {isFull && <span className="ml-1 text-xs">(Full)</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Special instructions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            <h2 className="font-bold text-gray-800">
              Special Instructions{' '}
              <span className="text-gray-400 font-normal text-sm">(optional)</span>
            </h2>
          </div>
          <div className="p-4">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Any special requests for the store? E.g., specific brand preference, freshness notes…"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f57314]/40 focus:border-[#f57314] transition resize-none"
            />
          </div>
        </div>

        {/* Place order */}
        <button
          onClick={handlePlaceOrder}
          disabled={!selectedSlot || placing}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-base transition-all ${
            !selectedSlot || placing
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#f57314] hover:bg-orange-600 text-white shadow-md active:scale-95'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          {placing ? 'Placing Order…' : 'Place Order'}
        </button>

        {!selectedSlot && (
          <p className="text-center text-sm text-gray-400">
            Please select a pickup slot to continue.
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
