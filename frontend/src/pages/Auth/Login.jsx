import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Form, message, Card } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import AuthServices from '../../services/authSevices'; 
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const onFinish = async (values) => {
  setLoading(true);

  try {
    const response = await AuthServices.loginUser({
      email:values.email,
      password: values.password,
    });

    // ✅ response.data has the real JWT
    const { token, userId, userName, firstName, lastName } = response.data;


    // ✅ Optionally store user details if you want
    localStorage.setItem(
      'toDoAppUser',
      JSON.stringify({token, userId, userName, firstName, lastName })
    );

    message.success(`Welcome, ${userName}!`);
    navigate('/todo');

  } catch (err) {
    console.error(err);
    message.error(err?.response?.data?.message || 'Login failed!');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-black dark:bg-gray-900 text-white z-50 ">
      <Card className="w-full max-w-md shadow-lg dark:bg-gray-800 dark:text-gray-100">
        {/* ✅ Ant Design-style login image */}
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
            rules={[{ required: true, message: 'Please input your Username!' }]}
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
            rules={[{ required: true, message: 'Please input your Password!' }]}
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
              Log in
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
