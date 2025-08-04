import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(favs);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h2 className="text-4xl font-extrabold text-blue-400 text-center mb-10">
        My Favorite Products
      </h2>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white/10 border border-white/10 rounded-2xl p-4 shadow-md hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 backdrop-blur-md"
            >
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-bold text-white">{product.name}</h3>
              <p className="text-green-400 font-semibold text-lg">₹{product.price}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg">You haven't added any favorites yet.</p>
      )}
    </div>
  );
};

export default Favorites;
