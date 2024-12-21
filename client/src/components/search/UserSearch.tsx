import { useSearch } from '../../hooks/useSearch';
import { useFriends } from '../../hooks/useFriends';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, UserPlus, Clock, Gamepad2, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { UserSearchCard } from './UserSearchCard';

export const UserSearch = () => {
  const { query, setQuery, results, isLoading } = useSearch();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'online' | 'friends'>('all');
  const { friends } = useFriends();

  const filteredResults = useMemo(() => {
    return results.filter(user => {
      if (selectedFilter === 'friends') {
        return friends.some(friend => friend.id === user.id);
      }
      if (selectedFilter === 'online') {
        return user.isOnline;
      }
      return true;
    });
  }, [results, selectedFilter, friends]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-8 h-8 text-indigo-500" />
        <div>
          <h1 className="text-3xl font-bold">Find Users</h1>
          <p className="text-gray-400">Connect with other gamers</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by username..."
            className="w-full pl-12 pr-4 py-3 bg-stone-800 rounded-xl text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8">
        {['all', 'online', 'friends'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter as typeof selectedFilter)}
            className={cn(
              "px-4 py-2 rounded-lg capitalize transition-colors",
              selectedFilter === filter
                ? "bg-indigo-500 text-white"
                : "bg-stone-800 text-gray-400 hover:bg-stone-700"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : query.length < 2 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">
              Start typing to search
            </h2>
            <p className="text-gray-400">
              Enter at least 2 characters to begin searching
            </p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">
              No users found
            </h2>
            <p className="text-gray-400">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredResults.map((user) => (
                <UserSearchCard key={user.id} user={user} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};