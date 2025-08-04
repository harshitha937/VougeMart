import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  message,
  Popconfirm,
  Tag,
  Spin,
  Modal,
  Form,
  Input,
} from 'antd';
import { Link } from 'react-router-dom';
import adminServices from '../../services/adminServices';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      const res = await adminServices.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await adminServices.deleteUserById(id);
      message.success('User deleted');
      fetchUsers();
    } catch (err) {
      message.error('Failed to delete user');
    }
  };

  const showEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
    });
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await adminServices.updateUserById(editingUser._id, values);
      message.success('User updated successfully');
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      message.error('Failed to update user');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin) =>
        isAdmin ? <Tag color="green">Admin</Tag> : <Tag color="blue">User</Tag>,
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Users</h2>
        <Link to="/admin/dashboard">
          <Button type="default">Go to Dashboard</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin />
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <Table dataSource={users} columns={columns} rowKey="_id" />
        </div>
      )}

      <Modal
        title="Edit User"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Update"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter a username' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter an email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
