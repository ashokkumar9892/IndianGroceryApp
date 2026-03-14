import { useMemo } from 'react';
import {
  ShoppingBag,
  IndianRupee,
  Clock,
  AlertTriangle,
  TrendingUp,
  Package,
} from 'lucide-react';
import KeeperLayout from '../../components/keeper/KeeperLayout';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { useInventoryStore } from '../../store/inventoryStore';
import { STORES } from '../../data/mockStores';
import { PRODUCTS } from '../../data/mockProducts';
import { formatPrice, formatDateTime } from '../../utils/formatters';
import type { Order, OrderStatus } from '../../types';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  confirmed: { label: 'Confirmed', bg: 'bg-blue-100', text: 'text-blue-700' },
  preparing: { label: 'Preparing', bg: 'bg-purple-100', text: 'text-purple-700' },
  ready: { label: 'Ready', bg: 'bg-green-100', text: 'text-green-700' },
  picked_up: { label: 'Picked Up', bg: 'bg-gray-100', text: 'text-gray-600' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-600' },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function QuickActionButton({
  label,
  onClick,
  variant,
}: {
  label: string;
  onClick: () => void;
  variant: 'green' | 'blue' | 'red' | 'gray';
}) {
  const styles = {
    green: 'bg-green-500 hover:bg-green-600 text-white',
    blue: 'bg-blue-500 hover:bg-blue-600 text-white',
    red: 'bg-red-100 hover:bg-red-200 text-red-700',
    gray: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  };
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${styles[variant]}`}
    >
      {label}
    </button>
  );
}

export default function KeeperDashboardPage() {
  const { currentUser } = useAuthStore();
  const { getStoreOrders, updateOrderStatus, cancelOrder } = useOrderStore();
  const { getStoreProducts } = useInventoryStore();

  const storeId = currentUser?.assignedStoreId ?? '';
  const store = STORES.find((s) => s.id === storeId);

  const orders = getStoreOrders(storeId);
  const storeProducts = getStoreProducts(storeId);

  const today = new Date().toDateString();

  const stats = useMemo(() => {
    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    );
    const todayRevenue = todayOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const lowStockCount = storeProducts.filter(
      (sp) => sp.stockQty < 5 && sp.isAvailable
    ).length;

    return {
      todayOrderCount: todayOrders.length,
      todayRevenue,
      pendingCount,
      lowStockCount,
    };
  }, [orders, storeProducts, today]);

  const recentOrders = orders.slice(0, 5);

  const lowStockItems = useMemo(() => {
    return storeProducts
      .filter((sp) => sp.stockQty < 5)
      .sort((a, b) => a.stockQty - b.stockQty)
      .slice(0, 5)
      .map((sp) => ({
        sp,
        product: PRODUCTS.find((p) => p.id === sp.productId),
      }));
  }, [storeProducts]);

  const getOrderActions = (order: Order) => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="flex gap-1.5 flex-wrap">
            <QuickActionButton
              label="Confirm"
              variant="green"
              onClick={() => updateOrderStatus(order.id, 'confirmed')}
            />
            <QuickActionButton
              label="Cancel"
              variant="red"
              onClick={() => cancelOrder(order.id)}
            />
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex gap-1.5 flex-wrap">
            <QuickActionButton
              label="Start Preparing"
              variant="blue"
              onClick={() => updateOrderStatus(order.id, 'preparing')}
            />
            <QuickActionButton
              label="Cancel"
              variant="red"
              onClick={() => cancelOrder(order.id)}
            />
          </div>
        );
      case 'preparing':
        return (
          <QuickActionButton
            label="Mark Ready"
            variant="green"
            onClick={() => updateOrderStatus(order.id, 'ready')}
          />
        );
      case 'ready':
        return (
          <QuickActionButton
            label="Picked Up"
            variant="gray"
            onClick={() => updateOrderStatus(order.id, 'picked_up')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute role="storekeeper">
      <KeeperLayout>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page header */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={22} className="text-saffron-500" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {store?.name ?? 'Your Store'} — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Today's Orders"
              value={stats.todayOrderCount}
              icon={ShoppingBag}
              iconBg="bg-saffron-50"
              iconColor="text-saffron-600"
              subtitle="All statuses"
            />
            <StatCard
              label="Today's Revenue"
              value={formatPrice(stats.todayRevenue)}
              icon={IndianRupee}
              iconBg="bg-green-50"
              iconColor="text-green-600"
              subtitle="Excl. cancelled"
            />
            <StatCard
              label="Pending Orders"
              value={stats.pendingCount}
              icon={Clock}
              iconBg="bg-yellow-50"
              iconColor="text-yellow-600"
              subtitle="Awaiting action"
            />
            <StatCard
              label="Low Stock Items"
              value={stats.lowStockCount}
              icon={AlertTriangle}
              iconBg="bg-red-50"
              iconColor="text-red-500"
              subtitle="Qty < 5"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
                <a
                  href="/keeper/orders"
                  className="text-xs text-saffron-600 hover:text-saffron-700 font-medium"
                >
                  View all →
                </a>
              </div>
              <div className="overflow-x-auto">
                {recentOrders.length === 0 ? (
                  <div className="px-5 py-10 text-center text-gray-400 text-sm">
                    No orders yet today.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                        <th className="text-left px-5 py-3 font-medium">Order</th>
                        <th className="text-left px-3 py-3 font-medium">Customer</th>
                        <th className="text-left px-3 py-3 font-medium hidden sm:table-cell">Time</th>
                        <th className="text-right px-3 py-3 font-medium">Amount</th>
                        <th className="text-left px-3 py-3 font-medium">Status</th>
                        <th className="text-left px-3 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs text-gray-500">
                            {order.id.slice(-8)}
                          </td>
                          <td className="px-3 py-3 font-medium text-gray-800">
                            {order.customerName}
                          </td>
                          <td className="px-3 py-3 text-gray-500 text-xs hidden sm:table-cell">
                            {formatDateTime(order.createdAt)}
                          </td>
                          <td className="px-3 py-3 text-right font-semibold text-gray-900">
                            {formatPrice(order.totalAmount)}
                          </td>
                          <td className="px-3 py-3">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-3 py-3">{getOrderActions(order)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Low Stock Warning */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Low Stock Alert</h2>
                <a
                  href="/keeper/inventory"
                  className="text-xs text-saffron-600 hover:text-saffron-700 font-medium"
                >
                  Manage →
                </a>
              </div>
              <div className="p-4 space-y-3">
                {lowStockItems.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    <Package size={32} className="mx-auto mb-2 text-gray-300" />
                    All items well stocked!
                  </div>
                ) : (
                  lowStockItems.map(({ sp, product }) => (
                    <div
                      key={sp.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        sp.stockQty === 0
                          ? 'bg-red-50 border-red-100'
                          : 'bg-yellow-50 border-yellow-100'
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">
                        {product?.emoji ?? '📦'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {product?.name ?? sp.productId}
                        </p>
                        <p className="text-xs text-gray-500">{product?.brand}</p>
                      </div>
                      <span
                        className={`text-sm font-bold flex-shrink-0 ${
                          sp.stockQty === 0 ? 'text-red-600' : 'text-yellow-700'
                        }`}
                      >
                        {sp.stockQty === 0 ? 'Out' : `${sp.stockQty} left`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </KeeperLayout>
    </ProtectedRoute>
  );
}
