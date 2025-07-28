// pages/Orders/OrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Spin, 
  Alert, 
  Descriptions, 
  List, 
  Typography, 
  Tag, 
  Row, 
  Col,
  Divider,
  message 
} from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import orderServices from '../../services/orderServices';

const { Title, Text } = Typography;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const fetchedOrder = await orderServices.getOrderById(id);
      setOrder(fetchedOrder);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setError(error.message || 'Failed to load order details');
      message.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'processing':
        return 'blue';
      case 'shipped':
        return 'purple';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column'
      }}>
        <Spin size="large" />
        <Text style={{ marginTop: '1rem' }}>Loading order details...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
        <Alert
          message="Error Loading Order"
          description={error}
          type="error"
          showIcon
          action={
            <div>
              <Button onClick={fetchOrder} style={{ marginRight: '8px' }}>
                Retry
              </Button>
              <Button type="primary" onClick={() => navigate('/orders')}>
                Back to Orders
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
        <Alert
          message="Order Not Found"
          description="The order you're looking for doesn't exist."
          type="warning"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/orders')}
          style={{ marginBottom: '1rem' }}
        >
          Back to Orders
        </Button>
        <Title level={2}>Order Details</Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Order Information */}
        <Col xs={24} lg={16}>
          {/* Order Status and Info */}
          <Card title="Order Information" style={{ marginBottom: '1.5rem' }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Order ID" span={2}>
                <Text code>{order._id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(order.status || 'pending')}>
                  {(order.status || 'pending').toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {formatDate(order.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {order.paymentMethod || 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag color={order.isPaid ? 'green' : 'orange'}>
                  {order.isPaid ? 'PAID' : 'PENDING'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card title="Shipping Address" style={{ marginBottom: '1.5rem' }}>
              <div>
                <Text strong>{order.shippingAddress.fullName}</Text>
                <br />
                <Text>{order.shippingAddress.address}</Text>
                <br />
                <Text>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </Text>
                <br />
                <Text>{order.shippingAddress.country}</Text>
              </div>
            </Card>
          )}

          {/* Order Items */}
          <Card title={`Order Items (${order.orderItems?.length || 0})`}>
            <List
              itemLayout="horizontal"
              dataSource={order.orderItems || []}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <img 
                        src={item.image?.startsWith('/') ? `http://localhost:5000${item.image}` : item.image} 
                        alt={item.name}
                        style={{ 
                          width: 80, 
                          height: 80, 
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }} 
                        onError={(e) => {
                          e.target.src = '/default-product.jpg';
                        }}
                      />
                    }
                    title={
                      <div>
                        <Text strong>{item.name}</Text>
                        {item._id && (
                          <div style={{ marginTop: '4px' }}>
                            <Link to={`/product/${item._id}`}>
                              <Button type="link" size="small" style={{ padding: 0 }}>
                                View Product
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    }
                    description={
                      <div>
                        <Text>Quantity: {item.qty}</Text>
                        <br />
                        <Text type="secondary">₹{item.price} each</Text>
                      </div>
                    }
                  />
                  <div style={{ textAlign: 'right' }}>
                    <Text strong style={{ fontSize: '1.1rem' }}>
                      ₹{(item.price * item.qty).toFixed(2)}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <Card title="Order Summary" style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Text>Items Price:</Text>
                <Text>₹{order.itemsPrice?.toFixed(2) || '0.00'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Text>Shipping:</Text>
                <Text>₹{order.shippingPrice?.toFixed(2) || '0.00'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Text>Tax:</Text>
                <Text>₹{order.taxPrice?.toFixed(2) || '0.00'}</Text>
              </div>
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <Text strong style={{ fontSize: '1.2rem' }}>Total:</Text>
                <Text strong style={{ fontSize: '1.4rem', color: '#1890ff' }}>
                  ₹{order.totalPrice?.toFixed(2) || '0.00'}
                </Text>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Button 
                type="primary" 
                block
                onClick={() => navigate('/orders')}
              >
                View All Orders
              </Button>
              
              <Button 
                block
                icon={<HomeOutlined />}
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>

              {!order.isPaid && order.status !== 'cancelled' && (
                <Button 
                  type="primary" 
                  danger
                  block
                  onClick={() => {
                    // You can implement cancel order functionality here
                    message.info('Cancel order functionality not implemented yet');
                  }}
                >
                  Cancel Order
                </Button>
              )}
            </div>

            {/* Order Status Timeline (optional) */}
            <Divider />
            <div>
              <Text strong>Order Status:</Text>
              <div style={{ marginTop: '1rem' }}>
                <Tag color={getStatusColor(order.status || 'pending')} style={{ fontSize: '14px', padding: '8px 16px' }}>
                  {(order.status || 'pending').toUpperCase()}
                </Tag>
              </div>
              {order.isPaid && (
                <div style={{ marginTop: '0.5rem' }}>
                  <Text type="success">✓ Payment Confirmed</Text>
                </div>
              )}
              {order.isDelivered && (
                <div style={{ marginTop: '0.5rem' }}>
                  <Text type="success">✓ Delivered on {formatDate(order.deliveredAt)}</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetail;