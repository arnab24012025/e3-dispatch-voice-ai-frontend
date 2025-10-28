import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert } from '../../components/common';
import { AgentCard } from '../../components/agents/AgentCard';
import { useAgents } from '../../hooks/useAgents';
import agentService from '../../services/agentService';

/**
 * Agents Page Component
 */
const AgentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { agents, isLoading, error, refreshAgents } = useAgents();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);


  /**
   * Handle toggle agent status
   */
  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      await agentService.toggleAgentStatus(id, isActive);
      setActionSuccess(`Agent ${isActive ? 'enabled' : 'disabled'} successfully`);
      refreshAgents();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.response?.data?.detail || 'Failed to update agent status');
      setTimeout(() => setActionError(null), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Configurations</h1>
          <p className="text-gray-600 mt-2">
            Manage your AI voice agents and their settings
          </p>
        </div>
        <Button
          onClick={() => navigate('/agents/new')}
          variant="primary"
          size="md"
        >
          <span className="mr-2">➕</span>
          Create Agent
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => refreshAgents()} />
      )}
      {actionError && (
        <Alert type="error" message={actionError} onClose={() => setActionError(null)} />
      )}
      {actionSuccess && (
        <Alert type="success" message={actionSuccess} onClose={() => setActionSuccess(null)} />
      )}

      {/* Agents List */}
      {agents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <span className="text-6xl block mb-4">🤖</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No agents yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first AI voice agent to get started
          </p>
          <Button
            onClick={() => navigate('/agents/new')}
            variant="primary"
          >
            Create Agent
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onDelete={()=>{}}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentsPage;