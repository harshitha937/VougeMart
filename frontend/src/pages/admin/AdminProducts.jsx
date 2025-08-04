import React, { useEffect, useState } from 'react';
import adminServices from '../../services/adminServices';
import {
  Button,
  message,
  Modal,
  Input,
  InputNumber,
  Upload,
  Select,
  Form,
  Spin,
} from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();

  const loadProducts = async () => {
    try {
      const res = await adminServices.getAllProducts();
      const list = res.data.products || res.data;
      setProducts(list);
    } catch (error) {
      message.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await adminServices.getAllCategories();
      setCategories(res.data);
    } catch {
      message.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const showAddModal = () => {
    setEditProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (product) => {
    setEditProduct(product);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      countInStock: product.countInStock,
      image: {
        fileList: [
          {
            uid: '-1',
            name: product.image,
            status: 'done',
            url: `http://localhost:5000/uploads/${product.image}`,
          },
        ],
      },
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminServices.deleteProductById(id);
      message.success('Deleted successfully');
      loadProducts();
    } catch {
      message.error('Delete failed');
    }
  };

  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price);
    formData.append('category', values.category);
    formData.append('countInStock', values.countInStock);
    const fileObj = values.image?.fileList?.[0]?.originFileObj;
    if (fileObj) {
      formData.append('image', fileObj);
    }

    try {
      if (editProduct) {
        await adminServices.updateProductById(editProduct._id, formData);
        message.success('Product updated!');
      } else {
        await adminServices.createProduct(formData);
        message.success('Product created!');
      }

      form.resetFields();
      loadProducts();
      setModalVisible(false);
    } catch (error) {
      console.log(error);
      message.error('Operation failed');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <div className="mb-4">
        <Link to="/admin/dashboard">
          <Button type="default">Go to Dashboard</Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border border-white/10 rounded-xl p-4 bg-white/10 backdrop-blur-md shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-300 mb-1">₹{product.price}</p>
              <p className="text-sm text-gray-400">
                Category: {product.category?.name || 'N/A'}
              </p>
              <div className="flex gap-2 mt-4">
                <Button type="primary" onClick={() => showEditModal(product)}>
                  Edit
                </Button>
                <Button danger onClick={() => handleDelete(product._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Button */}
      <div className="flex justify-center mt-10">
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          size="large"
          onClick={showAddModal}
        >
          Add Product
        </Button>
      </div>

      {/* Modal Form */}
      <Modal
        title={
          <h2 className="text-xl font-semibold text-center">
            {editProduct ? 'Edit Product' : 'Add Product'}
          </h2>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText={editProduct ? 'Update' : 'Create'}
        className="custom-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="space-y-4"
        >
          <Form.Item
            name="name"
            label={<span className="font-medium text-base">Product Name</span>}
            rules={[{ required: true, message: 'Enter product name' }]}
          >
            <Input className="rounded-md py-2 px-3" />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-medium text-base">Description</span>}
          >
            <Input.TextArea rows={3} className="rounded-md py-2 px-3" />
          </Form.Item>

          <Form.Item
            name="countInStock"
            label={<span className="font-medium text-base">Stock Count</span>}
            rules={[{ required: true, message: 'Enter stock count' }]}
          >
            <InputNumber min={0} className="w-full rounded-md py-2 px-3" />
          </Form.Item>

          <Form.Item
            name="price"
            label={<span className="font-medium text-base">Price</span>}
            rules={[{ required: true, message: 'Enter price' }]}
          >
            <InputNumber min={0} className="w-full rounded-md py-2 px-3" />
          </Form.Item>

          <Form.Item
            name="category"
            label={<span className="font-medium text-base">Category</span>}
            rules={[{ required: true, message: 'Select a category' }]}
          >
            <Select placeholder="Select category">
              {categories.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="image" label={<span className="font-medium text-base">Product Image</span>} valuePropName="file">
            <Upload beforeUpload={() => false} maxCount={1} listType="picture">
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProducts;
