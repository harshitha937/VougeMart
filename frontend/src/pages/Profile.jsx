import { useEffect, useState } from 'react';
import { getProfile } from '../services/authService';
import { Spin, message, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        message.error(err.response?.data?.message || 'Failed to load profile');
      })
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
      <div className="bg-gray-900 text-white w-full max-w-md p-8 rounded-xl shadow-lg hover:shadow-[0_0_25px_#f0abfc60] transition-all duration-300 flex flex-col items-center">
        {/* Profile Avatar */}
        <Avatar
          size={80}
          icon={<UserOutlined />}
          className="bg-fuchsia-600 mb-4"
        />

        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

        {user ? (
          <div className="space-y-4 text-lg w-full">
            <p>
              <span className="font-semibold text-gray-400">Name:</span> {user.username}
            </p>
            <p>
              <span className="font-semibold text-gray-400">Email:</span> {user.email}
            </p>
            {/* Add more fields if needed */}
          </div>
        ) : (
          <p className="text-red-500 text-center">No user data found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
