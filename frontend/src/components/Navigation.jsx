import React, { useEffect, useState } from 'react';
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineMenu,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineDashboard,
} from 'react-icons/ai';
import { FaHeart, FaBoxOpen, FaUsers, FaList } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../utils/GetUser';
import AuthServices from '../services/AuthSevices';

const Navigation = ({ active }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const updateUser = () => {
    const userInfo = getUserDetails();
    setUser(userInfo || null);
  };

  updateUser(); // initial fetch

  window.addEventListener('storage', updateUser); // 👈 listen

  return () => {
    window.removeEventListener('storage', updateUser); // cleanup
  };
}, []);


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

const handleLogout = async () => {
  try {
    await AuthServices.logoutUser();
    localStorage.removeItem('userInfo');
    setUser(null);
    window.dispatchEvent(new Event('storage')); // still helpful for other tabs
    setUser(null);
    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};


  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-black text-white z-50 transition-all duration-300 flex flex-col justify-between ${
        isOpen ? 'w-48' : 'w-16'
      }`}
    >
      <div className="p-4">
        <button onClick={toggleSidebar} className="mb-4">
          <AiOutlineMenu size={24} />
        </button>

        <nav className="space-y-6">
          <Link to="/" className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800 ${active === 'home' ? 'bg-gray-700' : ''}`}>
            <AiOutlineHome size={20} />
            {isOpen && <span>Home</span>}
          </Link>
          <Link to="/favorite" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800">
            <FaHeart size={18} />
            {isOpen && <span>Favorites</span>}
          </Link>
          <Link to="/products" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800">
            <AiOutlineShoppingCart size={20} />
            {isOpen && <span>Products</span>}
          </Link>
          <Link to="/cart" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800">
  <AiOutlineShoppingCart size={20} />
  {isOpen && <span>Cart</span>}
</Link>

          {user?.isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800">
                <AiOutlineDashboard size={20} />
                {isOpen && <span>Dashboard</span>}
              </Link>
              <Link to="/admin/categories" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800">
                <FaList size={18} />
                {isOpen && <span>Categories</span>}
              </Link>
              <Link to="/admin/orders" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800">
                <FaBoxOpen size={18} />
                {isOpen && <span>Orders</span>}
              </Link>
              <Link to="/admin/users" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800">
                <FaUsers size={18} />
                {isOpen && <span>Users</span>}
              </Link>
            </>
          ) : (
            user?.username  && (
              <Link to="/orders" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800">
                <FaBoxOpen size={18} />
                {isOpen && <span>Orders</span>}
              </Link>
            )
          )}
        </nav>
      </div>

      <div className="px-2 py-4 space-y-3 border-t border-gray-700">
        {user?.username  ? (
          <>
            <Link to="/profile" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800">
              <AiOutlineUser size={20} />
              {isOpen && <span>Profile</span>}
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-2 py-2 w-full text-left rounded hover:bg-gray-800">
              <AiOutlineLogout size={20} />
              {isOpen && <span>Logout</span>}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800">
              <AiOutlineLogin size={20} />
              {isOpen && <span>Login</span>}
            </Link>
            <Link to="/register" className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800">
              <AiOutlineUserAdd size={20} />
              {isOpen && <span>Register</span>}
            </Link>
          </>
        )}
      </div>
    </aside>
  );
};

export default Navigation;
