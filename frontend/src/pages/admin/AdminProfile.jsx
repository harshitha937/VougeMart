import { useEffect, useState } from 'react';
import { getProfile } from '../../services/authService';
import { Spin, message, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => setUser(res.data.user))
      .catch((err) =>
        message.error(err.response?.data?.message || 'Failed to load profile')
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <div className="bg-gray-900 text-white w-full max-w-md p-8 rounded-xl shadow-lg hover:shadow-[0_0_25px_#60a5fa80] transition-all duration-300 flex flex-col items-center">
        {/* Avatar */}
        <Avatar
          size={80}
          icon={<UserOutlined />}
          className="bg-blue-600 mb-4"
        />

        <h2 className="text-2xl font-bold mb-6 text-center">Admin Profile</h2>

        {user ? (
          <div className="space-y-4 text-lg w-full">
            <p>
              <span className="font-semibold text-gray-400">Name:</span>{' '}
              {user.username}
            </p>
            <p>
              <span className="font-semibold text-gray-400">Email:</span>{' '}
              {user.email}
            </p>
            <p>
              <span className="font-semibold text-gray-400">Role:</span>{' '}
              Admin
            </p>
          </div>
        ) : (
          <p className="text-red-500 text-center">No user data found.</p>
        )}

        <Link
          to="/admin/dashboard"
          className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Go Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AdminProfile;
