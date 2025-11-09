import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation';

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  const sections = [
    { label: 'Manage Products', path: '/admin/products', color: 'text-purple-400' },
    { label: 'Manage Orders', path: '/admin/orders', color: 'text-yellow-400' },
    { label: 'Manage Categories', path: '/admin/categories', color: 'text-green-400' },
    { label: 'Manage Users', path: '/admin/users', color: 'text-red-400' },
  ];

  return (
    <div className="flex bg-black text-white min-h-screen transition-all duration-300">
      {/* 🧱 Sidebar */}
      <Navigation collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* 📄 Main Dashboard Content */}
      <div
        className={`flex-1 p-6 sm:p-8 transition-all duration-300 ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
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
              localStorage.clear();
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <Link
              key={index}
              to={section.path}
              className="flex items-center justify-center p-6 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition-all duration-300"
            >
              <span className={`text-lg font-semibold ${section.color}`}>
                {section.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
