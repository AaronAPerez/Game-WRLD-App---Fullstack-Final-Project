import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useGames } from '../hooks/useGames';

const sortOptions = [
  { label: 'Relevance', value: '' },
  { label: 'Date added', value: '-added' },
  { label: 'Name', value: 'name' },
  { label: 'Release date', value: '-released' },
  { label: 'Popularity', value: '-metacritic' },
  { label: 'Rating', value: '-rating' },
];

export const FilterBar = () => {
  const { filters, updateFilters } = useGames();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  return (
    <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={filters.search || ''}
                onChange={(e) => updateFilters({ search: e.target.value })}
              />
            </div>
          </div>

          {/* Sort and Filter */}
          <div className="flex gap-4">
            <select
              className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={filters.ordering || ''}
              onChange={(e) => updateFilters({ ordering: e.target.value })}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Extended Filters */}
        {isFilterOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Platform
              </label>
              <select
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                value={filters.platforms || ''}
                onChange={(e) => updateFilters({ platforms: e.target.value })}
              >
                <option value="">All Platforms</option>
                <option value="4">PC</option>
                <option value="187">PlayStation 5</option>
                <option value="1">Xbox Series X</option>
                <option value="7">Nintendo Switch</option>
              </select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Genre
              </label>
              <select
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                value={filters.genres || ''}
                onChange={(e) => updateFilters({ genres: e.target.value })}
              >
                <option value="">All Genres</option>
                <option value="action">Action</option>
                <option value="rpg">RPG</option>
                <option value="strategy">Strategy</option>
                <option value="shooter">Shooter</option>
                <option value="adventure">Adventure</option>
                <option value="indie">Indie</option>
                <option value="simulation">Simulation</option>
              </select>
            </div>

            {/* Release Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Release Year
              </label>
              <select
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                value={filters.dates || ''}
                onChange={(e) => updateFilters({ dates: e.target.value })}
              >
                <option value="">All Time</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2015,2019">2015-2019</option>
                <option value="2010,2014">2010-2014</option>
                <option value="2000,2009">2000-2009</option>
                <option value="1990,1999">1990-1999</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Minimum Rating
              </label>
              <select
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                value={filters.metacritic || ''}
                onChange={(e) => updateFilters({ metacritic: e.target.value })}
              >
                <option value="">Any Rating</option>
                <option value="90,100">90+</option>
                <option value="80,89">80-89</option>
                <option value="70,79">70-79</option>
                <option value="60,69">60-69</option>
                <option value="50,59">50-59</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;