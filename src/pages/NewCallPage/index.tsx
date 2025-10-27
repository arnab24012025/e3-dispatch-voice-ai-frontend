import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, Alert } from '../../components/common';
import { useAgents } from '../../hooks/useAgents';
import callService from '../../services/callService';

/**
 * New Call Page Component
 */
const NewCallPage: React.FC = () => {
  const navigate = useNavigate();
  const { agents, isLoading: agentsLoading } = useAgents();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    driver_name: '',
    phone_number: '',
    load_number: '',
    agent_configuration_id: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-select first active agent
  useEffect(() => {
    if (agents.length > 0 && !formData.agent_configuration_id) {
      const activeAgent = agents.find((a) => a.is_active);
      if (activeAgent) {
        setFormData((prev) => ({
          ...prev,
          agent_configuration_id: activeAgent.id.toString(),
        }));
      }
    }
  }, [agents, formData.agent_configuration_id]);

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (!formData.driver_name.trim()) {
      errors.driver_name = 'Driver name is required';
    }

    if (!formData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s()-]+$/.test(formData.phone_number)) {
      errors.phone_number = 'Invalid phone number format';
    }

    if (!formData.load_number.trim()) {
      errors.load_number = 'Load number is required';
    }

    if (!formData.agent_configuration_id) {
      errors.agent_configuration_id = 'Please select an agent';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submit (Web Call)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await callService.createWebCall({
        driver_name: formData.driver_name,
        phone_number: formData.phone_number,
        load_number: formData.load_number,
        agent_configuration_id: parseInt(formData.agent_configuration_id),
      });

      setSuccess(true);
      
      // Redirect to call detail page after 2 seconds
      setTimeout(() => {
        navigate(`/calls/${response.call_id}`);
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create web call';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to create web call');
    } finally {
      setIsLoading(false);
    }
  };

  if (agentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agents...</p>
        </div>
      </div>
    );
  }

  const activeAgents = agents.filter((a) => a.is_active);

  if (activeAgents.length === 0) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/calls')}
          className="text-primary-600 hover:text-primary-700 inline-flex items-center"
        >
          <span className="mr-2">←</span>
          Back to Calls
        </button>
        <Alert
          type="warning"
          message="No active agents available. Please create and activate an agent first."
        />
        <Button onClick={() => navigate('/agents/new')} variant="primary">
          Create Agent
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/calls')}
          className="text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center"
        >
          <span className="mr-2">←</span>
          Back to Calls
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Start New Test Call</h1>
        <p className="text-gray-600 mt-2">
          Create a browser-based test call to try your AI agent
        </p>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert
          type="success"
          message="Web call created successfully! Redirecting to call details..."
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card padding="lg">
          <div className="space-y-6">
            {/* Agent Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Agent
              </label>
              <select
                name="agent_configuration_id"
                value={formData.agent_configuration_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  formErrors.agent_configuration_id ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value="">Choose an agent...</option>
                {activeAgents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.scenario_type})
                  </option>
                ))}
              </select>
              {formErrors.agent_configuration_id && (
                <p className="mt-1 text-sm text-red-600">{formErrors.agent_configuration_id}</p>
              )}
            </div>

            {/* Driver Name */}
            <Input
              label="Driver Name"
              name="driver_name"
              value={formData.driver_name}
              onChange={handleChange}
              error={formErrors.driver_name}
              placeholder="John Smith"
              disabled={isLoading}
            />

            {/* Phone Number */}
            <Input
              label="Phone Number"
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              error={formErrors.phone_number}
              placeholder="+1 (555) 123-4567"
              disabled={isLoading}
              helperText="Enter phone number with country code"
            />

            {/* Load Number */}
            <Input
              label="Load Number"
              name="load_number"
              value={formData.load_number}
              onChange={handleChange}
              error={formErrors.load_number}
              placeholder="LOAD-12345"
              disabled={isLoading}
            />

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">💡 Test Call Info:</span> This will create a
                browser-based voice call for testing. You'll be able to speak with the AI agent
                directly from your browser.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/calls')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                <span className="mr-2">📞</span>
                Start Web Call
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default NewCallPage;