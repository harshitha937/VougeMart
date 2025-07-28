import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card } from 'antd';

const Shipping = () => {
  const navigate = useNavigate();
  const [shippingData, setShippingData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('shippingAddress');
    if (stored) {
      setShippingData(JSON.parse(stored));
    }
  }, []);

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingData));
    navigate('/checkout');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card title="Shipping Address" className="w-full max-w-md">
        <Form layout="vertical" onFinish={handleSubmit} initialValues={shippingData}>
          <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Please enter your full name' }]}>
            <Input name="fullName" value={shippingData.fullName} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please enter your address' }]}>
            <Input name="address" value={shippingData.address} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="City" name="city" rules={[{ required: true, message: 'Please enter your city' }]}>
            <Input name="city" value={shippingData.city} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Postal Code" name="postalCode" rules={[{ required: true, message: 'Please enter your postal code' }]}>
            <Input name="postalCode" value={shippingData.postalCode} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Country" name="country" rules={[{ required: true, message: 'Please enter your country' }]}>
            <Input name="country" value={shippingData.country} onChange={handleChange} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Continue to Checkout
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Shipping;
