import { describe, it, expect, vi, afterEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../routes/ProtectedRoute.jsx';

// Mock the useAuth hook
vi.mock('../state/AuthContext.jsx', () => ({
  useAuth: vi.fn()
}));

describe('ProtectedRoute', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('redirects when unauthenticated', async () => {
    const { useAuth } = await import('../state/AuthContext.jsx');
    useAuth.mockReturnValue({ user: null });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders protected content when authenticated', async () => {
    const { useAuth } = await import('../state/AuthContext.jsx');
    useAuth.mockReturnValue({ 
      user: { id: '1', name: 'Test User', role: 'user' } 
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects when user role does not match required role', async () => {
    const { useAuth } = await import('../state/AuthContext.jsx');
    useAuth.mockReturnValue({ 
      user: { id: '1', name: 'Test User', role: 'user' } 
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><div>Admin Content</div></ProtectedRoute>} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders protected content when user has required role', async () => {
    const { useAuth } = await import('../state/AuthContext.jsx');
    useAuth.mockReturnValue({ 
      user: { id: '1', name: 'Admin User', role: 'admin' } 
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><div>Admin Content</div></ProtectedRoute>} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('preserves original location for redirect after login', async () => {
    const { useAuth } = await import('../state/AuthContext.jsx');
    useAuth.mockReturnValue({ user: null });

    render(
      <MemoryRouter initialEntries={["/protected-route"]}>
        <Routes>
          <Route path="/protected-route" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});