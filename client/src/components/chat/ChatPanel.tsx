import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Users,
  UserPlus,
  MessageSquare,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Conversation } from './Conversation';
import { ConversationList } from './ConversationList';
import { useChatStore } from '../../store/chatStore';
import { chatService } from '../../services/chatService';
import { friendService } from '../../services/friendService';
import { userService } from '../../services/userService';
import { cn } from '../../utils/styles';
import { toast } from 'react-hot-toast';


interface ChatPanelProps {
  onClose: () => void;
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'conversations' | 'search' | 'chat'>('conversations');
  const { activeConversation, setActiveConversation } = useChatStore();

  // Search users query
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['userSearch', searchQuery],
    queryFn: () => userService.searchUsers(searchQuery),
    enabled: searchQuery.length >= 2 && view === 'search',
  });

  // Send friend request mutation
  const sendFriendRequestMutation = useMutation({
    mutationFn: (userId: number) => friendService.sendFriendRequest(userId),
    onSuccess: () => {
      toast.success('Friend request sent!');
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });

  // Start conversation mutation
  const startConversationMutation = useMutation({
    mutationFn: (userId: number) => chatService.startDirectMessage(userId),
    onSuccess: (_, userId) => {
      const user = searchResults?.find(u => u.id === userId);
      if (user) {
        setActiveConversation(user);
        setView('chat');
      }
    },
  });

  const handleBack = () => {
    if (view === 'chat') {
      setActiveConversation(null);
    }
    setView('conversations');
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setView('search');
    } else if (query.length === 0) {
      setView('conversations');
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed right-0 top-16 bottom-0 w-96 bg-stone-950 border-l border-stone-800 shadow-xl z-50"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-stone-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {(view === 'search' || view === 'chat') && (
                <button
                  onClick={handleBack}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-lg font-semibold text-white">
                {view === 'search' ? 'Search Users' : 'Messages'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {view !== 'chat' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-9 pr-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {view === 'chat' && activeConversation ? (
              <Conversation
                key="conversation"
                contact={activeConversation}
                onBack={handleBack}
              />
            ) : view === 'search' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto"
              >
                {isSearching ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                  </div>
                ) : searchResults?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                    <Users className="w-8 h-8 mb-2" />
                    <p>No users found</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {searchResults?.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-stone-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={user.avatar || '/default-avatar.png'}
                              alt={user.username || `User ${user.id.toString()}`}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className={cn(
                              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-stone-800",
                              user.status === 'online'
                                ? "bg-green-500"
                                : user.status === 'ingame'
                                  ? "bg-indigo-500"
                                  : "bg-gray-500"
                            )} />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-medium text-white">
                              {user.username}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {user.friendsCount} friends • {user.gamesCount} games
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => sendFriendRequestMutation.mutate(user.id)}
                            disabled={sendFriendRequestMutation.isPending}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 flex-1"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span>Add Friend</span>
                          </button>
                          <button
                            onClick={() => startConversationMutation.mutate(user.id)}
                            disabled={startConversationMutation.isPending}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 flex-1"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Message</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <ConversationList
                key="conversations"
                onUserClick={(user) => {
                  setActiveConversation(user);
                  setView('chat');
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}