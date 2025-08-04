import React, { useState, useEffect } from 'react';
import { Input, Button, Form, message, Divider, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { createOrder } from '../services/orderServices';

const ConfirmOrder = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showPayPal, setShowPayPal] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(stored);
  }, []);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const onFinish = async (values) => {
    if (paymentMethod === 'COD') {
      await placeOrder(values, 'Cash On Delivery');
    } else {
      setShowPayPal(true);
    }
  };

  const placeOrder = async (values, method) => {
    const orderData = {
      shippingAddress: values,
      orderItems: cartItems.map(item => ({
        product: item._id,
        quantity: item.qty,
      })),
      paymentMethod: method,
      totalPrice: total,
    };

    try {
      await createOrder(orderData);
      localStorage.removeItem('cart');
      message.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      console.error(err);
      message.error('Failed to place order.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-zinc-900 p-8 rounded-xl shadow-xl hover:shadow-[0_0_25px_#f0abfc60] transition-all duration-300">
        <h2 className="text-3xl font-bold mb-6 text-center text-fuchsia-500">Confirm Your Order</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-white">Order Details</h3>
          {cartItems.map((item, index) => (
            <div key={`${item._id}-${index}`} className="flex justify-between text-gray-300 my-1">
              <span>{item.title} x {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4 text-white">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        <Divider className="bg-gray-700" />

        <h3 className="text-xl font-semibold mb-3 text-white">Shipping Details</h3>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="text-white"
        >
          <Form.Item
            name="address"
            label={<span className="text-gray-200 font-medium">Address</span>}
            rules={[{ required: true }]}
          >
            <Input size="large" className="bg-zinc-800 text-white border-gray-600" />
          </Form.Item>

          <Form.Item
            name="city"
            label={<span className="text-gray-200 font-medium">City</span>}
            rules={[{ required: true }]}
          >
            <Input size="large" className="bg-zinc-800 text-white border-gray-600" />
          </Form.Item>

          <Form.Item
            name="postalCode"
            label={<span className="text-gray-200 font-medium">Postal Code</span>}
            rules={[{ required: true }]}
          >
            <Input size="large" className="bg-zinc-800 text-white border-gray-600" />
          </Form.Item>

          <Form.Item
            name="country"
            label={<span className="text-gray-200 font-medium">Country</span>}
            rules={[{ required: true }]}
          >
            <Input size="large" className="bg-zinc-800 text-white border-gray-600" />
          </Form.Item>

          <Divider className="bg-gray-700" />

          <h3 className="text-xl font-semibold mb-3 text-white">Payment Method</h3>
          <Form.Item>
            <Radio.Group
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="text-white"
            >
              <Radio value="COD" className="text-white">Cash On Delivery</Radio>
              <Radio value="PayPal" className="text-white">PayPal</Radio>
            </Radio.Group>
          </Form.Item>

          {!showPayPal && (
            <Button
              type="primary"
              htmlType="submit"
              block
              className="mt-6 bg-fuchsia-600 hover:bg-fuchsia-700 border-none text-white font-semibold text-lg"
            >
              {paymentMethod === 'COD' ? 'Place Order' : 'Proceed to PayPal'}
            </Button>
          )}
        </Form>

        {showPayPal && (
          <div className="mt-6">
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: (total / 83).toFixed(2),
                    },
                  }],
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                const shipping = form.getFieldsValue();
                await placeOrder(shipping, 'PayPal');
              }}
              onCancel={() => {
                message.warning('Payment cancelled.');
              }}
              onError={(err) => {
                console.error(err);
                message.error('PayPal error.');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmOrder;
