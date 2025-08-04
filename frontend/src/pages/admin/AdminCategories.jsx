import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Spin,
} from 'antd';
import { Link } from 'react-router-dom';
import adminServices from '../../services/adminServices';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const res = await adminServices.getAllCategories();
      setCategories(res.data);
    } catch (err) {
      message.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setModalVisible(true);
    if (category) {
      form.setFieldsValue({ name: category.name });
    } else {
      form.resetFields();
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminServices.deleteCategoryById(id);
      message.success('Category deleted');
      fetchCategories();
    } catch (err) {
      message.error('Failed to delete');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await adminServices.updateCategoryById(editingCategory._id, values);
        message.success('Category updated');
      } else {
        await adminServices.createCategory(values);
        message.success('Category created');
      }
      setModalVisible(false);
      fetchCategories();
    } catch (err) {
      message.error('Operation failed');
    }
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button onClick={() => handleOpenModal(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this category?"
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
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <div className="bg-gray-900 text-white w-full max-w-5xl p-8 rounded-xl shadow-lg hover:shadow-[0_0_25px_#93c5fd60] transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Manage Categories</h2>
          <Link to="/admin/dashboard">
            <Button type="default">Go to Dashboard</Button>
          </Link>
        </div>

        <div className="mb-4">
          <Button type="primary" onClick={() => handleOpenModal()}>
            + Add Category
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin />
          </div>
        ) : (
          <div className="bg-white text-black p-4 rounded shadow overflow-x-auto">
            <Table dataSource={categories} columns={columns} rowKey="_id" />
          </div>
        )}

        <Modal
          title={editingCategory ? 'Edit Category' : 'Add Category'}
          open={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
          okText={editingCategory ? 'Update' : 'Create'}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Category Name"
              rules={[{ required: true, message: 'Please enter a category name' }]}
            >
              <Input placeholder="e.g., Electronics" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminCategories;
