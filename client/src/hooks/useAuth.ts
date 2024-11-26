import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../components/store/authStore';
import { authService } from '../api/authService';


export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setToken, setUser, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      queryClient.setQueryData(['user'], data.user);
      navigate('/dashboard');
    }
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      queryClient.setQueryData(['user'], data.user);
      navigate('/dashboard');
    }
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate('/login');
    }
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    error: loginMutation.error || registerMutation.error || logoutMutation.error
  };
}
