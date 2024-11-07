import { useInfiniteQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
// import useGameQueryStore from '../store';
// import ms from "ms";

export interface Game {
  id: number;
  name: string;
  background_image: string;
  // parent_platforms: { platform: Platform }[];
  metacritic: number;
  released: string;
  added: number;
  rating_top: number;
}

const apiClient = new APIClient<Game>('/games');

const useGames = () => {
  const gameQuery = useGameQueryStore(s => s.gameQuery);

  return useInfiniteQuery({
    queryKey: ['games', gameQuery],
    queryFn ({ pageParam = 1 }) => apiClient.getAll({
      params: {
        genres: gameQuery.genreId,
        parent_platforms: gameQuery.platformId,
        ordering: gameQuery.sortOrder,
        search: gameQuery.searchText,
        page: pageParam,
        page_size: 12
      },
    }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
    staleTime: ms('24h')
  });
};

export default useGames;