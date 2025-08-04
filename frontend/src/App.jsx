import React from 'react';
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
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminProfile from './pages/admin/AdminProfile';
// 🔁 Extracted inner App layout to use location
const AppContent = () => {
  const location = useLocation();

  // 🧠 Hides Navigation on admin pages
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex">
      {/* Only show Navigation on non-admin pages */}
      {!isAdminRoute && <Navigation />}
      
      <main className={`flex-1 ${!isAdminRoute ? 'ml-64' : ''} p-4`}>
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
<Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
<Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>} />
<Route path="/admin/categories" element={<ProtectedAdminRoute><AdminCategories /></ProtectedAdminRoute>} />

      </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
