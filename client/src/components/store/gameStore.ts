import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Game } from '../../types/rawg';

/* Interface for games filter state*/
interface GameFilters {
  search: string;
  genre?: string;
  platform?: string;
  ordering?: string;
  genres: number[];
  platforms: number[];
  dates: string;
  ratings: number[];
  metacritic: string;
  tags: number[];
  page_size?: number;
}



/* Interface for game collection management*/
interface GameCollection {
  favorites: Game[];
  recentlyViewed: Game[];
  library: Game[];
  wishlist: Game[];
}

/* Interface for store statistics*/
interface GameStats {
  totalGamesPlayed: number;
  totalPlaytime: number;
  averageRating: number;
  completedGames: number;
}

/*Main game store state interface*/
interface GameState {
  // Collections
  collections: GameCollection;
  

  
  // Stats and metadata
  stats: GameStats;
  
  // Loading states
  isLoading: boolean;
  error: Error | null;
  
  // Selected game
  selectedGame: Game | null;
  
  
 // Filters search
  filters: GameFilters;
  setSelectedGame: (game: Game | null) => void;
  updateFilters: (filters: Partial<GameFilters>) => void;
  resetFilters: () => void;
  
  // Collection management
  addToFavorites: (game: Game) => void;
  removeFromFavorites: (gameId: number) => void;
  addToLibrary: (game: Game) => void;
  removeFromLibrary: (gameId: number) => void;
  addToWishlist: (game: Game) => void;
  removeFromWishlist: (gameId: number) => void;
  addToRecentlyViewed: (game: Game) => void;
  
  // Stats management
  updateGameStats: (stats: Partial<GameStats>) => void;
  resetStats: () => void;
  
  // Utility functions
  isGameInCollection: (gameId: number, collection: keyof GameCollection) => boolean;
  getGameFromCollection: (gameId: number, collection: keyof GameCollection) => Game | undefined;
}

/* Initial filters state*/
const initialFilters: GameFilters = {
  search: '',
  genres: [],
  platforms: [],
  ordering: '-rating',
  dates: '',
  ratings: [],
  metacritic: '',
  tags: []
};

/* Initial collections state*/
const initialCollections: GameCollection = {
  favorites: [],
  recentlyViewed: [],
  library: [],
  wishlist: []
};

/* Initial stats state*/
const initialStats: GameStats = {
  totalGamesPlayed: 0,
  totalPlaytime: 0,
  averageRating: 0,
  completedGames: 0
};

/*Game store w/ immer middleware*/
export const useGameStore = create<GameState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      collections: initialCollections,
      filters: initialFilters,
      stats: initialStats,
      isLoading: false,
      error: null,
      selectedGame: null,

      // Game selection
      setSelectedGame: (game) => set({ selectedGame: game }),

      // Filter management
      updateFilters: (newFilters) =>
        set((state) => {
          state.filters = { ...state.filters, ...newFilters };
        }),

      resetFilters: () =>
        set((state) => {
          state.filters = initialFilters;
        }),

      // Collection management
      addToFavorites: (game) =>
        set((state) => {
          if (!state.collections.favorites.some((g: { id: number; }) => g.id === game.id)) {
            state.collections.favorites.push(game);
          }
        }),

      removeFromFavorites: (gameId) =>
        set((state) => {
          state.collections.favorites = state.collections.favorites.filter(
              (            g: { id: number; }) => g.id !== gameId
          );
        }),

      addToLibrary: (game) =>
        set((state) => {
          if (!state.collections.library.some((g: { id: number; }) => g.id === game.id)) {
            state.collections.library.push(game);
          }
        }),

      removeFromLibrary: (gameId) =>
        set((state) => {
          state.collections.library = state.collections.library.filter(
              (            g: { id: number; }) => g.id !== gameId
          );
        }),

      addToWishlist: (game) =>
        set((state) => {
          if (!state.collections.wishlist.some((g: { id: number; }) => g.id === game.id)) {
            state.collections.wishlist.push(game);
          }
        }),

      removeFromWishlist: (gameId) =>
        set((state) => {
          state.collections.wishlist = state.collections.wishlist.filter(
              (            g: { id: number; }) => g.id !== gameId
          );
        }),

      addToRecentlyViewed: (game) =>
        set((state) => {
          // Remove if already exists
          state.collections.recentlyViewed = state.collections.recentlyViewed.filter(
              (            g: { id: number; }) => g.id !== game.id
          );
          // Add to start of array
          state.collections.recentlyViewed.unshift(game);
          // Keep only last 10 games
          state.collections.recentlyViewed = state.collections.recentlyViewed.slice(0, 10);
        }),

      // Stats management
      updateGameStats: (newStats) =>
        set((state) => {
          state.stats = { ...state.stats, ...newStats };
        }),

      resetStats: () =>
        set((state) => {
          state.stats = initialStats;
        }),

      // Utility functions
      isGameInCollection: (gameId, collection) => {
        return get().collections[collection].some(game => game.id === gameId);
      },

      getGameFromCollection: (gameId, collection) => {
        return get().collections[collection].find(game => game.id === gameId);
      }
    })),
    {
      name: 'game-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        collections: state.collections,
        stats: state.stats,
        filters: state.filters
      })
    }
  )
);

/* Selector hooks common use cases*/
export const useGameCollections = () => useGameStore(state => state.collections);
export const useGameFilters = () => useGameStore(state => state.filters);
export const useGameStats = () => useGameStore(state => state.stats);
export const useSelectedGame = () => useGameStore(state => state.selectedGame);