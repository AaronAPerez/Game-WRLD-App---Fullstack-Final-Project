import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      // Custom error handling
      onError: (error: any) => {
        console.error('Query Error:', error);
      },
    },
  },
});

// Custom cache keys for different data types
export const QUERY_KEYS = {
  games: {
    all: ['games'],
    lists: () => [...QUERY_KEYS.games.all, 'list'],
    list: (filters: any) => [...QUERY_KEYS.games.lists(), filters],
    details: () => [...QUERY_KEYS.games.all, 'detail'],
    detail: (id: number) => [...QUERY_KEYS.games.details(), id],
  },
  media: {
    all: ['media'],
    screenshots: (gameId: number) => ['screenshots', gameId],
    trailers: (gameId: number) => ['trailers', gameId],
  },
  blog: {
    all: ['blog'],
    posts: () => [...QUERY_KEYS.blog.all, 'posts'],
    post: (id: number) => [...QUERY_KEYS.blog.posts(), id],
  },
};