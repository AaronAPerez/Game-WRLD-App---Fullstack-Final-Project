import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FilterStore extends FilterState {
  setSearch: (search: string) => void;
  setPlatforms: (platforms: number[]) => void;
  setGenres: (genres: number[]) => void;
  setOrdering: (ordering: string) => void;
  setDates: (dates: string) => void;
  setMetacritic: (metacritic: string) => void;
  setTags: (tags: number[]) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

const initialState: FilterState = {
  search: '',
  platforms: [],
  genres: [],
  ordering: '',
  dates: '',
  metacritic: '',
  tags: [],
  page: 1,
  page_size: 20,
};

export const useFilterStore = create<FilterStore>()(
  devtools((set) => ({
    ...initialState,
    setSearch: (search) => set({ search, page: 1 }),
    setPlatforms: (platforms) => set({ platforms, page: 1 }),
    setGenres: (genres) => set({ genres, page: 1 }),
    setOrdering: (ordering) => set({ ordering, page: 1 }),
    setDates: (dates) => set({ dates, page: 1 }),
    setMetacritic: (metacritic) => set({ metacritic, page: 1 }),
    setTags: (tags) => set({ tags, page: 1 }),
    setPage: (page) => set({ page }),
    reset: () => set(initialState),
  }))
);