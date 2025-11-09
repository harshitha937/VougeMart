import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, InputNumber, message, Empty } from 'antd';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const handleQuantityChange = (value, record) => {
    if (!value || value < 1) return;
    const updatedCart = cartItems.map(item =>
      item._id === record._id ? { ...item, qty: value } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    message.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('Cart is empty');
      return;
    }
    navigate('/confirm-order');
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'title',
      render: (_, record) => (
        <div className="flex items-center gap-4">
<img
  src={
    record.image?.startsWith('http')
      ? record.image
      : `http://localhost:5000/uploads/${record.image}`
  }
  alt={record.title}
  className="w-16 h-16 object-cover rounded shadow"
/>

          <span className="text-white font-medium">{record.title}</span>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) => <span className="text-green-400">₹{price}</span>,
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.qty}
          onChange={(value) => handleQuantityChange(value, record)}
        />
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button danger onClick={() => handleRemove(record._id)}>
          Remove
        </Button>
      ),
    },
  ];

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
        🛒 My Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Empty description="Your cart is empty" />
        </div>
      ) : (
        <>
          <div className="bg-gray-900 rounded-lg p-4 shadow-md overflow-x-auto">
            <Table
              dataSource={cartItems}
              columns={columns}
              rowKey={(record) => `${record._id}-${record.qty}`}
              pagination={false}
              className="bg-gray-900 text-white"
            />
          </div>

          <div className="flex justify-between items-center mt-8">
            <h3 className="text-xl font-semibold">
              Total Price: <span className="text-green-400">₹{totalPrice}</span>
            </h3>
            <Button
              type="primary"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
