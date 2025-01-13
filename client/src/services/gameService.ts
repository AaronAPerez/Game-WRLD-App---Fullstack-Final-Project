import axios from 'axios';
import { GameQueryParams } from '../types/game';

// const RAWG_API_KEY = process.env.REACT_APP_RAWG_API_KEY;
const RAWG_URL = 'https://api.rawg.io/api';

export const gameService = axios.create({
  baseURL: RAWG_URL,
  params: {
    key: '88682be5c94f45ec86a72c163e1a3a09',
    // key: RAWG_API_KEY,
  },
});

export const getGames = async (params: GameQueryParams) => {
  const response = await gameService.get('/games', { params });
  return response.data;
};

export const getGameDetails = async (id: number) => {
  const response = await gameService.get(`/games/${id}`);
  return response.data;
};

export const getGameScreenshots = async (id: number) => {
  const response = await gameService.get(`/games/${id}/screenshots`);
  return response.data.results;
};