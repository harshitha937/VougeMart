// components/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Form, message, Card } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import AuthServices from "../../services/authServices"; // Fixed import path

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      console.log('Logging in with:', values);
      
      const response = await AuthServices.loginUser({
        email: values.email,
        password: values.password,
      });

      console.log('Login response:', response.data);

      // ✅ Extract user data from response
      const { _id, userId, username, email, isAdmin, token } = response.data;
      
      // ✅ Store user info in localStorage
      const userInfo = {
        _id: _id || userId,
        userId: userId || _id,
        username,
        email,
        isAdmin,
        token
      };
      
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      // ✅ Trigger storage event to update navbar/other components
      window.dispatchEvent(new Event('storage'));
      
      message.success(`Welcome, ${username}! Successfully logged in!`);
      navigate('/');
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Better error handling
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else {
        // Something else happened
        errorMessage = err.message || 'An unexpected error occurred.';
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black dark:bg-gray-900 text-white z-50">
      <Card className="w-full max-w-md shadow-lg dark:bg-gray-800 dark:text-gray-100">
        <img
          src="https://img.icons8.com/fluency/96/000000/login-rounded-right.png"
          alt="Login"
          className="w-20 h-20 mx-auto mb-4"
        />

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Login
        </h2>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
              className="dark:bg-gray-700 dark:text-gray-100"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              className="dark:bg-gray-700 dark:text-gray-100"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="!bg-blue-600 hover:!bg-blue-700"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </Form.Item>

          <div className="text-center text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;