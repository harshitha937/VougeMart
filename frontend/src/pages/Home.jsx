import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Empty } from 'antd';
import { getAllProducts } from '../services/productServices';
import { getAllCategories } from '../services/categoryServices';
import { Link } from 'react-router-dom';

const { Search } = Input;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // 🔹 Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  // 🔹 Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  // 🔍 Handle Search
  const onSearch = (value) => {
    filterProducts(value, selectedCategory);
  };

  // 🧮 Filter Products
  const filterProducts = (searchTerm, categoryId) => {
    let results = products;

    if (categoryId) {
      results = results.filter((product) => {
        const prodCatId =
          typeof product.category === 'string'
            ? product.category
            : product.category?._id;
        return prodCatId === categoryId;
      });
    }

    if (searchTerm) {
      results = results.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(results);
  };

  // 🧩 Handle Category Change
  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setSelectedCategory(catId);
    filterProducts('', catId);
  };

  // Group products by category for display
  const groupedByCategory = {};
  filtered.forEach((product) => {
    const catName = product.category?.name || 'Uncategorized';
    if (!groupedByCategory[catName]) {
      groupedByCategory[catName] = [];
    }
    groupedByCategory[catName].push(product);
  });

  return (
    <div className="pb-10 bg-black min-h-screen text-white">
      {/* 🔍 Search + Category Filter */}
      <div className="max-w-4xl mx-auto my-8 px-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Search
          placeholder="Search products..."
          enterButton
          size="large"
          onSearch={onSearch}
          className="shadow-xl sm:w-2/3"
        />

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full sm:w-1/3 px-4 py-2 rounded-md border border-fuchsia-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🛍️ Products */}
      <div className="px-6 sm:px-10">
        {filtered.length === 0 ? (
          <div className="text-center mt-20">
            <Empty description="No Products Found" className="text-white" />
          </div>
        ) : (
          Object.entries(groupedByCategory).map(([categoryName, products]) => (
            <div key={categoryName} className="mb-14">
              <h2 className="text-3xl font-bold mb-4 text-fuchsia-400 border-b border-fuchsia-800 pb-1">
                {categoryName}
              </h2>
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
                          <p className="font-semibold text-green-400 mt-1">₹{product.price}</p>
                        </div>
                      </Link>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ))
        )}
      </div>

      {/* 📖 About Section with Category Links */}
      <div className="mt-16 bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 px-6 text-center shadow-inner shadow-fuchsia-800/20">
        <h3 className="text-3xl font-bold mb-4 text-fuchsia-400">About VogueMart</h3>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg mb-8">
          VogueMart is your ultimate destination for modern fashion, electronics, and lifestyle
          essentials. We bring you quality products, unbeatable prices, and a smooth online
          shopping experience — all in one place.
        </p>

        {/* 🏷️ Category List */}
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat._id}`}
              className="px-4 py-2 border border-fuchsia-700 rounded-full text-fuchsia-400 hover:bg-fuchsia-700/20 hover:text-fuchsia-300 transition-all duration-300"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 📢 Footer */}
      <footer className="bg-black text-white text-center py-4 mt-10 border-t border-fuchsia-900/40">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-fuchsia-500">VogueMart</span>. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
