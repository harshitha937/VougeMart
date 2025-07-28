import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductServices from '../../services/ProductServices';
import Navigation from '../../components/Navigation';
import { Button, Spin, message, Input, Rate } from 'antd';
import { getUserDetails } from '../../utils/GetUser';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const user = getUserDetails();

  const fetchProduct = async () => {
    try {
      const { data } = await ProductServices.getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
      message.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!rating || !comment) {
      return message.warning('Rating and comment are required!');
    }

    try {
      await ProductServices.addProductReview(id, { rating, comment });
      message.success('Review added!');
      setRating(0);
      setComment('');
      fetchProduct(); // Refresh reviews
    } catch (err) {
      message.error(err.response?.data?.error || 'Failed to add review');
    }
  };

  const addToCart = () => {
    const stored = localStorage.getItem('cartItems');
    const cartItems = stored ? JSON.parse(stored) : [];

    const exists = cartItems.find(item => item._id === product._id);

    let updated;
    if (exists) {
      updated = cartItems.map(item =>
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updated = [...cartItems, {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1
      }];
    }

    localStorage.setItem('cartItems', JSON.stringify(updated));
    message.success('Item added to cart');
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <Spin size="large" className="mt-10 ml-20" />;

  if (!product) return <p className="text-white ml-20 mt-10">Product not found</p>;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Navigation active="" />
      <main className="flex-1 p-8 ml-48">
        <div className="flex flex-col md:flex-row gap-10">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            className="w-full md:w-1/2 h-96 object-cover rounded shadow"
          />
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Quantity:</strong> {product.quantity}</p>
            <p><strong>In Stock:</strong> {product.countInStock}</p>
            <p><strong>Rating:</strong> {product.rating} ({product.numReviews} reviews)</p>
            <p className="text-xl text-blue-400 font-semibold">₹{product.price}</p>

            <Button
              type="primary"
              className="!bg-blue-600 hover:!bg-blue-700"
              onClick={addToCart}
            >
              Add to Cart
            </Button>

            <Button onClick={() => setShowReviews(!showReviews)} className="mt-4">
              {showReviews ? 'Hide Reviews' : 'Show Reviews'}
            </Button>

            {showReviews && (
              <div className="mt-4 space-y-4">
                <h3 className="text-xl font-bold">Reviews</h3>

                {product.reviews?.length === 0 && <p>No reviews yet.</p>}
                {product.reviews?.map((rev, idx) => (
                  <div key={idx} className="bg-gray-800 p-4 rounded">
                    <p className="font-semibold">{rev.name}</p>
                    <Rate disabled defaultValue={rev.rating} />
                    <p>{rev.comment}</p>
                    <p className="text-sm text-gray-400">{new Date(rev.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}

            {user && (
              <div className="mt-8 bg-gray-800 p-6 rounded shadow space-y-3">
                <h3 className="text-lg font-semibold">Add Your Review</h3>
                <Rate onChange={(value) => setRating(value)} value={rating} />
                <Input.TextArea
                  placeholder="Your comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button onClick={submitReview} className="!bg-green-600 hover:!bg-green-700">
                  Submit Review
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
