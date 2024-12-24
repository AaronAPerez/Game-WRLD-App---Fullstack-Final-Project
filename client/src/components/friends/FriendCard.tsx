import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/styles";
import { UserProfile } from "../../types/chat";

interface FriendCardProps {
    friend: UserProfile;
  }
  
  export const FriendCard = ({ friend }: FriendCardProps) => {
    const navigate = useNavigate();
    const [showActions, setShowActions] = useState(false);
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-stone-900 rounded-xl p-6 border border-stone-800 hover:border-stone-700 transition-colors"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center gap-4">
          {/* Avatar & Status */}
          <div className="relative">
            <img
              src={friend.avatar || '/default-avatar.png'}
              alt={friend.username}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className={cn(
              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-stone-900",
              friend.isOnline ? "bg-green-500" : "bg-gray-500"
            )} />
          </div>
  
          {/* User Info */}
          <div className="flex-1">
            <h3 className="font-medium text-white">
              {friend.username}
            </h3>
            <p className="text-sm text-gray-400">
              {friend.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
  
        {/* Action Buttons */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-2 mt-4"
            >
              <button
                onClick={() => navigate(`/messages/${friend.id}`)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
              <button
                onClick={() => navigate(`/profile/${friend.id}`)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-stone-800 text-gray-400 rounded-lg hover:bg-stone-700"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };