import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { GameQueryParams, Game } from '../types/game';
import { useDebounce } from './useDebounce';

interface UseGamesOptions {
  initialFilters?: Partial<GameQueryParams>;
}

export const useGames = (options: UseGamesOptions = {}) => {
  const [filters, setFilters] = useState<Partial<GameQueryParams>>({
    page_size: 20,
    ...options.initialFilters,
  });
  
  const debouncedSearch = useDebounce(filters.search, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ['games', { ...filters, search: debouncedSearch }],
    queryFn: ({ pageParam = 1 }) =>
      getGames({ ...filters, page: pageParam, search: debouncedSearch }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const games: Game[] = data?.pages.flatMap((page) => page.results) ?? [];

  const updateFilters = (newFilters: Partial<GameQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    games,
    filters,
    updateFilters,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
  };
};