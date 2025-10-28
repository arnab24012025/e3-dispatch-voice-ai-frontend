import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common';
import { AgentConfiguration } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

interface AgentCardProps {
  agent: AgentConfiguration;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
}

/**
 * Agent Card Component
 */
export const AgentCard: React.FC<AgentCardProps> = ({ agent, onDelete, onToggleStatus }) => {
  const navigate = useNavigate();

  const scenarioLabels: Record<string, string> = {
    'check-in': 'Status Check',
    'emergency': 'Emergency Protocol',
    'custom': 'Custom',
  };

  const scenarioEmojis: Record<string, string> = {
    'check-in': '📋',
    'emergency': '🚨',
    'custom': '⚙️',
  };

  return (
    <Card padding="md" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{scenarioEmojis[agent.scenario_type] || '🤖'}</span>
            <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                agent.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {agent.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Description */}
          {agent.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {agent.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{scenarioLabels[agent.scenario_type]}</span>
            <span>•</span>
            <span>Created {formatRelativeTime(agent.created_at)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {/* Toggle Status */}
          <button
            onClick={() => onToggleStatus(agent.id, !agent.is_active)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              agent.is_active
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            title={agent.is_active ? 'Deactivate' : 'Activate'}
          >
            {agent.is_active ? 'Disable' : 'Enable'}
          </button>

          {/* Edit */}
          <button
            onClick={() => navigate(`/agents/${agent.id}/edit`)}
            className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            Edit
          </button>

          {/* Delete */}
          {/* <button
            onClick={() => {
              if (window.confirm(`Delete agent "${agent.name}"?`)) {
                onDelete(agent.id);
              }
            }}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Delete
          </button> */}
        </div>
      </div>
    </Card>
  );
};

