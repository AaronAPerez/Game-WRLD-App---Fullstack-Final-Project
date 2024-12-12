import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, UserPlus, MessageSquare, 
  Mail, Loader2, Users, Check,
  X, User
} from 'lucide-react';
import { cn } from '../../utils/styles';
import { UserService } from '../../services/userService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: number;
  username: string;
  avatar: string | null;
  status: 'online' | 'offline' | 'ingame';
  friendsCount: number;
  gamesCount: number;
  friendStatus?: 'none' | 'pending' | 'friends';
}

interface UserCardProps {
  user: UserProfile;
  onAddFriend: () => void;
  onMessage: () => void;
}

export const UserSearch = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Search Query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['searchUsers', searchQuery],
    queryFn: () => UserService.searchUsers(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  // Friend Request Mutation
  const sendFriendRequestMutation = useMutation({
    mutationFn: (userId: number) => UserService.sendFriendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      toast.success('Friend request sent!');
    },
    onError: () => {
      toast.error('Failed to send friend request');
    }
  });

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

   {/* Search Bar */}
   <div className="max-w-2xl mx-auto mb-8">
        <div className={cn(
          "relative",
          "focus-within:ring-2 focus-within:ring-indigo-500 rounded-xl"
        )}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by username..."
            className={cn(
              "w-full pl-12 pr-4 py-3 bg-stone-800 rounded-xl",
              "text-white placeholder:text-gray-400",
              "focus:outline-none"
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-stone-700"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : searchQuery.length < 2 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">
              Enter at least 2 characters to search
            </h2>
            <p className="text-gray-400">
              Find friends by typing their username
            </p>
          </div>
        ) : searchResults?.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">
              No users found
            </h2>
            <p className="text-gray-400">
              Try searching with a different username
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {searchResults?.map((user: UserProfile) => (
              <UserCard
                key={user.id}
                user={user}
                onAddFriend={() => sendFriendRequestMutation.mutate(user.id)}
                onMessage={() => navigate(`/messages/${user.id}`)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// User Card Component
const UserCard = ({ user, onAddFriend, onMessage }: UserCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-stone-900 rounded-xl p-6 border border-stone-800",
        "hover:border-indigo-500/30 transition-all duration-300",
        "group relative overflow-hidden"
      )}
    >
      {/* Status Indicator */}
      <div className={cn(
        "absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium",
        user.status === 'online' 
          ? "bg-green-500/20 text-green-400" 
          : user.status === 'ingame' 
            ? "bg-indigo-500/20 text-indigo-400" 
            : "bg-stone-800 text-gray-400"
      )}>
        {user.status}
      </div>

      {/* User Info */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt={user.username}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className={cn(
            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-stone-900",
            user.status === 'online' 
              ? "bg-green-500" 
              : user.status === 'ingame' 
                ? "bg-indigo-500" 
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
        <button
          onClick={onAddFriend}
          disabled={user.friendStatus === 'pending'}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2 rounded-lg flex-1",
            "transition-colors text-sm font-medium",
            user.friendStatus === 'pending'
              ? "bg-green-500/20 text-green-400"
              : "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
          )}
        >
          {user.friendStatus === 'pending' ? (
            <>
              <Check className="w-4 h-4" />
              <span>Request Sent</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Add Friend</span>
            </>
          )}
        </button>

        <button
          onClick={onMessage}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2 rounded-lg flex-1",
            "transition-colors text-sm font-medium",
            user.status === 'online'
              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
              : "bg-stone-800 text-gray-400 hover:bg-stone-700"
          )}
        >
          {user.status === 'online' ? (
            <>
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              <span>Message</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default UserSearch;