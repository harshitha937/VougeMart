// pages/Checkout.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import orderServices, { isAuthenticated } from '../services/orderServices';
import { 
  Button, 
  message, 
  Divider, 
  Card, 
  List, 
  Spin, 
  Row, 
  Col, 
  Typography,
  Alert,
  Empty
} from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CheckoutPage = () => {
  const cartContext = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication first
  useEffect(() => {
    if (!isAuthenticated()) {
      message.warning('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Debug: Log cart context
  useEffect(() => {
    console.log('Checkout: CartContext received:', cartContext);
    console.log('Checkout: Cart items:', cartContext?.cartItems);
    console.log('Checkout: Cart loading:', cartContext?.loading);
  }, [cartContext]);

  // Load shipping address
  useEffect(() => {
    const loadShippingAddress = async () => {
      try {
        const stored = localStorage.getItem('shippingAddress');
        console.log('Checkout: Shipping address from localStorage:', stored);
        
        if (!stored) {
          console.log('Checkout: No shipping address, redirecting to shipping');
          message.warning('Please add shipping address first');
          navigate('/shipping');
          return;
        }
        
        const parsedAddress = JSON.parse(stored);
        setShippingAddress(parsedAddress);
        console.log('Checkout: Shipping address loaded:', parsedAddress);
      } catch (error) {
        console.error('Checkout: Error parsing shipping address:', error);
        message.error('Invalid shipping address');
        navigate('/shipping');
      } finally {
        setAddressLoading(false);
      }
    };

    loadShippingAddress();
  }, [navigate]);

  // Handle missing context
  if (!cartContext) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', textAlign: 'center' }}>
        <Alert
          message="Cart Error"
          description="Unable to load cart. Please refresh the page."
          type="error"
        />
        <Button 
          type="primary" 
          style={{ marginTop: '1rem' }}
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  const { cartItems = [], clearCart, loading: cartLoading } = cartContext;

  // Calculate prices
  const calculatePrices = () => {
    const itemsPrice = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.qty) || 0;
      return acc + (price * qty);
    }, 0);
    
    const shippingPrice = itemsPrice > 1000 ? 0 : 50;
    const taxRate = 0.1;
    const taxPrice = itemsPrice * taxRate;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    
    return {
      itemsPrice: parseFloat(itemsPrice.toFixed(2)),
      shippingPrice: parseFloat(shippingPrice.toFixed(2)),
      taxPrice: parseFloat(taxPrice.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2))
    };
  };

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrices();

  const handlePlaceOrder = async () => {
    // Validation checks
    if (!isAuthenticated()) {
      message.error('Please login to place order');
      navigate('/login');
      return;
    }

    if (!shippingAddress) {
      message.warning('Shipping address is required');
      navigate('/shipping');
      return;
    }

    if (cartItems.length === 0) {
      message.warning('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // Prepare order data according to your backend model
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: parseInt(item.qty),
          image: item.image || '/default-product.jpg',
          price: parseFloat(item.price),
          _id: item._id, // This will be mapped to 'product' field in backend
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || 'India'
        },
        paymentMethod: 'PayPal', // Default payment method
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      console.log('Checkout: Placing order with data:', orderData);

      const response = await orderServices.createOrder(orderData);
      
      if (response && response._id) {
        message.success('Order placed successfully!');
        clearCart();
        
        // Navigate to order details page
        navigate(`/order/${response._id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Checkout: Order placement error:', error);
      
      // Handle specific error cases
      if (error.message.includes('Not authorized')) {
        message.error('Please login again to place order');
        navigate('/login');
      } else if (error.message.includes('No order items')) {
        message.error('Your cart is empty');
      } else if (error.message.includes('Shipping address')) {
        message.error('Please add a valid shipping address');
        navigate('/shipping');
      } else {
        message.error(error.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while cart or address is loading
  if (cartLoading || addressLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column'
      }}>
        <Spin size="large" />
        <Text style={{ marginTop: '1rem' }}>Loading checkout...</Text>
      </div>
    );
  }

  // Show empty cart message
  if (!cartItems || cartItems.length === 0) {
    console.log('Checkout: Showing empty cart message');
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', textAlign: 'center' }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Your cart is empty"
        >
          <Link to="/products">
            <Button type="primary" icon={<ShoppingCartOutlined />}>
              Continue Shopping
            </Button>
          </Link>
        </Empty>
        
        {/* Debug info - Remove in production */}
        <Card title="Debug Info" style={{ marginTop: '2rem', textAlign: 'left' }}>
          <p><strong>Cart items length:</strong> {cartItems?.length || 0}</p>
          <p><strong>Cart loading:</strong> {cartLoading ? 'Yes' : 'No'}</p>
          <p><strong>Authentication:</strong> {isAuthenticated() ? 'Authenticated' : 'Not authenticated'}</p>
          <p><strong>LocalStorage cart:</strong></p>
          <pre style={{ fontSize: '10px', background: '#f5f5f5', padding: '10px' }}>
            {localStorage.getItem('cartItems')}
          </pre>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Card>
      </div>
    );
  }

  console.log('Checkout: Rendering full checkout with', cartItems.length, 'items');

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/cart')}
          style={{ marginBottom: '1rem' }}
        >
          Back to Cart
        </Button>
        <Title level={2}>Checkout</Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Order Items */}
        <Col xs={24} lg={16}>
          <Card title={`Order Items (${cartItems.length})`} style={{ marginBottom: '1rem' }}>
            <List
              itemLayout="horizontal"
              dataSource={cartItems}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <img 
                        src={item.image?.startsWith('/') ? `http://localhost:5000${item.image}` : item.image} 
                        alt={item.name}
                        style={{ 
                          width: 60, 
                          height: 60, 
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }} 
                        onError={(e) => {
                          e.target.src = '/default-product.jpg';
                        }}
                      />
                    }
                    title={<Text strong>{item.name}</Text>}
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

          {/* Shipping Address */}
          {shippingAddress && (
            <Card 
              title="Shipping Address" 
              extra={
                <Button type="link" onClick={() => navigate('/shipping')}>
                  Edit
                </Button>
              }
            >
              <div>
                <Text strong>{shippingAddress.fullName}</Text>
                <br />
                <Text>{shippingAddress.address}</Text>
                <br />
                <Text>{shippingAddress.city}, {shippingAddress.postalCode}</Text>
                <br />
                <Text>{shippingAddress.country || 'India'}</Text>
              </div>
            </Card>
          )}
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <Card title="Order Summary" style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Text>Items ({cartItems.length}):</Text>
                <Text>₹{itemsPrice.toFixed(2)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Text>Shipping:</Text>
                <Text>₹{shippingPrice.toFixed(2)}</Text>
              </div>
              {shippingPrice === 0 && (
                <Text type="success" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>
                  Free shipping on orders over ₹1000!
                </Text>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Text>Tax (10%):</Text>
                <Text>₹{taxPrice.toFixed(2)}</Text>
              </div>
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <Text strong style={{ fontSize: '1.1rem' }}>Total:</Text>
                <Text strong style={{ fontSize: '1.3rem', color: '#1890ff' }}>
                  ₹{totalPrice.toFixed(2)}
                </Text>
              </div>
            </div>

            <Button 
              type="primary" 
              size="large"
              block 
              loading={loading}
              disabled={cartItems.length === 0 || !shippingAddress || !isAuthenticated()}
              onClick={handlePlaceOrder}
              style={{ height: '50px', fontSize: '1.1rem' }}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>

            <Alert
              message="Secure Checkout"
              description="Your payment information is encrypted and secure."
              type="info"
              showIcon
              style={{ marginTop: '1rem' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;