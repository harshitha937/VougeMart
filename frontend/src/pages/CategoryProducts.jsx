import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllProducts } from '../services/productServices';
import { getAllCategories } from '../services/categoryServices';
import { Row, Col, Empty, Spin } from 'antd';

const CategoryProducts = () => {
  const { id } = useParams(); // category ID from URL
  const [categoryName, setCategoryName] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);

        setAllCategories(catRes.data);

        // find category name
        const selectedCat = catRes.data.find((cat) => cat._id === id);
        setCategoryName(selectedCat ? selectedCat.name : 'Category');

        // filter products that belong to this category
        const filtered = prodRes.data.filter((product) => {
          const productCatId =
            typeof product.category === 'string'
              ? product.category
              : product.category?._id;
          return productCatId === id;
        });
        setProducts(filtered);
      } catch (err) {
        console.error('Error fetching category products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-fuchsia-400">{categoryName}</h1>
        <p className="text-gray-400 mt-2">Explore our collection of {categoryName}</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center mt-20">
          <Empty description="No Products Found" className="text-white" />
        </div>
      ) : (
        <div className="px-6 sm:px-10">
          <Row gutter={[20, 20]}>
            {products.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <div className="relative bg-white/10 text-white backdrop-blur-md border border-white/10 rounded-2xl shadow-md hover:shadow-fuchsia-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={`http://localhost:5000/uploads/${product.image}`}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-bold">{product.name}</h2>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {product.description.slice(0, 80)}...
                      </p>
                      <p className="font-semibold text-green-400 mt-1">
                        ₹{product.price}
                      </p>
                    </div>
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* 🔙 Back to Home or Category List */}
      <div className="text-center mt-12">
        <Link
          to="/"
          className="inline-block px-6 py-3 border border-fuchsia-700 text-fuchsia-400 rounded-full hover:bg-fuchsia-700/20 transition-all duration-300"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default CategoryProducts;
