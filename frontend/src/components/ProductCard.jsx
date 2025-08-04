import { Card, Tooltip, message } from 'antd';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem('favorites')) || [];
    const alreadyExists = existing.some((item) => item._id === product._id);
    setIsFavorite(alreadyExists);
  }, [product._id]);

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    const existing = JSON.parse(localStorage.getItem('favorites')) || [];
    const alreadyExists = existing.some((item) => item._id === product._id);

    let updatedFavorites;

    if (alreadyExists) {
      updatedFavorites = existing.filter((item) => item._id !== product._id);
      message.warning('Removed from favorites');
      setIsFavorite(false);
    } else {
      updatedFavorites = [...existing, product];
      message.success('Added to favorites');
      setIsFavorite(true);
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="relative bg-white/10 text-white backdrop-blur-md border border-white/10 rounded-2xl shadow-md hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
      <div className="cursor-pointer" onClick={handleClick}>
        <img
          alt={product.name}
          src={`http://localhost:5000/uploads/${product.image}`}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
        <div className="p-4">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p className="text-sm text-gray-300 line-clamp-2">
            {product.description.slice(0, 80)}...
          </p>
          <p className="font-semibold text-green-400 mt-1">₹{product.price}</p>
        </div>
      </div>

      <Tooltip title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}>
        <span onClick={handleFavorite}>
          {isFavorite ? (
            <AiFillHeart className="absolute top-3 right-3 text-red-500 text-xl cursor-pointer hover:scale-110 transition-transform" />
          ) : (
            <AiOutlineHeart className="absolute top-3 right-3 text-red-500 text-xl cursor-pointer hover:scale-110 transition-transform" />
          )}
        </span>
      </Tooltip>
    </div>
  );
};

export default ProductCard;
