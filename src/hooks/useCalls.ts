import { useState, useEffect, useCallback } from 'react';
import callService from '../services/callService';
import { Call } from '../types';

interface UseCallsParams {
  skip?: number;
  limit?: number;
  load_number?: string;
  status?: string;
  sentiment?: string;
}

/**
 * Custom hook for managing calls
 */
export const useCalls = (params?: UseCallsParams) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalls = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await callService.getCalls(params);
      setCalls(data.calls);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load calls');
    } finally {
      setIsLoading(false);
    }
  }, [params?.skip, params?.limit, params?.load_number, params?.status, params?.sentiment]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const refreshCalls = () => {
    fetchCalls();
  };

  return { calls, total, isLoading, error, refreshCalls };
};