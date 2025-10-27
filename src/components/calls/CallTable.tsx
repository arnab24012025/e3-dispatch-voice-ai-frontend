import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Call } from '../../types';
import { CallStatusBadge } from './CallStatusBadge';
import { SentimentBadge } from './SentimentBadge';
import { formatRelativeTime, formatDuration } from '../../utils/formatters';

interface CallTableProps {
  calls: Call[];
}

/**
 * Call Table Component
 */
export const CallTable: React.FC<CallTableProps> = ({ calls }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver / Load
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sentiment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quality
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {calls.map((call) => (
              <tr
                key={call.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/calls/${call.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {call.driver_name}
                    </div>
                    <div className="text-sm text-gray-500">Load #{call.load_number}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <CallStatusBadge status={call.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {call.duration ? formatDuration(call.duration) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {call.post_call_analysis?.sentiment ? (
                    <SentimentBadge sentiment={call.post_call_analysis.sentiment} />
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {call.post_call_analysis?.quality_score ? (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {call.post_call_analysis.quality_score.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">/10</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatRelativeTime(call.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/calls/${call.id}`);
                    }}
                    className="text-primary-600 hover:text-primary-900 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};