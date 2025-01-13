import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import { gameService } from '../services/gameService';
import { Game } from '../types/game';
import { useNavigate } from 'react-router-dom';

export const useGameSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    data: searchResults,
    isLoading: isSearching,
    error
  } = useQuery({
    queryKey: ['gameSearch', debouncedSearch],
    queryFn: () => gameService.getGames({ 
      search: debouncedSearch,
      page_size: 5 
    }),
    enabled: debouncedSearch.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-search-container]')) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSearchSelect = (game: Game) => {
    navigate(`/games/${game.id}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    isSearching,
    searchResults: searchResults?.results || [],
    handleSearchSelect,
    error
  };
};