// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col h-full">
      <img
        src={`http://localhost:5000${product.image}`}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />

    
    </div>
  );
};

export default ProductCard;
