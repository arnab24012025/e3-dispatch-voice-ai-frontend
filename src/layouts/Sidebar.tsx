import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: '🏠',
  },
  {
    name: 'Calls',
    path: '/calls',
    icon: '📞',
  },
  {
    name: 'Agents',
    path: '/agents',
    icon: '🤖',
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: '📊',
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: '⚙️',
  },
];

/**
 * Sidebar Navigation
 */
const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          v1.0.0 | © 2025 Dispatch AI
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;