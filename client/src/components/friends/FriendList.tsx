import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search,
  Users,
  User,
  MessageSquare,
  UserPlus 
} from 'lucide-react';
import { cn } from '../../utils/styles';
import { userService } from '../../api/user';
import type { UserProfileDTO } from '../../types';
import { Link } from 'react-router-dom';

interface FriendCardProps {
  friend: UserProfileDTO;
}

const FriendCard = ({ friend }: FriendCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-stone-900 rounded-xl p-6 border border-stone-800"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={friend.avatar || '/default-avatar.png'}
            alt={friend.username}
            className="w-12 h-12 rounded-full"
          />
          <div className={cn(
            "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-stone-900",
            friend.isOnline ? "bg-green-500" : "bg-gray-500"
          )} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-white">{friend.username}</h3>
          <p className="text-sm text-gray-400">
            {friend.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Link
          to={`/messages/${friend.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30"
        >
          <MessageSquare className="w-4 h-4" />
          Message
        </Link>
        
        <Link
          to={`/profile/${friend.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-stone-800 text-gray-400 rounded-lg hover:bg-stone-700"
        >
          <User className="w-4 h-4" />
          Profile
        </Link>
      </div>
    </motion.div>
  );
};

export const FriendList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'online' | 'offline'>('all');

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: userService.getFriends
  });

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      selectedFilter === 'all' || 
      (selectedFilter === 'online' ? friend.isOnline : !friend.isOnline);

    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends..."
            className="w-full pl-10 pr-4 py-2 bg-stone-800 rounded-lg text-white"
          />
        </div>
        
        <div className="flex gap-2">
          {(['all', 'online', 'offline'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-lg capitalize",
                selectedFilter === filter
                  ? "bg-indigo-500 text-white"
                  : "bg-stone-800 text-gray-400 hover:bg-stone-700"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Friends Grid */}
      {filteredFriends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFriends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No friends found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};