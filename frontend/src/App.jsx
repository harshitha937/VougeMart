import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetails from './pages/ProductDetails';
import Favorites from './pages/Favorites';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Cart from './pages/Cart';
import ConfirmOrder from './pages/ConfirmOrder';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminProfile from './pages/admin/AdminProfile';
import CategoryProducts from './pages/CategoryProducts';
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // ⬅️ Shared state for sidebar collapse
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-black text-white min-h-screen transition-all duration-300">
      {/* Only show Navigation on non-admin pages */}
      {!isAdminRoute && (
        <Navigation collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      {/* Main content now responds to sidebar width */}
      <main
        className={`flex-1 transition-all duration-300 p-4 ${
          !isAdminRoute ? (collapsed ? 'ml-20' : 'ml-64') : ''
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/category/:id" element={<CategoryProducts />} />
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedAdminRoute>
                <AdminProducts />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedAdminRoute>
                <AdminProfile />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedAdminRoute>
                <AdminUsers />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedAdminRoute>
                <AdminOrders />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedAdminRoute>
                <AdminCategories />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
