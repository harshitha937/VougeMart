import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productServices';
import { Button, Spin, message } from 'antd';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch(() => message.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    message.success('Added to cart');
  };

  if (loading) {
    return (
      <div className="p-10 min-h-screen flex items-center justify-center bg-black text-white">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 min-h-screen flex items-center justify-center bg-black text-white">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-400">
        Product Details
      </h1>

      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start justify-center">
        {/* Product Image */}
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.name}
          className="w-full md:w-[400px] h-auto object-cover rounded-xl shadow-xl"
        />

        {/* Product Info */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 w-full md:w-1/2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Product Name</h2>
            <p className="text-lg text-gray-200">{product.name}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Description</h2>
            <p className="text-gray-300">{product.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Price</h2>
            <p className="text-2xl font-semibold text-green-400">₹{product.price}</p>
          </div>

          <div className="mt-4">
            <Button
              type="primary"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
