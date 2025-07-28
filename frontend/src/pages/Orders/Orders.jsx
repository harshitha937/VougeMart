// pages/Orders/Orders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Spin, 
  Alert, 
  List, 
  Typography, 
  Tag, 
  Empty,
  Row,
  Col,
  message 
} from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import orderServices, { isAuthenticated } from '../../services/orderServices';

const { Title, Text } = Typography;

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      message.warning('Please login to view your orders');
      navigate('/login');
      return;
    }
    
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const fetchedOrders = await orderServices.getUserOrders();
      console.log('Fetched orders:', fetchedOrders);
      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError(error.message || 'Failed to load orders');
      
      // If it's an auth error, redirect to login
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        message.error('Please login again');
        navigate('/login');
      }
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
        <Text style={{ marginTop: '1rem' }}>Loading your orders...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
        <Alert
          message="Failed to Load Orders"
          description={error}
          type="error"
          showIcon
          action={
            <div>
              <Button onClick={fetchOrders} style={{ marginRight: '8px' }}>
                Retry
              </Button>
              <Button type="primary" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Title level={2}>My Orders</Title>
        <Button 
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text style={{ fontSize: '18px', display: 'block', marginBottom: '8px' }}>
                  No orders yet
                </Text>
                <Text type="secondary">
                  When you make your first purchase, it will appear here.
                </Text>
              </div>
            }
          >
            <Button 
              type="primary" 
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </Button>
          </Empty>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <Card key={order._id} hoverable>
              <Row gutter={[16, 16]} align="middle">
                {/* Order Info */}
                <Col xs={24} sm={12} md={8}>
                  <div>
                    <Text strong style={{ fontSize: '16px' }}>
                      Order #{order._id?.slice(-8)}
                    </Text>
                    <br />
                    <Text type="secondary">
                      {formatDate(order.createdAt)}
                    </Text>
                    <br />
                    <Tag 
                      color={getStatusColor(order.status || 'pending')} 
                      style={{ marginTop: '8px' }}
                    >
                      {(order.status || 'pending').toUpperCase()}
                    </Tag>
                  </div>
                </Col>

                {/* Items Preview */}
                <Col xs={24} sm={12} md={8}>
                  <div>
                    <Text type="secondary">Items ({order.orderItems?.length || 0}):</Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                      {order.orderItems?.slice(0, 3).map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {item.image && (
                            <img
                              src={item.image?.startsWith('/') ? `http://localhost:5000${item.image}` : item.image}
                              alt={item.name}
                              style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                              onError={(e) => {
                                e.target.src = '/default-product.jpg';
                              }}
                            />
                          )}
                          <div>
                            <Text style={{ fontSize: '12px' }}>{item.name?.slice(0, 20)}...</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              Qty: {item.qty}
                            </Text>
                          </div>
                        </div>
                      ))}
                      {(order.orderItems?.length || 0) > 3 && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          +{(order.orderItems?.length || 0) - 3} more
                        </Text>
                      )}
                    </div>
                  </div>
                </Col>

                {/* Total and Actions */}
                <Col xs={24} sm={24} md={8}>
                  <div style={{ textAlign: 'right' }}>
                    <Text strong style={{ fontSize: '20px', color: '#1890ff' }}>
                      ₹{order.totalPrice?.toFixed(2) || '0.00'}
                    </Text>
                    <br />
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Button 
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                    
                    {/* Payment Status */}
                    <div style={{ marginTop: '8px' }}>
                      <Tag color={order.isPaid ? 'green' : 'orange'} style={{ fontSize: '11px' }}>
                        {order.isPaid ? 'PAID' : 'PAYMENT PENDING'}
                      </Tag>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Order Summary Bar */}
              <div style={{ 
                marginTop: '16px', 
                paddingTop: '16px', 
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                  <Text type="secondary">Items: ₹{order.itemsPrice?.toFixed(2) || '0.00'}</Text>
                  <Text type="secondary">Shipping: ₹{order.shippingPrice?.toFixed(2) || '0.00'}</Text>
                  <Text type="secondary">Tax: ₹{order.taxPrice?.toFixed(2) || '0.00'}</Text>
                </div>
                
                {order.shippingAddress && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Shipping to: {order.shippingAddress.city}
                  </Text>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button (if you implement pagination) */}
      {orders.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Text type="secondary">
            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
          </Text>
        </div>
      )}
    </div>
  );
};

export default Orders;