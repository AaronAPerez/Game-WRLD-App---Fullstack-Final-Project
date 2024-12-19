import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  MessageSquare, 
  X, 
  User,
  Users,
  Loader2 
} from 'lucide-react';
import { friendService } from '../../services/friendService';
import { cn } from '../../utils/styles';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function FriendList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);

  // Fetch friends list
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: friendService.getFriends
  });

  // Remove friend mutation
  const removeFriendMutation = useMutation({
    mutationFn: friendService.removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries(['friends']);
      toast.success('Friend removed');
    }
  });

  // Filter friends based on search
  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Friends</h1>
          <p className="text-gray-400">Manage your friends and connections</p>
        </div>
        <button
          onClick={() => setShowAddFriend(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Friend
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Friends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
            <Users className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-medium">No friends found</h2>
            <p>Try adjusting your search or add new friends</p>
          </div>
        ) : (
          filteredFriends.map((friend) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-stone-900 rounded-xl p-6 border border-stone-800"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={friend.avatar || '/default-avatar.png'}
                    alt={friend.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-stone-900",
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

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/messages/${friend.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to remove this friend?')) {
                      removeFriendMutation.mutate(friend.id);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}