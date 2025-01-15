import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gameService } from '../services/gameService';
import { useFilterStore } from '../store/filterStore';
import { AnimatePresence, motion } from 'framer-motion';
import FilterSection from './FilterSection';
import { Calendar, ChevronDown, Gamepad, Search, SlidersHorizontal, Star, Tag, X } from 'lucide-react';

export const FilterBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const filterStore = useFilterStore();



  // Use the store values properly
  const {
    search = '',
    platforms = [],
    genres = [],
    ordering = '',
    dates = '',
    metacritic = '',
    tags = [],
    setSearch,
    setPlatforms,
    setGenres,
    setOrdering,
    setDates,
    setMetacritic,
    setTags,
    reset,
  } = filterStore;

  // Calculate active filters
  const activeFilterCount =
    platforms.length +
    genres.length +
    tags.length +
    (dates ? 1 : 0) +
    (metacritic ? 1 : 0);


  return (
    <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Search and Main Controls */}
        <motion.div
          className="flex flex-wrap gap-4 items-center"
          layout
        >
          {/* Search Bar */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search games..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg 
                  border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500
                  transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                    hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-gray-800 text-white rounded-lg
                border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500
                cursor-pointer transition-all duration-200"
            >
              <option value="">Sort by</option>
              <option value="-released">Release Date</option>
              <option value="-rating">Rating</option>
              <option value="-metacritic">Metacritic</option>
              <option value="name">Name</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg
              border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-purple-600 text-xs px-2 py-0.5 rounded-full"
              >
                {activeFilterCount}
              </motion.span>
            )}
          </motion.button>

          {/* Clear Filters */}
          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={reset}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Clear All
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={filterContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                {/* Platforms */}
                <FilterSection
                  icon={<Gamepad/>}
                  title="Platforms"
                  value={filterStore.platforms}
                  onChange={filterStore.setPlatforms}
                  options={platforms?.map(platform => ({
                    id: platform.id,
                    name: platform.name,
                  })) || []}
                />

                <FilterSection
                  icon={<Tag />}
                  title="Genres"
                  value={filterStore.genres}
                  onChange={filterStore.setGenres}
                  options={genres?.map(genre => ({
                    id: genre.id,
                    name: genre.name,
                  })) || []}
                />
                {/* Release Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      Release Date
                    </div>
                  </label>
                  <select
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg
                      border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Any Time</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2015,2019">2015-2019</option>
                    <option value="2010,2014">2010-2014</option>
                  </select>
                </div>

                {/* Metacritic Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <div className="flex items-center gap-2">
                      <Star size={18} />
                      Metacritic Score
                    </div>
                  </label>
                  <select
                    value={metacritic}
                    onChange={(e) => setMetacritic(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg
                      border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Any Score</option>
                    <option value="90,100">Exceptional (90+)</option>
                    <option value="80,89">Great (80-89)</option>
                    <option value="70,79">Good (70-79)</option>
                    <option value="60,69">Mixed (60-69)</option>
                    <option value="50,59">Poor (50-59)</option>
                    <option value="0,49">Bad (0-49)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


export default FilterBar;