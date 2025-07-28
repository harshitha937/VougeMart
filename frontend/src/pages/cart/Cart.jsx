import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, InputNumber, message } from 'antd';
import Navigation from '../../components/Navigation';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('cartItems');
    setCartItems(stored ? JSON.parse(stored) : []);
  }, []);

  const handleQtyChange = (id, qty) => {
    const updated = cartItems.map(item =>
      item._id === id ? { ...item, qty } : item
    );
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
  };

  const handleRemove = (id) => {
    const updated = cartItems.filter(item => item._id !== id);
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  const goToShipping = () => {
    if (cartItems.length === 0) return message.warning('Cart is empty');
    navigate('/shipping');
  };

  return (
    <>
      <Navigation active="cart" />
      <div className="ml-48 p-4">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty. <Link to="/products" className="text-blue-500">Go back</Link></p>
        ) : (
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                  <Link to={`/product/${item._id}`} className="font-medium text-lg">{item.name}</Link>
                </div>
                <div className="flex items-center gap-4">
                  ₹{item.price}
                  <InputNumber min={1} value={item.qty} onChange={(qty) => handleQtyChange(item._id, qty)} />
                  <Button danger onClick={() => handleRemove(item._id)}>Remove</Button>
                </div>
              </div>
            ))}

            <div className="mt-6 flex justify-between items-center">
              <h3 className="text-xl">Total: ₹{total}</h3>
              <Button type="primary" onClick={goToShipping}>Proceed to Checkout</Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
