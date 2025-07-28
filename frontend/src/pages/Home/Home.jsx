import React from 'react';
import Navigation from '../../components/Navigation';
import './Home.css';

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Navigation active="home" />
      <main className="flex-1 p-8 ml-48">
        <h1 className="text-2xl font-bold mb-4">This is home</h1>
        <p>Welcome to the homepage.</p>
      </main>
    </div>
  );
};

export default Home;
