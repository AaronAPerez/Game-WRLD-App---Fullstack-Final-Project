import { create } from 'zustand';

interface FilterState {
  search: string;
  platforms: number[];
  genres: number[];
  ordering: string;
  dates: string;
  metacritic: string;
  tags: number[];
  setSearch: (search: string) => void;
  setPlatforms: (platforms: number[]) => void;
  setGenres: (genres: number[]) => void;
  setOrdering: (ordering: string) => void;
  setDates: (dates: string) => void;
  setMetacritic: (metacritic: string) => void;
  setTags: (tags: number[]) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  // Initial state
  search: '',
  platforms: [],
  genres: [],
  ordering: '',
  dates: '',
  metacritic: '',
  tags: [],

  // Actions
  setSearch: (search) => set({ search }),
  setPlatforms: (platforms) => set({ platforms }),
  setGenres: (genres) => set({ genres }),
  setOrdering: (ordering) => set({ ordering }),
  setDates: (dates) => set({ dates }),
  setMetacritic: (metacritic) => set({ metacritic }),
  setTags: (tags) => set({ tags }),
  reset: () => set({
    search: '',
    platforms: [],
    genres: [],
    ordering: '',
    dates: '',
    metacritic: '',
    tags: [],
  }),
}));