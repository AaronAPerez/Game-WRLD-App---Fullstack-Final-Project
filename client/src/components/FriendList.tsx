import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, MessageSquare, Gamepad2, X, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const mockFriends = [
  {
    id: 1,
    name: "Place Holder 1",
    avatar: "/api/placeholder/40/40",
    status: "online",
    lastGame: "Last Game",
    mutualGames: 15
  },
  {
    id: 2,
    name: "Place Holder 2",
    avatar: "/api/placeholder/40/40",
    status: "offline",
    lastGame: "Last Game 2",
    mutualGames: 8
  }
];

const FriendsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = ['all', 'online', 'offline', 'in-game'];

  const sendFriendRequest = async () => {
    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${userToken}`, // Add auth token if needed
        },
        body: JSON.stringify({ username: friendUsername }),
      });

      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }

      // Close the modal after the request is sent
      setShowAddFriend(false);
      // Optionally update friends list or show a success message
      alert('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Friends</h1>
          <p className="text-gray-400">Connect with fellow gamers</p>
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
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                selectedFilter === filter
                  ? 'bg-indigo-500 text-white'
                  : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Friends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFriends.map((friend) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-stone-900 rounded-xl p-6 border border-stone-800"
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-stone-900 ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{friend.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Gamepad2 className="w-4 h-4" />
                  {friend.lastGame}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {friend.mutualGames} mutual games
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
                  <Gamepad2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Friend Modal */}
      <AnimatePresence>
        {showAddFriend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-stone-900 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add Friend</h2>
                <button
                  onClick={() => setShowAddFriend(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter username or friend code"
                    value={friendUsername}
                    onChange={(e) => setFriendUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowAddFriend(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendFriendRequest}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FriendsList;
