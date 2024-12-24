import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Users, Gamepad2, BookOpen, Star } from 'lucide-react';
import { gameService } from '../services/gameService';
import { GameCard } from '../components/game/GameCard';
import { useAuth } from '../hooks/useAuth';
import { AvatarUpload } from '../components/AvatarUpload';
import { Game } from '../types/rawg';
import { MessageCircle, Send, Plus, X } from 'lucide-react';

// Define type interfaces
interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}


const DashboardCard = ({ }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-stone-900 rounded-xl p-6 border border-stone-800"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);


const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites');

  
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([

    {
      id: '1',
      userId: '1',
      username: 'RetroGamer',
      content: 'Hey everyone! Anyone up for some Mario Kart?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: '2',
      userId: '2',
      username: 'NintendoPro',
      content: 'Count me in! Been practicing on Rainbow Road 🌈',
      timestamp: new Date(Date.now() - 1000 * 60 * 10)
    }
  ]);

  const chatRooms: ChatRoom[] = [
    {
      id: '1',
      name: 'Retro Nintendo',
      description: 'Discussion about classic Nintendo games and consoles',
      memberCount: 156
    },
    {
      id: '2',
      name: 'SEGA Classics',
      description: 'Everything SEGA from Master System to Dreamcast',
      memberCount: 89
    }
  ];

  const formatTimestamp = (date: Date) => {
    const minutes = Math.ceil((date.getTime() - Date.now()) / (1000 * 60));
    return `${Math.abs(minutes)} minutes ago`;
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: String(messages.length + 1),
        userId: 'current-user',
        username: 'You',
        content: message,
        timestamp: new Date()
      }]);
      setMessage('');
    }
  };



  // Fetch favorite games (placeholder data)
  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => gameService.getGames({ page_size: 4 })
  });

  const stats = [
    {
      title: 'Favorite Games',
      value: '12',
      description: 'Games in collection',
      icon: Heart,
      color: 'bg-red-500/10 text-red-500'
    },
    {
      title: 'Blog Posts',
      value: '8',
      description: 'Published articles',
      icon: BookOpen,
      color: 'bg-indigo-500/10 text-indigo-500'
    },
    {
      title: 'Friends',
      value: '24',
      description: 'Gaming buddies',
      icon: Users,
      color: 'bg-green-500/10 text-green-500'
    },
    {
      title: 'Messages',
      value: '5',
      description: 'Unread messages',
      icon: MessageSquare,
      color: 'bg-yellow-500/10 text-yellow-500'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Section */}
      <div className="flex w-full flex-col lg:flex-row">
        <div className="card bg-base-300 rounded-box grid flex-grow place-items-center mb-5">
          <AvatarUpload />
        </div>
        <div className="divider lg:divider-horizontal"></div>

        <div className="card bg-base-300 rounded-box grid h-32 flex-grow place-items-center">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.publisherName}
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your gaming profile
          </p>
        </div>
      </div>



  
      <div className="bg-stone-950 p-4">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-stone-800 pb-4">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span>Chat Rooms</span>
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'social' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Social Feed</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chat Rooms List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Chat Rooms</h2>
                <button className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors">
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  className={`bg-stone-900 rounded-lg p-4 hover:bg-stone-800 cursor-pointer transition-colors ${
                    selectedChat?.id === room.id ? 'bg-stone-800' : ''
                  }`}
                  onClick={() => setSelectedChat(room)}
                >
                  <h3 className="font-bold text-white">{room.name}</h3>
                  <p className="text-sm text-gray-400">{room.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{room.memberCount} members</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2">
              <div className="bg-stone-900 rounded-lg h-[600px]">
                {selectedChat ? (
                  <div className="h-full flex flex-col">
                    <div className="border-b border-stone-800 p-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">{selectedChat.name}</h2>
                        <button 
                          onClick={() => setSelectedChat(null)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {msg.username[0]}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">
                                {msg.username}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatTimestamp(msg.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-300">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-stone-800">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..."
                          className="flex-1 bg-stone-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="bg-indigo-600 p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Send className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Select a Chat Room
                    </h3>
                    <p className="text-gray-400">
                      Choose a room from the list to start chatting
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Placeholder social feed content */}
            <div className="bg-stone-900 rounded-lg p-6">
              <div className="text-center text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Social Feed Coming Soon
                </h3>
                <p>Stay tuned for updates and social features!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>






      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* Content Tabs */}
      <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">
        <div className="flex gap-4 border-b border-stone-800 mb-6">
          {['favorites', 'recent', 'achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm font-medium transition-colors relative
                ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                />
              )}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites?.results.map((game) => (
            <GameCard key={game.id} game={game} onClick={function (game: Game): void {
              throw new Error('Function not implemented.');
            } } rank={0} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center mt-8 gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors">
            <Gamepad2 className="w-4 h-4" />
            Add Game
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors">
            <Star className="w-4 h-4" />
            Write Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;