import { useInfiniteQuery } from '@tanstack/react-query';
import { useFilterStore } from '../store/filterStore';
import { useDebounce } from './useDebounce';

export const useFilteredGames = () => {
  const {
    search,
    platforms,
    genres,
    ordering,
    dates,
    metacritic,
    tags,
    page_size,
  } = useFilterStore();

  const debouncedSearch = useDebounce(search, 500);

  const     filters = {
    search: debouncedSearch,
    platforms: platforms.length > 0 ? platforms.join(',') : undefined,
    genres: genres.length > 0 ? genres.join(',') : undefined,
    ordering: ordering || undefined,
    dates: dates || undefined,
    metacritic: metacritic || undefined,
    tags: tags.length > 0 ? tags.join(',') : undefined,
    page_size,
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['games', filters],
    queryFn: ({ pageParam = 1 }) =>
      getGames({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const games = data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = data?.pages[0]?.count ?? 0;

  return {
    games,
    totalCount,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
    