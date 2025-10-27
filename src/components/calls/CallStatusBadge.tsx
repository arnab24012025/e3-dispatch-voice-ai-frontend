import React from 'react';
import { CallStatus } from '../../types';

interface CallStatusBadgeProps {
  status: CallStatus;
}

/**
 * Call Status Badge Component
 */
export const CallStatusBadge: React.FC<CallStatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<CallStatus, { label: string; color: string; emoji: string }> = {
    initiated: { label: 'Initiated', color: 'bg-gray-100 text-gray-800', emoji: '⏳' },
    ringing: { label: 'Ringing', color: 'bg-blue-100 text-blue-800', emoji: '📞' },
    in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', emoji: '🔄' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800', emoji: '✅' },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-800', emoji: '❌' },
    no_answer: { label: 'No Answer', color: 'bg-gray-100 text-gray-800', emoji: '📵' },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
};