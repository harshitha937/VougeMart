import React, { useEffect, useState } from 'react';
import { Input, Pagination, Spin, Card, Row, Col, message } from 'antd';
import { Link } from 'react-router-dom';
import ProductServices from '../../services/ProductServices.js';
import Navigation from '../../components/Navigation';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await ProductServices.fetchProducts(keyword, page);
      setProducts(data.products);
      setPages(data.pages);
    } catch (err) {
      message.error('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [keyword, page]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Navigation active="products" />

      <main className="flex-1 p-8 ml-48">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>

        <Input.Search
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={loadProducts}
          enterButton
          className="mb-6 max-w-lg"
        />

        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {products.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                  <Link to={`/product/${product._id}`}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={product.name}
                          src={`http://localhost:5000${product.image}`}
                          className="h-48 w-full object-cover"
                        />
                      }
                    >
                      <Card.Meta
                        title={product.name}
                        description={
                          <div>
                            <p className="text-sm text-gray-400">{product.brand}</p>
                            <p className="text-lg font-semibold text-blue-400">₹{product.price}</p>
                          </div>
                        }
                      />
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>

            <div className="flex justify-center mt-6">
              <Pagination
                current={page}
                total={pages * 10}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Products;
