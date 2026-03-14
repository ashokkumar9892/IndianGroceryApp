import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ChatWidget from './components/chat/ChatWidget';

import HomePage from './pages/HomePage';
import StoresPage from './pages/StoresPage';
import StorePage from './pages/StorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ComparePage from './pages/ComparePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import KeeperDashboardPage from './pages/keeper/KeeperDashboardPage';
import KeeperInventoryPage from './pages/keeper/KeeperInventoryPage';
import KeeperOrdersPage from './pages/keeper/KeeperOrdersPage';
import KeeperQueriesPage from './pages/keeper/KeeperQueriesPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/store/:storeId" element={<StorePage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/cart" element={
            <ProtectedRoute role="customer"><CartPage /></ProtectedRoute>
          } />
          <Route path="/checkout/:storeId" element={
            <ProtectedRoute role="customer"><CheckoutPage /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute role="customer"><OrdersPage /></ProtectedRoute>
          } />
          <Route path="/order/:orderId" element={
            <ProtectedRoute role="customer"><OrderTrackingPage /></ProtectedRoute>
          } />

          <Route path="/keeper/dashboard" element={
            <ProtectedRoute role="storekeeper"><KeeperDashboardPage /></ProtectedRoute>
          } />
          <Route path="/keeper/inventory" element={
            <ProtectedRoute role="storekeeper"><KeeperInventoryPage /></ProtectedRoute>
          } />
          <Route path="/keeper/orders" element={
            <ProtectedRoute role="storekeeper"><KeeperOrdersPage /></ProtectedRoute>
          } />
          <Route path="/keeper/queries" element={
            <ProtectedRoute role="storekeeper"><KeeperQueriesPage /></ProtectedRoute>
          } />

          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="text-6xl mb-4">🛒</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
              <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="bg-saffron-500 hover:bg-saffron-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                Go Home
              </a>
            </div>
          } />
        </Routes>
        <ChatWidget />
      </div>
    </BrowserRouter>
  );
}
