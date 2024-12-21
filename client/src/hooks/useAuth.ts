import { useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { userService } from '../api/user';
import { jwtDecode } from 'jwt-decode';
import { UserProfileDTO } from '../types';

interface UseAuth {
  user: UserProfileDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuth = (): UseAuth => {
  // Query user profile
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['userProfile'],
    queryFn: userService.getProfile,
    enabled: !!localStorage.getItem('token'),
    retry: false
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: userService.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      refetch();
    }
  });

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    queryClient.clear();
  }, []);

  // Token refresh handler
  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = jwtDecode(token);
      const expirationTime = decoded.exp ? decoded.exp * 1000 : 0;
      const currentTime = Date.now();

      // If token expires in less than 5 minutes
      if (expirationTime - currentTime < 5 * 60 * 1000) {
        const response = await userService.refreshToken(token);
        localStorage.setItem('token', response.token);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  }, [logout]);

  // Set up token refresh interval
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(refreshToken, 4 * 60 * 1000); // Check every 4 minutes
    return () => clearInterval(interval);
  }, [user, refreshToken]);

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    login: (username: string, password: string) => 
      loginMutation.mutateAsync({ userName: username, password }),
    logout,
    refreshToken
  };
};