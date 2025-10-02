import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../state/AuthContext.jsx';

// Mock axios
vi.mock('../services/api.js', () => ({
  api: {
    post: vi.fn()
  }
}));

// Test component to access AuthContext
function TestComponent() {
  const { user, login, register, logout, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
      <button 
        data-testid="login-btn" 
        onClick={() => login('test@example.com', 'password')}
      >
        Login
      </button>
      <button 
        data-testid="register-btn" 
        onClick={() => register('Test User', 'test@example.com', 'password')}
      >
        Register
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide initial auth state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
  });

  it('should handle successful login', async () => {
    const { api } = await import('../services/api.js');
    const mockResponse = {
      data: {
        user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
        tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' }
      }
    };
    api.post.mockResolvedValueOnce(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('should handle successful registration', async () => {
    const { api } = await import('../services/api.js');
    const mockResponse = {
      data: {
        user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
        tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' }
      }
    };
    api.post.mockResolvedValueOnce(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('register-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });

    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('should handle logout', async () => {
    const { api } = await import('../services/api.js');
    
    // First set up a logged in state
    const mockLoginResponse = {
      data: {
        user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
        tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' }
      }
    };
    api.post.mockResolvedValueOnce(mockLoginResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Login first
    fireEvent.click(screen.getByTestId('login-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });

    // Mock logout API call
    api.post.mockResolvedValueOnce({ data: { message: 'Logged out' } });

    // Now logout
    fireEvent.click(screen.getByTestId('logout-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
    });
  });

  it('should show loading state during async operations', async () => {
    const { api } = await import('../services/api.js');
    
    // Create a promise that we can control
    let resolveLogin;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    api.post.mockReturnValueOnce(loginPromise);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('login-btn'));

    // Should show loading immediately
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    // Resolve the promise
    resolveLogin({
      data: {
        user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
        tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' }
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
    });
  });

  it('should persist tokens in localStorage', async () => {
    const { api } = await import('../services/api.js');
    const mockResponse = {
      data: {
        user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
        tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' }
      }
    };
    api.post.mockResolvedValueOnce(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(localStorage.getItem('accessToken')).toBe('access-token');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
    });
  });

  it('should clear tokens from localStorage on logout', async () => {
    const { api } = await import('../services/api.js');
    
    // Set up tokens in localStorage
    localStorage.setItem('accessToken', 'access-token');
    localStorage.setItem('refreshToken', 'refresh-token');

    api.post.mockResolvedValueOnce({ data: { message: 'Logged out' } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('logout-btn'));

    await waitFor(() => {
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });
});
