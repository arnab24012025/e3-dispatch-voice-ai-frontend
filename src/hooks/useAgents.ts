import { useState, useEffect } from 'react';
import agentService from '../services/agentService';
import { AgentConfiguration } from '../types';

/**
 * Custom hook for managing agents
 */
export const useAgents = () => {
  const [agents, setAgents] = useState<AgentConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await agentService.getAgents();
      setAgents(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load agents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const refreshAgents = () => {
    fetchAgents();
  };

  return { agents, isLoading, error, refreshAgents };
};