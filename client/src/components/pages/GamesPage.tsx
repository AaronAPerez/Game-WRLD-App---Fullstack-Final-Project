import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, Users, X } from 'lucide-react';
import { Game } from '@/types/game';
import { queryClient } from '@/lib/queryClient';
import { Link } from 'react-router-dom';
import gameService from '@/services/gameService';

// Filter types
interface FilterState {
  search: string;
  platforms: string[];
  genres: string[];
  ordering: string;
  dates: string;
  metacritic: string;
}

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Date added', value: '-added' },
  { label: 'Name', value: 'name' },
  { label: 'Release date', value: '-released' },
  { label: 'Popularity', value: '-metacritic' },
  { label: 'Average rating', value: '-rating' }
];

export default function GamesPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    platforms: [],
    genres: [],
    ordering: '',
    dates: '',
    metacritic: ''
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['games', filters],
    queryFn: () => gameService.getGames(filters)
  });

  const games = data?.results || [];

  return (
    <div className="min-h-screen rounded-lg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-4">
          <h1 className="text-3xl font-bold text-white">Games</h1>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search games..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg 
                  border border-gray-700 focus:border-indigo-500 focus:ring-2 
                  focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>
            
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 
                text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            <select
              value={filters.ordering}
              onChange={(e) => setFilters(prev => ({ ...prev, ordering: e.target.value }))}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg 
                border border-gray-700 focus:border-indigo-500 focus:ring-2
                focus:ring-indigo-500 focus:ring-opacity-50"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1280px,1fr] gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:block bg-gray-800/50 p-6 rounded-xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="lg:hidden text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter sections would go here */}
                {/* Platforms, Genres, Release Date, etc. */}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Games Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-800 rounded-xl mb-2" />
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load games</p>
              <button
                onClick={() => queryClient.invalidateQueries(['games'])}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {games.map((game: Game) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="group relative"
                  >
                    <Link to={`/games/${game.id}`}>
                      <div className="aspect-video rounded-xl overflow-hidden mb-2">
                      <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
        
        {/* Metadata */}
        <div className="flex items-center space-x-4 text-gray-300">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{game.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 text-blue-400 mr-1" />
            <span>{game.metacritic || 'N/A'}</span>
          </div>
          <div className="flex items-end gap-2 text-sm text-gray-400">
                        {/* <span>{game.released}</span> */}
                        {game.metacritic && (
                          <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded">
                            {game.metacritic}
                          </span>
                        )}
                      </div>
        </div>

        {/* Platforms */}
        <div className="mt-2 flex flex-wrap gap-2">
          {game.platforms.slice(0, 3).map(({ platform }) => (
            <span
              key={platform.id}
              className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300"
            >
              {platform.name}
            </span>
          ))}
          
          {game.platforms.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300">
              +{game.platforms.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Enhanced Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-sm line-clamp-2">
            Click to view more details
          </p>
        </div>
      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// export default GamesPage;