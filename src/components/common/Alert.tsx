import React from 'react';
import { cn } from '../../utils/cn';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

/**
 * Reusable Alert component
 */
export const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: '✓',
      iconColor: 'text-green-600',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: '✕',
      iconColor: 'text-red-600',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: '⚠',
      iconColor: 'text-yellow-600',
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'ℹ',
      iconColor: 'text-blue-600',
    },
  };

  const currentStyle = styles[type];

  return (
    <div
      className={cn(
        'flex items-start p-4 border rounded-lg fade-in',
        currentStyle.container
      )}
    >
      <div className={cn('flex-shrink-0 w-5 h-5 flex items-center justify-center font-bold', currentStyle.iconColor)}>
        {currentStyle.icon}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500"
          aria-label="Close"
        >
          <span className="text-xl">×</span>
        </button>
      )}
    </div>
  );
};