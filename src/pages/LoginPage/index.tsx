import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { login, clearError } from '../../redux/slices/authSlice';
import { Button, Input, Card, Alert } from '../../components/common';

/**
 * Login Page Component
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error on change
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validate form
   */
  const validate = (): boolean => {
    const errors = {
      username: '',
      password: '',
    };

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return !errors.username && !errors.password;
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await dispatch(login(formData)).unwrap();
      // Will redirect via useEffect
    } catch (err) {
      // Error handled by Redux
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="lg">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <span className="text-2xl font-bold text-white">DA</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dispatch Voice AI
          </h1>
          <p className="text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              message={error}
              onClose={() => dispatch(clearError())}
            />
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <Input
              label="Username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              error={formErrors.username}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">
            Demo Credentials:
          </p>
          <p className="text-xs text-blue-700">
            Username: <span className="font-mono font-semibold">admin</span>
          </p>
          <p className="text-xs text-blue-700">
            Password: <span className="font-mono font-semibold">admin123</span>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-primary-600 hover:text-primary-700 font-medium"
            onClick={() => alert('Registration feature coming soon!')}
          >
            Contact Admin
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;