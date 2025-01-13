import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Gamepad2,
  Users,
  BookMarked,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const menuItems = [
  { id: 1, title: 'Home', icon: Home, path: '/' },
  { id: 2, title: 'Games', icon: Gamepad2, path: '/games' },
  { id: 3, title: 'Community', icon: Users, path: '/community' },
  { id: 4, title: 'Library', icon: BookMarked, path: '/library' },
  { id: 5, title: 'Messages', icon: MessageSquare, path: '/messages' },
  { id: 6, title: 'Settings', icon: Settings, path: '/settings' },
];

const AnimatedSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-gray-200 border-r border-gray-800 
        transition-all duration-300 ease-in-out transform ${
          isExpanded ? 'w-64' : 'w-20'
        } z-50`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setExpandedItem(null);
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-8 bg-purple-600 rounded-full p-1.5 transform transition-transform hover:scale-110"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4 text-white" />
        ) : (
          <ChevronRight className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Logo */}
      <div className={`flex items-center h-16 px-6 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <Gamepad2 className="w-5 h-5 text-white" />
        </div>
        {isExpanded && (
          <span className="ml-3 font-bold text-xl text-white opacity-100 transition-opacity duration-200">
            GameHub
          </span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="mt-8 px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isItemExpanded = expandedItem === item.id;

          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setExpandedItem(item.id)}
              onMouseLeave={() => setExpandedItem(null)}
            >
              <button
                onClick={() => handleItemClick(item.path)}
                className={`flex items-center w-full p-3 mb-2 rounded-lg transition-all duration-200
                  ${isActive ? 'bg-purple-600 text-white' : 'hover:bg-gray-800'}`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                
                <span
                  className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300
                    ${!isExpanded ? 'w-0 opacity-0' : 'w-40 opacity-100'}`}
                >
                  {item.title}
                </span>

                {/* Hover Effect */}
                {isItemExpanded && isExpanded && (
                  <div className="absolute left-12 right-3 bottom-0 h-0.5 bg-purple-500 transform origin-left scale-x-0 animate-expand" />
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={logout}
        className={`absolute bottom-8 left-0 right-0 mx-3 flex items-center p-3 rounded-lg
          hover:bg-gray-800 transition-all duration-200`}
      >
        <LogOut className="w-6 h-6 text-gray-400" />
        <span
          className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300
            ${!isExpanded ? 'w-0 opacity-0' : 'w-40 opacity-100'}`}
        >
          Logout
        </span>
      </button>
    </div>
  );
};

export default AnimatedSidebar;