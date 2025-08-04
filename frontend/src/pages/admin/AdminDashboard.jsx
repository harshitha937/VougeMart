import React from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaClipboardList, FaTags, FaUserCog } from 'react-icons/fa';

const AdminDashboard = () => {
  const sections = [
    {
      label: 'Manage Products',
      icon: <FaBoxOpen className="text-xl mr-3 text-purple-400" />,
      path: '/admin/products',
    },
    {
      label: 'Manage Orders',
      icon: <FaClipboardList className="text-xl mr-3 text-yellow-400" />,
      path: '/admin/orders',
    },
    {
      label: 'Manage Categories',
      icon: <FaTags className="text-xl mr-3 text-green-400" />,
      path: '/admin/categories',
    },
    {
      label: 'Manage Users',
      icon: <FaUserCog className="text-xl mr-3 text-red-400" />,
      path: '/admin/users',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Top Right Buttons */}
      <div className="flex justify-end gap-4 mb-6">
        <Link
          to="/admin/profile"
          className="text-blue-400 hover:text-blue-300 font-medium transition"
        >
          Profile
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdmin');
            window.location.href = '/login';
          }}
          className="text-red-400 hover:text-red-300 font-medium transition"
        >
          Logout
        </button>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <Link
            key={index}
            to={section.path}
            className="flex items-center p-5 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition-all duration-300"
          >
            {section.icon}
            <span className="text-lg font-semibold text-white">{section.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
