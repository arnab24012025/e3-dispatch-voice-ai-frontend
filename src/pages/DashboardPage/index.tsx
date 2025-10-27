import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common';

/**
 * Dashboard Page Component
 */
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      name: 'Total Calls',
      value: '0',
      icon: '📞',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      name: 'Active Agents',
      value: '0',
      icon: '🤖',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      name: 'Success Rate',
      value: '0%',
      icon: '📈',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Avg Duration',
      value: '0:00',
      icon: '⏱️',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's an overview of your voice AI operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} padding="md" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <span className={`text-3xl ${stat.iconColor}`}>{stat.icon}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/calls/new')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <span className="text-4xl block mb-2">📞</span>
            <p className="font-medium text-gray-900">Start New Call</p>
            <p className="text-sm text-gray-600 mt-1">Test web call</p>
          </button>

          <button
            onClick={() => navigate('/agents/new')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
          >
            <span className="text-4xl block mb-2">🤖</span>
            <p className="font-medium text-gray-900">Create Agent</p>
            <p className="text-sm text-gray-600 mt-1">Configure new agent</p>
          </button>

          <button
            onClick={() => navigate('/calls')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <span className="text-4xl block mb-2">📋</span>
            <p className="font-medium text-gray-900">View Calls</p>
            <p className="text-sm text-gray-600 mt-1">Browse call history</p>
          </button>
        </div>
      </Card>

      {/* Getting Started */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Create an Agent</p>
              <p className="text-sm text-gray-600">
                Configure your first AI voice agent with custom prompts
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Test Web Call</p>
              <p className="text-sm text-gray-600">
                Try out your agent with a browser-based voice call
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Review Results</p>
              <p className="text-sm text-gray-600">
                Analyze call transcripts and extracted data
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;