import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Clock,
  MessageSquare,
  LogOut,
  Store,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { STORES } from '../../data/mockStores';

interface Props {
  onClose?: () => void;
}

const NAV_LINKS = [
  {
    to: '/keeper/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    emoji: '📊',
  },
  {
    to: '/keeper/inventory',
    label: 'Inventory',
    icon: Package,
    emoji: '📦',
  },
  {
    to: '/keeper/orders',
    label: 'Orders',
    icon: ShoppingCart,
    emoji: '🛒',
  },
  {
    to: '/keeper/queries',
    label: 'Customer Queries',
    icon: MessageSquare,
    emoji: '💬',
  },
];

export default function KeeperSidebar({ onClose }: Props) {
  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const store = STORES.find((s) => s.id === currentUser?.assignedStoreId);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-200 w-64 min-h-screen">
      {/* Store branding */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow"
            style={{ backgroundColor: store?.logoColor ?? '#f57314' }}
          >
            <Store size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {store?.name ?? 'My Store'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser?.name ?? 'Keeper'}
            </p>
          </div>
        </div>
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Store Open
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Management
        </p>

        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-saffron-50 text-saffron-700 border border-saffron-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={isActive ? 'text-saffron-600' : 'text-gray-400 group-hover:text-gray-600'}
                />
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-saffron-500" />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Pickup Slots — disabled with Coming Soon tooltip */}
        <div className="relative group">
          <button
            disabled
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 cursor-not-allowed"
          >
            <Clock size={18} className="text-gray-300" />
            <span>Pickup Slots</span>
            <span className="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">
              Soon
            </span>
          </button>
          {/* Tooltip */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block z-10">
            <div className="bg-gray-800 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
              Coming Soon!
            </div>
          </div>
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-gray-100 pt-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
