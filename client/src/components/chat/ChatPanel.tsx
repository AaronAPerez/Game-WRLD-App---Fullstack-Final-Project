import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  MessageSquare, 
  Users,
  Loader2,
  ArrowLeft,
  X 
} from 'lucide-react';
<<<<<<< HEAD

import { cn } from '../../utils/styles';
import { UserProfileDTO } from '../../types';
import { ChatMessages } from './ChatMessages';


=======
import { userService } from '../../services/userService';
import { cn } from '../../utils/styles';
import type { UserProfileDTO } from '../../types/index';
import { ChatMessages } from './ChatMessages';

>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17
// Types
interface ConversationListProps {
  onUserSelect: (user: UserProfileDTO) => void;
  selectedUser: UserProfileDTO | null;
}

interface ChatPanelProps {
  className?: string;
}

// Conversation List Component
const ConversationList = ({ onUserSelect, selectedUser }: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch friends list
  const { data: friends, isLoading } = useQuery({
    queryKey: ['friends'],
<<<<<<< HEAD
    queryFn: UserService.getFriends
=======
    queryFn: userService.getFriends
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17
  });

  // Filter friends based on search
  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    return friends.filter(friend => 
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredFriends.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Users className="w-8 h-8 mb-2" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          filteredFriends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => onUserSelect(friend)}
              className={cn(
                "w-full p-4 flex items-center gap-3 hover:bg-stone-800 transition-colors",
                selectedUser?.id === friend.id && "bg-stone-800"
              )}
            >
              <div className="relative">
                <img
                  src={friend.avatar || '/default-avatar.png'}
                  alt={friend.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-stone-900",
                  friend.isOnline ? "bg-green-500" : "bg-gray-500"
                )} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white">{friend.username}</h3>
                <p className="text-sm text-gray-400">
                  {friend.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

// Main ChatPanel Component
export const ChatPanel = ({ className }: ChatPanelProps) => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<UserProfileDTO | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(true);

  return (
    <div className={cn("flex h-full", className)}>
      {/* Mobile Nav Toggle */}
      <button
        onClick={() => setIsNavOpen(!isNavOpen)}
        className="lg:hidden fixed bottom-4 right-4 p-4 bg-indigo-500 text-white rounded-full shadow-lg z-50"
      >
        {isNavOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Conversations Navigation */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={cn(
              "w-full max-w-sm border-r border-stone-800 bg-stone-900",
              "fixed inset-y-0 left-0 z-40 lg:static"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-stone-800 flex items-center gap-2">
              <ArrowLeft 
                className="lg:hidden w-6 h-6 cursor-pointer" 
                onClick={() => navigate(-1)} 
              />
              <h2 className="text-xl font-bold">Messages</h2>
            </div>

            <ConversationList
              onUserSelect={setSelectedUser}
              selectedUser={selectedUser}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedUser ? (
          <ChatMessages selectedUser={selectedUser} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Select a Conversation</h3>
              <p className="text-sm">Choose a friend to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};