import React, { useEffect, useState } from 'react';
import adminServices from '../../services/adminServices';
import { Table, Tag, Button, message, Spin } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminServices.getAllOrders();
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    setUpdating(true);
    try {
      await adminServices.markOrderAsDelivered(orderId);
      message.success('Order marked as delivered');
      fetchOrders();
    } catch (error) {
      console.error(error);
      message.error('Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'User',
      key: 'user',
      render: (_, record) =>
        record.user ? (
          <div>
            <p className="font-medium">{record.user.username}</p>
            <p className="text-sm text-gray-500">{record.user.email}</p>
          </div>
        ) : (
          'Guest'
        ),
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `₹${price}`,
    },
    {
      title: 'Paid',
      dataIndex: 'isPaid',
      key: 'isPaid',
      render: (isPaid, record) =>
        isPaid ? (
          <Tag color="green">Yes ({moment(record.paidAt).format('DD/MM/YYYY')})</Tag>
        ) : (
          <Tag color="red">No</Tag>
        ),
    },
    {
      title: 'Delivered',
      dataIndex: 'isDelivered',
      key: 'isDelivered',
      render: (isDelivered, record) =>
        isDelivered ? (
          <Tag color="green">Yes ({moment(record.deliveredAt).format('DD/MM/YYYY')})</Tag>
        ) : (
          <Tag color="orange">No</Tag>
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) =>
        !record.isDelivered && (
          <Button
            type="primary"
            loading={updating}
            onClick={() => handleMarkAsDelivered(record._id)}
          >
            Mark as Delivered
          </Button>
        ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link to="/admin/dashboard">
          <Button type="default">Go to Dashboard</Button>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
        />
      )}
    </div>
  );
};

export default AdminOrders;
