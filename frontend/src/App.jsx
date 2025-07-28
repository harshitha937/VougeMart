// App.js
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Register from './pages/Auth/Register.jsx';
import Login from './pages/Auth/Login.jsx';
import Products from './pages/Products/Products.jsx';
import ProductDetails from './pages/Products/ProductDetails.jsx';
import Cart from './pages/cart/Cart.jsx';
import Shipping from './pages/Shipping.jsx';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders/OrderDetail.jsx';
import OrderDetail from './pages/Orders/OrderDetail.jsx';
import 'antd/dist/reset.css';

function App() {
  return (
 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:id" element={<OrderDetail />} />
        </Routes>
      </BrowserRouter>
    
  );
}

export default App;