import React, { useEffect, useState } from 'react';
import { getMyOrders, markOrderAsPaid } from '../services/orderServices';
import { Table, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState(null); // 👈 Track selected row
  const navigate = useNavigate();

  const fetchOrders = () => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkAsPaid = async (orderId) => {
    setLoading(true);
    try {
      const fakePaymentResult = {
        id: 'PAYID-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: 'fakepayer@example.com',
      };

      await markOrderAsPaid(orderId, fakePaymentResult);
      message.success('Marked as paid');
      fetchOrders();
    } catch (error) {
      console.error(error);
      message.error('Failed to mark as paid');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: <span className="text-black">Order ID</span>,
      dataIndex: '_id',
      render: (id) => (
        <div className="text-blue-400 px-3 py-2 rounded-md hover:bg-white hover:text-blue-500 transition duration-300">
          {id}
        </div>
      ),
    },
    {
      title: <span className="text-black">Paid</span>,
      dataIndex: 'isPaid',
      render: (paid) => (
        <div
          className={`px-3 py-2 rounded-md transition duration-300 text-center ${
            paid
              ? 'text-green-400 hover:bg-white hover:text-green-600'
              : 'text-red-400 hover:bg-white hover:text-red-600'
          }`}
        >
          {paid ? 'Paid' : 'Not Paid'}
        </div>
      ),
    },
    {
      title: <span className="text-black">Delivered</span>,
      dataIndex: 'isDelivered',
      render: (delivered) => (
        <div
          className={`px-3 py-2 rounded-md transition duration-300 text-center ${
            delivered
              ? 'text-green-400 hover:bg-white hover:text-green-600'
              : 'text-red-400 hover:bg-white hover:text-red-600'
          }`}
        >
          {delivered ? 'Delivered' : 'Not Delivered'}
        </div>
      ),
    },
    {
      title: <span className="text-black">Action</span>,
      render: (_, record) => (
        <div className="flex gap-3">
          <Button
            type="link"
            onClick={() => navigate(`/order/${record._id}`)}
            className="text-blue-500 hover:underline p-0"
          >
            View
          </Button>
          {!record.isPaid && (
            <Button
              type="primary"
              loading={loading}
              onClick={() => handleMarkAsPaid(record._id)}
              className="bg-green-600 hover:bg-green-700 border-none text-white"
            >
              Mark as Paid
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="bg-gray-900 w-full max-w-5xl p-8 rounded-xl shadow-xl hover:shadow-[0_0_25px_#f0abfc60] transition-all duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">My Orders</h2>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
          bordered
          rowClassName={(record) =>
            record._id === selectedRowKey ? 'bg-black-900 text-white' : ''
          }
          onRow={(record) => ({
            onClick: () => {
              setSelectedRowKey(record._id);
            },
          })}
        />
      </div>
    </div>
  );
};

export default MyOrders;
