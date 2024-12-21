import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  MessageSquare, 
  Users,
  Gamepad,
  Loader2,
  Filter
} from 'lucide-react';
import { cn } from '../../utils/styles';

import { FriendActionButton } from '../friends/FriendActionButton';
import { ChatActionButton } from '../chat/ChatActionButton';
import { searchService, UserSearchFilters } from '../../services/searchService';
import { UserProfileDTO } from '../../types';



export function UserSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<UserSearchFilters>({
    query: searchParams.get('q') || '',
    status: 'all',
    mutualFriends: false,
    mutualGames: false
  });

  // Search users with filters
  const { data: users, isLoading } = useQuery({
    queryKey: ['userSearch', filters],
    queryFn: () => searchService.searchUsers(filters),
    enabled: filters.query.length >= 2
  });

  // Update URL and filters when query changes
  const updateQuery = (newQuery: string) => {
    setFilters(prev => ({ ...prev, query: newQuery }));
    setSearchParams(newQuery ? { q: newQuery } : {});
  };

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter(user => {
      const statusMatch = filters.status === 'all' || 
        (filters.status === 'online' && user.status === 'online') ||
        (filters.status === 'offline' && user.status === 'offline');
      
      return statusMatch;
    });
  }, [users, filters.status]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-8 h-8 text-indigo-500" />
        <div>
          <h1 className="text-3xl font-bold">Find Friends</h1>
          <p className="text-gray-400">Connect with other gamers</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder="Search users by username..."
              className={cn(
                "w-full pl-10 pr-4 py-3 bg-stone-800 rounded-lg",
                "text-white placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500"
              )}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              status: e.target.value as 'online' | 'offline' | 'all' 
            }))}
            className={cn(
              "px-4 py-2 bg-stone-800 rounded-lg",
              "text-white border-none",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500"
            )}
          >
            <option value="all">All Users</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          {/* Mutual Friends Filter */}
          <button
            onClick={() => setFilters(prev => ({ 
              ...prev, 
              mutualFriends: !prev.mutualFriends 
            }))}
            className={cn(
              "px-4 py-2 rounded-lg flex items-center gap-2",
              "transition-colors",
              filters.mutualFriends
                ? "bg-indigo-500/20 text-indigo-400"
                : "bg-stone-800 text-gray-400"
            )}
          >
            <Users className="w-4 h-4" />
            Mutual Friends
          </button>

          {/* Mutual Games Filter */}
          <button
            onClick={() => setFilters(prev => ({ 
              ...prev, 
              mutualGames: !prev.mutualGames 
            }))}
            className={cn(
              "px-4 py-2 rounded-lg flex items-center gap-2",
              "transition-colors",
              filters.mutualGames
                ? "bg-indigo-500/20 text-indigo-400"
                : "bg-stone-800 text-gray-400"
            )}
          >
            <Gamepad className="w-4 h-4" />
            Mutual Games
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">
              No users found
            </h2>
            <p className="text-gray-400">
              Try a different search or adjust filters
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// User Card Component
const UserCard = ({ user }: { user: UserProfileDTO }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-stone-900 rounded-xl p-6 border border-stone-800",
        "hover:border-indigo-500/30 transition-all duration-300"
      )}
    >
      {/* User Info */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt={user.username}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className={cn(
            "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-stone-900",
            user.status === 'online' 
              ? "bg-green-500" 
              : "bg-gray-500"
          )} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">{user.username}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-400">
              {user.friendsCount} friends
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-sm text-gray-400">
              {user.gamesCount} games
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-6">
        <FriendActionButton targetUser={user} />
        <ChatActionButton targetUser={user} />
      </div>
    </motion.div>
  );
};

export default UserSearch;