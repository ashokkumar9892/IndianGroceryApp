import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { formatPrice, formatDateTime } from '../utils/formatters';
import type { OrderStatus } from '../types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:   { label: 'Pending',   color: 'text-yellow-700', bg: 'bg-yellow-50',  border: 'border-yellow-200' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-200' },
  preparing: { label: 'Preparing', color: 'text-purple-700', bg: 'bg-purple-50',  border: 'border-purple-200' },
  ready:     { label: 'Ready!',    color: 'text-green-700',  bg: 'bg-green-50',   border: 'border-green-200' },
  picked_up: { label: 'Picked Up', color: 'text-gray-700',   bg: 'bg-gray-100',   border: 'border-gray-200' },
  cancelled: { label: 'Cancelled', color: 'text-red-700',    bg: 'bg-red-50',     border: 'border-red-200' },
};

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuthStore();
  const { getCustomerOrders } = useOrderStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true });
  }, [isAuthenticated, navigate]);

  if (!currentUser) return null;

  const orders = getCustomerOrders(currentUser.id);

  const toggleExpand = (orderId: string) => {
    setExpandedId((prev) => (prev === orderId ? null : orderId));
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-sm w-full">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-sm text-gray-400 mb-6">
            You haven't placed any orders. Start shopping to place your first order!
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-[#f57314]" />
            My Orders
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {orders.map((order) => {
          const status = STATUS_CONFIG[order.status];
          const isExpanded = expandedId === order.id;

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Order header row */}
              <button
                onClick={() => toggleExpand(order.id)}
                className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition"
              >
                {/* Left icon */}
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-xl">
                  📦
                </div>

                <div className="flex-1 min-w-0">
                  {/* Order ID + store */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 text-sm">{order.id}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${status.color} ${status.bg} ${status.border}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{order.storeName}</p>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                    <span>{formatDateTime(order.createdAt)}</span>
                    <span>•</span>
                    <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-700">{formatPrice(order.totalAmount)}</span>
                  </div>

                  {/* Pickup time */}
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    Pickup: {order.pickupSlot.label}
                  </div>
                </div>

                {/* Expand icon */}
                <div className="flex-shrink-0 text-gray-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-gray-50">
                  <div className="px-5 py-3 divide-y divide-gray-50">
                    {order.items.map((item) => (
                      <div key={item.storeProductId} className="flex items-center gap-3 py-2.5">
                        <span className="text-lg">{item.emoji}</span>
                        <div className="flex-1 text-sm">
                          <p className="text-gray-800 font-medium">{item.productName}</p>
                          <p className="text-xs text-gray-400">
                            {formatPrice(item.unitPrice)} × {item.qty}
                          </p>
                        </div>
                        <p className="font-semibold text-sm text-gray-800">{formatPrice(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div className="px-5 pb-3 text-xs text-gray-500 italic">
                      Note: {order.specialInstructions}
                    </div>
                  )}

                  {/* Track order link */}
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <Link
                      to={`/order/${order.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#f57314] hover:underline"
                    >
                      Track Order
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
