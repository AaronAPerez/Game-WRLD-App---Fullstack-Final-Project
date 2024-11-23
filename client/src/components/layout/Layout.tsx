import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import Sidebar from './SideBar';
import { Link, Outlet } from 'react-router-dom';
import Logo from '../../assets/Images/logo.png';
import { cn } from '../../utils/styles';

// Interface defining user profile data structure
interface UserProfile {
  imageUrl: string;
  name: string;
}

// Layout Component 
const Layout = () => {
  // State Management
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Handle responsive layout, Auto collapses sidebar on mobile 
  useEffect(() => {
    const handleResize = (): void => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    // Initial check, event listener setup
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Main Container */}
      <div className="bg-stone-950">
        {/* Header Section */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-stone-950 z-50 flex items-center px-4">
          {/* Left Section - Logo and Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-stone-800 rounded-full"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <Link to="/" aria-label="Home">
              <img
                src={Logo}
                alt="Game WRLD"
                className="w-16 h-full object-contain"
              />
            </Link>
          </div>

          {/* Search Section */}
          <div className="flex-1 max-w-3xl mx-auto px-8">
            <div className={cn(
              "flex items-center bg-stone-800 rounded-full overflow-hidden transition-all",
              isSearchFocused ? 'ring-2 ring-green-700' : ''
            )}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search games..."
                className="w-full bg-transparent text-white px-6 outline-none
                          rounded-full border-2 border-gray-800 focus:border-green-700
                          transition-all duration-300"
                aria-label="Search games"
              />
              {/* Clear Search Button */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-2 hover:bg-stone-700"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              {/* Search Button */}
              <button 
                className="px-6 py-2 hover:bg-stone-600"
                aria-label="Search"
              >
                <Search className="w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-green-600">Login</Link>
            <Link to="/signup" className="hover:text-green-600">Sign Up</Link>
            
            {/* User Profile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="items-center gap-3 px-4 py-2 
                        bg-gradient-game rounded-full cursor-pointer"
            >
              <img
                src="https://assets.vogue.in/photos/5d7224d50ce95e0008696c55/2:3/w_2560%2Cc_limit/Joker.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </motion.div>
          </div>
        </header>
      </div>

      {/* Main Layout Structure */}
      <div className="pt-16 flex">
        {/* Animated Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 230, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 top-16 bottom-0 bg-stone-950 z-40 border-r border-stone-800"
            >
              <Sidebar isCollapsed={false} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 custom-scrollbar",
            isSidebarOpen ? 'ml-60' : 'ml-0'
          )}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;