import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X, Store, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { getInitials } from '../../utils/formatters';

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuthStore();
  const getItemCount = useCartStore(s => s.getItemCount);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-orange-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">AK</span>
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900">Apna</span>
              <span className="font-bold text-xl text-saffron-500">Kirana</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/stores" className="text-gray-600 hover:text-saffron-600 font-medium transition-colors flex items-center gap-1">
              <Store size={16} /> Stores
            </Link>
            <Link to="/compare" className="text-gray-600 hover:text-saffron-600 font-medium transition-colors">
              ⚖️ Compare
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            {currentUser?.role === 'customer' && (
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-saffron-600 transition-colors">
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-saffron-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.role === 'storekeeper' && (
                  <Link to="/keeper/dashboard"
                    className="hidden md:flex items-center gap-1 text-sm font-medium text-leaf-700 hover:text-leaf-800 bg-leaf-50 hover:bg-leaf-100 px-3 py-1.5 rounded-lg transition-colors">
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center gap-2 bg-saffron-50 hover:bg-saffron-100 rounded-full pl-2 pr-3 py-1.5 transition-colors">
                    <div className="w-7 h-7 bg-saffron-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(currentUser.name)}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">{currentUser.name.split(' ')[0]}</span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-2 min-w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {currentUser.role === 'customer' && (
                      <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <ShoppingCart size={14} /> My Orders
                      </Link>
                    )}
                    {currentUser.role === 'storekeeper' && (
                      <Link to="/keeper/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard size={14} /> Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-saffron-600 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="text-sm font-medium bg-saffron-500 hover:bg-saffron-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link to="/stores" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>🏪 All Stores</Link>
          <Link to="/compare" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>⚖️ Compare Prices</Link>
          {isAuthenticated && currentUser?.role === 'customer' && (
            <Link to="/orders" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
          )}
          {isAuthenticated && currentUser?.role === 'storekeeper' && (
            <Link to="/keeper/dashboard" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
          )}
          {isAuthenticated && (
            <button onClick={handleLogout} className="block py-2 text-red-600 font-medium w-full text-left">🚪 Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}
