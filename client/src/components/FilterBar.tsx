import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, SlidersHorizontal, X, ChevronDown, 
  Calendar, Star, Tag, 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilterStore } from '../store/filterStore';

export const FilterBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    search,
    platforms,
    genres,
    ordering,
    dates,
    metacritic,
    tags,
    setSearch,
    setPlatforms,
    setGenres,
    setOrdering,
    setDates,
    setMetacritic,
    setTags,
    reset,
  } = useFilterStore();

  // Fetch filter options
  const { data: platformsData } = useQuery({
    queryKey: ['platforms'],
    queryFn: setPlatforms,
  });

  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: setGenres,
  });

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: setTags,
  });

  return (
    <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Search and Main Controls */}
        <div className="flex flex-wrap gap-4 items-center">
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

          {/* Filter Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg
              border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
            <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full">
              {platforms.length + genres.length + tags.length + (dates ? 1 : 0) + (metacritic ? 1 : 0)}
            </span>
          </button>

          {/* Reset Filters */}
          {(platforms.length > 0 || genres.length > 0 || tags.length > 0 || dates || metacritic) && (
            <button
              onClick={reset}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                {/* Platforms */}
                <FilterSection
                  icon={<GameController />}
                  title="Platforms"
                  value={platforms}
                  onChange={setPlatforms}
                  options={platformsData?.results.map((platform) => ({
                    id: platform.id,
                    name: platform.name,
                  })) || []}
                />

                {/* Genres */}
                <FilterSection
                  icon={<Tag />}
                  title="Genres"
                  value={genres}
                  onChange={setGenres}
                  options={genresData?.results.map((genre) => ({
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

interface FilterSectionProps {
  icon: React.ReactNode;
  title: string;
  value: number[];
  onChange: (value: number[]) => void;
  options: { id: number; name: string; }[];
}

const FilterSection = ({ icon, title, value, onChange, options }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (id: number) => {
    const newValue = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...value, id];
    onChange(newValue);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 text-white
          rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
          {value.length > 0 && (
            <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full">
              {value.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 py-2 bg-gray-800 rounded-lg border border-gray-700
              shadow-lg max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.map((option) => (
              <label
                key={option.id}
                className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.id)}
                  onChange={() => handleToggle(option.id)}
                  className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                />
                <span className="ml-2 text-white">{option.name}</span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;