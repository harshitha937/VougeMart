import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineShopping,
  AiOutlineDashboard,
} from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
import { logoutUser } from '../services/authService';
import { message } from 'antd';

const Navigation = ({ collapsed, setCollapsed }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAuthenticated(authStatus);
    setIsAdmin(adminStatus);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setIsAdmin(false);
      message.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      message.error('Logout failed');
    }
  };

  const navItems = [
    { to: '/', icon: <AiOutlineHome />, label: 'Home' },
    ...(isAuthenticated
      ? [
          { to: '/products', icon: <AiOutlineShopping />, label: 'Products' },
          { to: '/favorites', icon: <FaHeart />, label: 'Favorites' },
          { to: '/cart', icon: <AiOutlineShopping />, label: 'Cart' },
          { to: '/my-orders', icon: <AiOutlineShopping />, label: 'Orders' },
          { to: '/profile', icon: <AiOutlineUser />, label: 'Profile' },
          ...(isAdmin
            ? [{ to: '/admin/dashboard', icon: <AiOutlineDashboard />, label: 'Admin Dashboard' }]
            : []),
          { to: '#', icon: <AiOutlineLogout />, label: 'Logout', action: handleLogout },
        ]
      : [
          { to: '/register', icon: <AiOutlineUserAdd />, label: 'Register' },
          { to: '/login', icon: <AiOutlineLogin />, label: 'Login' },
        ]),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 
        ${collapsed ? 'w-20' : 'w-64'} 
        bg-black text-white shadow-[0_0_30px_#f0abfc33]`}
    >
      {/* Header with toggle */}
      <div className="relative flex items-center justify-between px-4 py-4 border-b border-gray-800">
        {!collapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-rose-500 bg-clip-text text-transparent">
            VogueMart
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-4 text-white text-xl"
        >
          {collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="mt-4 space-y-1">
        {navItems.map((item, index) => {
          const active = isActive(item.to);
          const itemClasses = `
            group flex items-center gap-4 px-5 py-3 transition-all duration-200 
            ${active ? 'bg-fuchsia-800/80 text-white shadow-inner shadow-fuchsia-500/30' : 'hover:bg-fuchsia-700/50'} 
            ${collapsed ? 'justify-center' : ''}
            cursor-pointer rounded-lg mx-2
          `;

          // 🔹 Logout item (has action)
          if (item.action) {
            return (
              <div
                key={index}
                className={itemClasses}
                onClick={item.action}
              >
                <span className="text-xl text-fuchsia-400">{item.icon}</span>
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </div>
            );
          }

          // 🔹 Normal navigation item
          return (
            <Link
              key={index}
              to={item.to}
              className={itemClasses}
            >
              <span className={`text-xl ${active ? 'text-rose-300' : 'text-fuchsia-400'}`}>
                {item.icon}
              </span>
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;
