import React, { useEffect, useState } from 'react';
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineUnorderedList,
  AiOutlineMenu,
  AiOutlineLike
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { getUserDetails } from '../utils/GetUser';

const Navigation = ({ active }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );
  const [user, setUser] = useState('');

  useEffect(() => {
    const userCredits = getUserDetails();
    if (userCredits) {
      setUser(userCredits);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLike = () => {
    alert('You liked this!');
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black dark:bg-gray-900 text-white z-50 shadow-md flex items-center justify-between px-4 h-[60px]">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden">
          <AiOutlineMenu size={24} />
        </button>
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          TaskApp
        </Link>
      </div>

      <nav
        className={`${
          isOpen ? 'block' : 'hidden'
        } absolute md:static top-[60px] left-0 w-full md:w-auto bg-black dark:bg-gray-900 md:flex md:items-center md:gap-8 p-4 md:p-0`}
      >
        <ul className="flex flex-col md:flex-row md:items-center gap-6">
          <li>
            <Link
              to="/"
              className={`flex items-center gap-2 hover:text-gray-300 ${
                active === 'home' ? 'text-blue-400' : ''
              }`}
            >
              <AiOutlineHome size={20} /> Home
            </Link>
          </li>
         
          <li>
            <Link
              to="/login"
              className="flex items-center gap-2 hover:text-gray-300"
            >
              <AiOutlineLogin size={20} /> Login
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center gap-2 hover:text-gray-300"
            >
              <AiOutlineUserAdd size={20} /> Register
            </Link>
          </li>

          {user?.username && (
            <li className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded">
              Hi, {user.username}!
              <button
                onClick={handleLike}
                className="hover:text-gray-200 ml-2"
                title="Like"
              >
                <AiOutlineLike size={18} />
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
