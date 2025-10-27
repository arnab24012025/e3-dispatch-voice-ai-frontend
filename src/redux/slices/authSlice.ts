import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { AuthState, LoginRequest, RegisterRequest, User } from '../../types';
import { AUTH_TOKEN_KEY } from '../../utils/constants';

/**
 * Initial state
 */
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(AUTH_TOKEN_KEY),
  isAuthenticated: !!localStorage.getItem(AUTH_TOKEN_KEY),
  isLoading: false,
  error: null,
};

/**
 * Async thunk: Login
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const authResponse = await authService.login(credentials);
      const user = await authService.getCurrentUser();
      return { user, token: authResponse.access_token };
    } catch (error: any) {
      // Handle different error response formats
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response?.data) {
        const data = error.response.data;
        
        // FastAPI validation error (array of error objects)
        if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map((err: any) => err.msg).join(', ');
        }
        // Simple string error
        else if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        }
        // Object error
        else if (data.detail && typeof data.detail === 'object') {
          errorMessage = JSON.stringify(data.detail);
        }
        // Other formats
        else if (data.message) {
          errorMessage = data.message;
        }
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk: Register
 */
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      await authService.register(userData);
      // Auto-login after registration
      const authResponse = await authService.login({
        username: userData.username,
        password: userData.password,
      });
      const user = await authService.getCurrentUser();
      return { user, token: authResponse.access_token };
    } catch (error: any) {
      // Handle different error response formats
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data) {
        const data = error.response.data;
        
        // FastAPI validation error (array of error objects)
        if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map((err: any) => err.msg).join(', ');
        }
        // Simple string error
        else if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        }
        // Object error
        else if (data.detail && typeof data.detail === 'object') {
          errorMessage = JSON.stringify(data.detail);
        }
        // Other formats
        else if (data.message) {
          errorMessage = data.message;
        }
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk: Load user from token
 */
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Not authenticated');
      }
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      authService.logout();
      return rejectWithValue('Session expired. Please login again.');
    }
  }
);

/**
 * Auth slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load user
    builder
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;