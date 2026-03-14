import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Package, User } from 'lucide-react';
import KeeperLayout from '../../components/keeper/KeeperLayout';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { formatPrice, formatDateTime } from '../../utils/formatters';
import type { Order, OrderStatus } from '../../types';

type FilterTab = OrderStatus | 'all';

const TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: 'Pending', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  confirmed: { label: 'Confirmed', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  preparing: { label: 'Preparing', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  ready: { label: 'Ready', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  picked_up: { label: 'Picked Up', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}

function ActionButton({
  label,
  onClick,
  color,
}: {
  label: string;
  onClick: () => void;
  color: 'green' | 'blue' | 'purple' | 'gray' | 'red';
}) {
  const styles = {
    green: 'bg-green-500 hover:bg-green-600 text-white',
    blue: 'bg-blue-500 hover:bg-blue-600 text-white',
    purple: 'bg-purple-500 hover:bg-purple-600 text-white',
    gray: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    red: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
  };
  return (
    <button
      onClick={onClick}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${styles[color]}`}
    >
      {label}
    </button>
  );
}

function OrderCard({ order, onUpdateStatus, onCancel }: {
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onCancel: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status];

  const actions = () => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="flex gap-2 flex-wrap">
            <ActionButton label="Confirm Order" color="green" onClick={() => onUpdateStatus(order.id, 'confirmed')} />
            <ActionButton label="Cancel" color="red" onClick={() => onCancel(order.id)} />
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex gap-2 flex-wrap">
            <ActionButton label="Start Preparing" color="blue" onClick={() => onUpdateStatus(order.id, 'preparing')} />
            <ActionButton label="Cancel" color="red" onClick={() => onCancel(order.id)} />
          </div>
        );
      case 'preparing':
        return (
          <ActionButton label="Mark Ready" color="green" onClick={() => onUpdateStatus(order.id, 'ready')} />
        );
      case 'ready':
        return (
          <ActionButton label="Mark Picked Up" color="gray" onClick={() => onUpdateStatus(order.id, 'picked_up')} />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${cfg.border} overflow-hidden transition-shadow hover:shadow-md`}>
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Order ID + customer */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                #{order.id.slice(-8).toUpperCase()}
              </span>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <User size={13} className="text-gray-400" />
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                <span>{formatDateTime(order.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: amount + expand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-base font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
            <p className="text-xs text-gray-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-4 pt-3">
          {/* Pickup slot */}
          <div className="flex items-center gap-2 mb-3 p-2.5 bg-saffron-50 rounded-lg border border-saffron-100">
            <Clock size={14} className="text-saffron-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-saffron-700">Pickup Slot</p>
              <p className="text-xs text-saffron-600">{order.pickupSlot.label}</p>
            </div>
          </div>

          {/* Items list */}
          <div className="space-y-1.5 mb-3">
            {order.items.map((item) => (
              <div key={item.storeProductId} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{item.emoji}</span>
                  <span className="text-gray-700">{item.productName}</span>
                  <span className="text-gray-400 text-xs">× {item.qty}</span>
                </div>
                <span className="font-medium text-gray-800">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>

          {/* Special instructions */}
          {order.specialInstructions && (
            <div className="mb-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-0.5">Special Instructions:</p>
              <p className="text-xs text-gray-700">{order.specialInstructions}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end">{actions()}</div>
        </div>
      )}
    </div>
  );
}

export default function KeeperOrdersPage() {
  const { currentUser } = useAuthStore();
  const { getStoreOrders, updateOrderStatus, cancelOrder } = useOrderStore();

  const storeId = currentUser?.assignedStoreId ?? '';
  const orders = getStoreOrders(storeId);

  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filtered = activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab);

  const countByStatus = (status: OrderStatus) =>
    orders.filter((o) => o.status === status).length;

  return (
    <ProtectedRoute role="storekeeper">
      <KeeperLayout>
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Package size={22} className="text-saffron-500" />
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            </div>
            <p className="text-sm text-gray-500">{filtered.length} orders shown</p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5 flex-wrap mb-6 bg-gray-100 p-1 rounded-xl">
            {TABS.map(({ value, label }) => {
              const count = value === 'all' ? orders.length : countByStatus(value as OrderStatus);
              const isActive = activeTab === value;
              return (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-saffron-700 shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {label}
                  {count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-xs ${
                        isActive ? 'bg-saffron-100 text-saffron-700' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Orders list */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 py-16 text-center">
                <Package size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400 text-sm">No orders in this category.</p>
              </div>
            ) : (
              filtered.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onCancel={cancelOrder}
                />
              ))
            )}
          </div>
        </div>
      </KeeperLayout>
    </ProtectedRoute>
  );
}
