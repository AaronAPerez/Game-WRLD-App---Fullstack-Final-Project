import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, User, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import { useFriends } from "../../hooks/useFriends";
import { UserProfileDTO } from "../../types";
import { useState } from "react";
import { cn } from "../../utils/styles";

interface UserSearchCardProps {
    user: UserProfileDTO;
  }
  
  export const UserSearchCard = ({ user }: UserSearchCardProps) => {
    const { prefetchUserProfile } = useSearch();
    const { friends, sendRequest } = useFriends();
    const isFriend = friends.some(friend => friend.id === user.id);
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-stone-900 rounded-xl p-6 border border-stone-800"
        onMouseEnter={() => {
          setIsHovered(true);
          prefetchUserProfile(user.id);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-4">
          {/* Avatar & Status */}
          <div className="relative">
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.username}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className={cn(
              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-stone-900",
              user.isOnline ? "bg-green-500" : "bg-gray-500"
            )} />
          </div>
  
          {/* User Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{user.username}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
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
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-3 mt-6"
            >
              {isFriend ? (
                <Link
                  to={`/messages/${user.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </Link>
              ) : (
                <button
                  onClick={() => sendRequest(user.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Friend</span>
                </button>
              )}
              
              <Link
                to={`/profile/${user.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-stone-800 text-gray-400 rounded-lg hover:bg-stone-700"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };