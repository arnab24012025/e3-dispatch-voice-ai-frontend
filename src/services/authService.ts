import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';
import { AUTH_TOKEN_KEY } from '../utils/constants';

/**
 * Authentication service
 */
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Backend expects JSON with username and password
    const response = await api.post<AuthResponse>('/auth/login', {
      username: credentials.username,
      password: credentials.password,
    });

    // Store token
    if (response.data.access_token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token);
    }

    return response.data;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<User> {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
}

export default new AuthService();