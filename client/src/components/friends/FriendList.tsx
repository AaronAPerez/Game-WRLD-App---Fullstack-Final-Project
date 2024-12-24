import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search,
  Users,
} from 'lucide-react';
import { cn } from '../../utils/styles';
import { UserService } from '../../services/userService';
import { FriendCard } from './FriendCard';



export const FriendList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'online' | 'offline'>('all');

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: UserService.getFriends
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