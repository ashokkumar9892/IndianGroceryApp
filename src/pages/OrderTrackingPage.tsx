import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Clock, CheckCircle, Package, XCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { STORES } from '../data/mockStores';
import { formatPrice, formatDateTime } from '../utils/formatters';
import type { OrderStatus } from '../types';

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'pending',   label: 'Pending',   icon: <Clock className="w-4 h-4" /> },
  { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle className="w-4 h-4" /> },
  { key: 'preparing', label: 'Preparing', icon: <Package className="w-4 h-4" /> },
  { key: 'ready',     label: 'Ready',     icon: <CheckCircle className="w-4 h-4" /> },
  { key: 'picked_up', label: 'Picked Up', icon: <CheckCircle className="w-4 h-4" /> },
];

const STATUS_ORDER: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up'];

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { getOrder } = useOrderStore();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true });
  }, [isAuthenticated, navigate]);

  const order = orderId ? getOrder(orderId) : undefined;
  const store = order ? STORES.find((s) => s.id === order.storeId) : undefined;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <span className="text-4xl mb-3">🔍</span>
        <h2 className="text-xl font-bold text-gray-700">Order not found</h2>
        <Link to="/orders" className="mt-4 text-[#f57314] hover:underline font-semibold">
          Back to Orders
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const currentStepIdx = isCancelled ? -1 : STATUS_ORDER.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#f57314] mb-3 transition"
          >
            <ArrowLeft className="w-4 h-4" /> All Orders
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
              <p className="text-sm text-gray-400 mt-0.5 font-mono">{order.id}</p>
            </div>
            {isCancelled ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
                <XCircle className="w-4 h-4" /> Cancelled
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full ${
                order.status === 'ready' || order.status === 'picked_up'
                  ? 'text-green-700 bg-green-50 border border-green-200'
                  : 'text-blue-700 bg-blue-50 border border-blue-200'
              }`}>
                <CheckCircle className="w-4 h-4" />
                {order.status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Status progress bar */}
        {!isCancelled ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-800 mb-5">Order Progress</h2>
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-[#f57314] transition-all duration-500"
                style={{
                  width: currentStepIdx >= 0
                    ? `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%`
                    : '0%',
                }}
              />
              <div className="relative flex justify-between">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isActive = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                          isDone
                            ? 'bg-[#f57314] border-[#f57314] text-white'
                            : 'bg-white border-gray-200 text-gray-300'
                        } ${isActive ? 'ring-4 ring-orange-100' : ''}`}
                      >
                        {step.icon}
                      </div>
                      <span
                        className={`text-xs font-semibold text-center leading-tight max-w-[60px] ${
                          isDone ? 'text-[#f57314]' : 'text-gray-300'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-700">Order Cancelled</p>
              <p className="text-sm text-red-500 mt-0.5">
                This order was cancelled on {formatDateTime(order.updatedAt)}.
              </p>
            </div>
          </div>
        )}

        {/* Pickup info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-[#f57314]" />
            <h2 className="font-bold text-gray-800">Pickup Details</h2>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">Slot:</span> {order.pickupSlot.label}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">Store:</span> {order.storeName}
          </p>
          {store && (
            <a
              href={`tel:${store.phone}`}
              className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-[#16a34a] hover:underline"
            >
              <Phone className="w-4 h-4" />
              {store.phone}
            </a>
          )}
          {order.specialInstructions && (
            <p className="mt-3 text-sm text-gray-500 italic bg-gray-50 px-3 py-2 rounded-lg">
              Note: {order.specialInstructions}
            </p>
          )}
        </div>

        {/* Customer + order meta */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-3">Order Info</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Customer</p>
              <p className="font-medium text-gray-800">{order.customerName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Placed</p>
              <p className="font-medium text-gray-800">{formatDateTime(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Order ID</p>
              <p className="font-mono text-gray-800 text-xs">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Last Updated</p>
              <p className="font-medium text-gray-800">{formatDateTime(order.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-800">
              Items ({order.items.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <div key={item.storeProductId} className="flex items-center gap-3 px-5 py-3.5">
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{item.productName}</p>
                  <p className="text-xs text-gray-400">
                    {formatPrice(item.unitPrice)} × {item.qty}
                  </p>
                </div>
                <p className="font-bold text-gray-900 text-sm">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 bg-orange-50 border-t border-orange-100 flex items-center justify-between">
            <span className="font-bold text-gray-800">Total</span>
            <span className="text-xl font-extrabold text-[#f57314]">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#f57314] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
