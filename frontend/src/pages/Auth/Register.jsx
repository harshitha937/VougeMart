// components/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Form, Card, message } from 'antd';
import AuthServices from '../../services/authServices'; // Fixed import path
import { getErrorMessage } from '../../utils/GetError';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log('Registering user with data:', values);
      
      const response = await AuthServices.registerUser(values);
      console.log('Registration successful:', response.data);
      
      message.success("You're Registered Successfully!");
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      
      // Better error handling
      let errorMessage = 'Registration failed. Please try again.';
      
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
      <Card className="w-full max-w-lg shadow-lg dark:bg-gray-800 dark:text-gray-100 bg-gray text-white">
        <img
          src="https://img.icons8.com/ios/452/add-user-male.png"
          alt="Register"
          className="w-20 h-20 mx-auto mb-4"
        />

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Register
        </h2>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please enter a username!' },
              { min: 3, message: 'Username must be at least 3 characters!' }
            ]}
          >
            <Input placeholder="Username" className="dark:bg-gray-700 dark:text-gray-100" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter an email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input placeholder="Email" className="dark:bg-gray-700 dark:text-gray-100" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter a password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password placeholder="Password" className="dark:bg-gray-700 dark:text-gray-100" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="!bg-green-500 hover:!bg-green-600"
            >
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
          </Form.Item>

          <div className="text-center text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;