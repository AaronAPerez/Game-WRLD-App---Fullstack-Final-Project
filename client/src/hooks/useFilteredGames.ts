// hooks/useFilteredGames.ts
import { useFilterStore } from '@/store/filterStore';
import gameService from '../services/gameService';
import { useDebounce } from './useDebounce';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useFilteredGames = () => {
  const filters = useFilterStore();
  const debouncedSearch = useDebounce(filters.search, 500);

  const queryParams = {
    search: debouncedSearch,
    platforms: filters.platforms.join(','),
    genres: filters.genres.join(','),
    ordering: filters.ordering,
    dates: filters.dates,
    metacritic: filters.metacritic,
    tags: filters.tags.join(','),
    page_size: 20
  };

  return useInfiniteQuery({
    queryKey: ['games', queryParams],
    queryFn: ({ pageParam = 1 }) => 
      gameService.getGames({ ...queryParams, page: pageParam }),
    getNextPageParam: (lastPage) => 
      lastPage.next ? parseInt(new URL(lastPage.next).searchParams.get('page') || '1') : undefined,
    staleTime: 1000 * 60 * 5
  });
};