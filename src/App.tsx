import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { loadUser } from './redux/slices/authSlice';
import { Layout } from './layouts';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CallsPage from './pages/CallsPage';
import CallDetailPage from './pages/CallDetailPage';
import NewCallPage from './pages/NewCallPage';
import AgentsPage from './pages/AgentsPage';
import AgentFormPage from './pages/AgentFormPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import WebCallInterface from './pages/WebCallPage';

/**
 * Protected Route Component
 */
interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

/**
 * App content with routing
 */
function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load user if token exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calls"
          element={
            <ProtectedRoute>
              <CallsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calls/new"
          element={
            <ProtectedRoute>
              <NewCallPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calls/:id"
          element={
            <ProtectedRoute>
              <CallDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/calls/web-call-interface"
  element={
    <ProtectedRoute>
      <WebCallInterface />
    </ProtectedRoute>
  }
/>


        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <AgentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents/new"
          element={
            <ProtectedRoute>
              <AgentFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents/:id/edit"
          element={
            <ProtectedRoute>
              <AgentFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

/**
 * App component with Redux provider
 */
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;