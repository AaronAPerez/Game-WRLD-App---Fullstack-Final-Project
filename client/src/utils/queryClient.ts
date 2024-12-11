import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // Custom retry logic based on error type
      retry: (failureCount, error: any) => {
        // Don't retry on 404s or auth errors
        if (error?.response?.status === 404) return false;
        if (error?.response?.status === 401) return false;
        return failureCount < 2;
      },
      
      // Cache configuration
      staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
      // cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
      
      // Refetch configuration
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      refetchOnReconnect: 'always', // Always refetch on reconnect
      refetchOnMount: false // Don't refetch on component mount
    },
    
    mutations: {
      retry: false, // Don't retry mutations
      onError: (error: any) => {
        // Global error handling for mutations
        console.error('Mutation error:', error);
      }
    }
  }
});
