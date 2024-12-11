import { useQuery } from '@tanstack/react-query';
import { gameService } from '../services/gameService';

export const useGameTrailer = (gameId: number) => {
  return useQuery({
    queryKey: ['gameTrailer', gameId],
    queryFn: () => gameService.getGameDetails(gameId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useGameScreenshots = (gameId: number) => {
  return useQuery({
    queryKey: ['gameScreenshots', gameId],
    queryFn: () => gameService.getGameScreenshots(gameId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};