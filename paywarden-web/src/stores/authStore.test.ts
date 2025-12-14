import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
    localStorage.clear();
  });

  it('initializes with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('sets authentication state', () => {
    const { setAuth } = useAuthStore.getState();
    const testUser = { email: 'test@example.com' };
    setAuth('test-token', testUser);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('test-token');
    expect(state.user).toEqual(testUser);
    expect(localStorage.getItem('jwt_token')).toBe('test-token');
  });

  it('clears authentication state on logout', () => {
    const { setAuth, logout } = useAuthStore.getState();

    // First authenticate
    const testUser = { email: 'test@example.com' };
    setAuth('test-token', testUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Then logout
    logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(localStorage.getItem('jwt_token')).toBeNull();
  });
});
