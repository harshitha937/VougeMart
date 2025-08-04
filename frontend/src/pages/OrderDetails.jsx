import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../services/orderServices';
import { Spin, Descriptions, Tag } from 'antd';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spin className="mt-10" />;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Order Details</h2>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Order ID">{order._id}</Descriptions.Item>
        <Descriptions.Item label="Total Price">₹{order.totalPrice}</Descriptions.Item>
        <Descriptions.Item label="Paid">
          <Tag color={order.isPaid ? 'green' : 'red'}>
            {order.isPaid ? 'Paid' : 'Not Paid'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Delivered">
          <Tag color={order.isDelivered ? 'green' : 'red'}>
            {order.isDelivered ? 'Delivered' : 'Not Delivered'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Shipping Address">
          {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
          {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Method">
          {order.paymentMethod}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default OrderDetails;
