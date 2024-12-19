import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Gamepad,
  Users,
  BookOpen,
  Star,
  ArrowRight,
  Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/styles';
import { useDebounce } from '../../hooks/useDebounce';
import { SearchResult, searchService } from '../../services/searchService';
import { useSearch } from '../../hooks/useSearch';


export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const {
    setIsSearchOpen,
    handleSearchChange,
    handleSearchClear
  } = useSearch();
  
  // Universal search query
  const { data: results, isLoading } = useQuery({
    queryKey: ['universalSearch', debouncedQuery],
    queryFn: () => searchService.universalSearch(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused || !results?.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsFocused(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, results, selectedIndex]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setIsFocused(false);
    setQuery('');
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'game': return Gamepad;
      case 'user': return Users;
      case 'post': return BookOpen;
      default: return Search;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl" data-search>
      {/* Search Input */}
      <div 
      className={cn(
        "relative flex items-center transition-all",
        "bg-stone-800/50 rounded-full overflow-hidden transition-all duration-300",
                // Glow effect container
                "before:absolute before:inset-0 before:rounded-full before:opacity-0",
                "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
                "hover:before:opacity-100",
                isSearchFocused ? 'ring-2 ring-indigo-500/50 before:opacity-100' : ''
      )}>
        <Search className="w-5 ml-4 mr-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => {
            setIsSearchOpen(true);
            setIsSearchFocused(true);
          }}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Search games, friends, or posts..."
          className={cn(
            "w-full bg-transparent text-white px-4 py-2 outline-none relative z-10",
            "placeholder:text-gray-400",
            "transition-all duration-300"
          )}

        />
        {query && (
          <button
          onClick={handleSearchClear}
          className={cn(
            "p-2 hover:bg-stone-700/50 relative z-10",
            "transition-colors duration-300"
          )}
          aria-label="Clear search"
        >
          <X className="w-4 ml-2 mr-2 text-gray-400 hover:text-white hover:scale-110 transition-transform" />
        </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isFocused && debouncedQuery.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2",
              "bg-stone-900 rounded-xl shadow-xl",
              "border border-stone-800 overflow-hidden z-50"
            )}
          >
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : !results?.length ? (
              <div className="p-4 text-center text-gray-400">
                No results found
              </div>
            ) : (
              <div>
                {results.map((result, index) => {
                  const Icon = getIcon(result.type);
                  
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        "w-full p-3 flex items-center gap-3",
                        "hover:bg-stone-800 transition-colors",
                        selectedIndex === index && "bg-stone-800"
                      )}
                    >
                      {result.image ? (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1 text-left">
                        <h4 className="text-sm font-medium text-white">
                          {result.title}
                        </h4>
                        {result.subtitle && (
                          <p className="text-xs text-gray-400">
                            {result.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Type-specific metadata */}
                      {result.metadata && (
                        <div className="text-xs text-gray-400">
                          {result.type === 'game' && result.metadata.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              {result.metadata.rating}
                            </div>
                          )}
                          {result.type === 'user' && result.metadata.friendCount && (
                            <div>{result.metadata.friendCount} friends</div>
                          )}
                        </div>
                      )}

                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  );
                })}

                {/* View All Results */}
                <button
                  onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
                  className="w-full p-3 text-sm text-indigo-400 hover:bg-stone-800 transition-colors"
                >
                  View all results
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}