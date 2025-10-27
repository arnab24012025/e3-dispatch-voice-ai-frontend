import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Card, Alert } from '../../components/common';
import agentService from '../../services/agentService';
import { CreateAgentRequest, ScenarioType } from '../../types';

/**
 * Agent Form Page (Create/Edit)
 */
const AgentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateAgentRequest>({
    name: '',
    description: '',
    system_prompt: '',
    initial_message: '',
    scenario_type: 'check-in',
    voice_settings: {
      voice_id: '11labs-Adrian',
      enable_backchannel: true,
      interruption_sensitivity: 1,
    },
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch agent data if editing
  useEffect(() => {
    if (isEdit && id) {
      fetchAgent(parseInt(id));
    }
  }, [isEdit, id]);

  const fetchAgent = async (agentId: number) => {
    try {
      setIsFetching(true);
      const agent = await agentService.getAgent(agentId);
      setFormData({
        name: agent.name,
        description: agent.description || '',
        system_prompt: agent.system_prompt,
        initial_message: agent.initial_message || '',
        scenario_type: agent.scenario_type,
        voice_settings: agent.voice_settings || undefined,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load agent');
    } finally {
      setIsFetching(false);
    }
  };

  /**
   * Handle input change
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validate form
   */
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Agent name is required';
    }

    if (!formData.system_prompt.trim()) {
      errors.system_prompt = 'System prompt is required';
    } else if (formData.system_prompt.length < 50) {
      errors.system_prompt = 'System prompt should be at least 50 characters';
    }

    if (!formData?.initial_message?.trim()) {
      errors.initial_message = 'Initial message is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isEdit && id) {
        await agentService.updateAgent(parseInt(id), formData);
      } else {
        await agentService.createAgent(formData);
      }
      navigate('/agents');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save agent');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/agents')}
          className="text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center"
        >
          <span className="mr-2">←</span>
          Back to Agents
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Agent' : 'Create New Agent'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit
            ? 'Update agent configuration and settings'
            : 'Configure a new AI voice agent for your calls'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card padding="lg">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <Input
                  label="Agent Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={formErrors.name}
                  placeholder="e.g., Status Check Agent"
                  disabled={isLoading}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Brief description of what this agent does"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scenario Type
                  </label>
                  <select
                    name="scenario_type"
                    value={formData.scenario_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    disabled={isLoading}
                  >
                    <option value="check-in">📋 Status Check / Driver Check-in</option>
                    <option value="emergency">🚨 Emergency Protocol</option>
                    <option value="custom">⚙️ Custom Scenario</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Prompts */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Conversation Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    System Prompt
                  </label>
                  <textarea
                    name="system_prompt"
                    value={formData.system_prompt}
                    onChange={handleChange}
                    rows={8}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm ${
                      formErrors.system_prompt ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="You are a professional dispatch coordinator calling a truck driver..."
                    disabled={isLoading}
                  />
                  {formErrors.system_prompt && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.system_prompt}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Instructions that guide the agent's behavior and conversation style
                  </p>
                </div>

                <Input
                  label="Initial Message"
                  name="initial_message"
                  value={formData.initial_message}
                  onChange={handleChange}
                  error={formErrors.initial_message}
                  placeholder="Hi, this is Dispatch calling about load #..."
                  disabled={isLoading}
                  helperText="The first thing the agent says when the call starts"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/agents')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                {isEdit ? 'Update Agent' : 'Create Agent'}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default AgentFormPage;