import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';

/**
 * Top Navigation Bar
 */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DA</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 hidden sm:block">
                Dispatch Voice AI
              </span>
            </div>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.is_admin ? 'Administrator' : 'User'}
                </p>
              </div>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg">👤</span>
              </div>
            </div>

            {/* Settings button */}
            <button
              onClick={() => navigate('/settings')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <span className="text-xl">⚙️</span>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <span className="text-xl">🚪</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;