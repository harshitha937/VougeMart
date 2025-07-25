import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import './Home.css';
const Home = () => {
  return (
    <div className="landing-hero min-h-screen flex flex-col text-white">
      <Navigation active="Home" />

      <main className="flex flex-col md:flex-row items-center justify-between flex-1 px-8 pt-[60px] relative z-10">
        {/* Left content */}
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Schedule your tasks <span className="text-blue-400">TODO!</span>
          </h1>
          <p className="text-lg text-gray-300">
            Organize, manage, and track your tasks efficiently.
          </p>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold"
            >
              Register
            </Link>
          </div>
        </div>
      </main>

      {/* Optional overlay for better contrast */}
      <div className="landing-overlay"></div>
    </div>
  );
};

export default Home;
