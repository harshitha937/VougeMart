import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await loginUser(values);
      const { user } = res;

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');

      message.success('Login successful!');
      if (user.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl hover:shadow-[0_0_25px_#f0abfc60] transition-all duration-300">
        <h2 className="text-3xl font-bold mb-6 text-center text-fuchsia-600">Login to VogueMart</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label={<span className="font-medium text-gray-700">Email</span>}
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input placeholder="Enter your email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="font-medium text-gray-700">Password</span>}
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Enter your password" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="bg-fuchsia-600 hover:bg-fuchsia-700 border-none text-white font-semibold text-lg mt-4"
          >
            Login
          </Button>
        </Form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/register" className="text-fuchsia-600 hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
