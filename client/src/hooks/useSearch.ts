import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';


// Function Declaration
export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Close search on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-search]')) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isSearchOpen]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setIsSearchOpen(true);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
    setIsSearchOpen(false);
  }, []);

  return {
    searchQuery,
    debouncedSearch,
    isSearchOpen,
    setIsSearchOpen,
    handleSearchChange,
    handleSearchClear
  };
}
// import { useState, useCallback, useEffect } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { userService } from '../api/user';
// import { useDebounce } from './useDebounce';
// import type { UserProfileDTO } from '../types';

// export const useSearch = () => {
//   const [query, setQuery] = useState('');
//   const debouncedQuery = useDebounce(query, 300);
//   const queryClient = useQueryClient();

//   // Search users query
//   const { 
//     data: results = [], 
//     isLoading,
//     error 
//   } = useQuery({
//     queryKey: ['userSearch', debouncedQuery],
//     queryFn: () => userService.searchUsers(debouncedQuery),
//     enabled: debouncedQuery.length >= 2,
//     staleTime: 1000 * 60 // 1 minute
//   });

//   // Prefetch user profiles on hover
//   const prefetchUserProfile = useCallback((userId: number) => {
//     queryClient.prefetchQuery({
//       queryKey: ['userProfile', userId],
//       queryFn: () => userService.getUserProfile(userId)
//     });
//   }, [queryClient]);

//   return {
//     query,
//     setQuery,
//     results,
//     isLoading,
//     error,
//     prefetchUserProfile
//   };
// };