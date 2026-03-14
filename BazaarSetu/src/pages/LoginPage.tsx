import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const DEMO_ACCOUNTS = [
  { label: 'Demo Customer', email: 'priya@example.com', password: 'password123' },
  { label: 'Demo Keeper (Spice Garden)', email: 'keeper@spicegarden.com', password: 'keeper123' },
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, currentUser, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'storekeeper') {
        navigate('/keeper/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = login(email.trim(), password);
    setLoading(false);
    if (ok) {
      const user = useAuthStore.getState().currentUser;
      if (user?.role === 'storekeeper') {
        navigate('/keeper/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  const handleDemoLogin = (demo: (typeof DEMO_ACCOUNTS)[number]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#f57314] to-orange-500 px-8 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mb-3">
              <span className="text-3xl font-extrabold text-white tracking-tight">AK</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">ApnaKirana</h1>
            <p className="text-orange-100 text-sm mt-1">Your Indian Grocery Store</p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Sign In</h2>

            {error && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f57314]/40 focus:border-[#f57314] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f57314]/40 focus:border-[#f57314] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 inset-y-0 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#f57314] hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 disabled:opacity-60"
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-5">
              <p className="text-xs text-gray-400 text-center mb-2">Quick demo access</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {DEMO_ACCOUNTS.map((d) => (
                  <button
                    key={d.email}
                    onClick={() => handleDemoLogin(d)}
                    className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium rounded-full hover:bg-orange-100 transition"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[#f57314] hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
