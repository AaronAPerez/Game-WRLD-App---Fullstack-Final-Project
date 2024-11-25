import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import Sidebar from './SideBar';
import { Link, Outlet } from 'react-router-dom';
import { cn } from '../../utils/styles';
import Logo from '../Logo';
import { useSearch } from '../../hooks/useSearch';
import SearchResults from '../SearchResults';

// Layout Component 
const Layout = () => {
  // State Management
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [, setIsMobile] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const {
    searchQuery,
    debouncedSearch,
    isSearchOpen,
    setIsSearchOpen,
    handleSearchChange,
    handleSearchClear
  } = useSearch();

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
        <header className="fixed top-0 left-0 right-0 h-16 bg-stone-950 z-50 flex items-center px-2 bg-stone-950/80 backdrop-blur-md">
          {/* Left Section - Logo and Menu */}
          <div className="display flex">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "relative p-2 rounded-full transition-all duration-300",
                "hover:bg-stone-800/50 group",
                // Glow effect
                "before:absolute before:inset-0 before:rounded-full before:opacity-0",
                "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
                "hover:before:opacity-100"
              )}
              title="Side Menu"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}>
              <Menu className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:scale-110 transition-transform" />
            </button>

            {/*  Logo */}
            <Link to="/" aria-label="Home" className="hover:opacity-90 transition-opacity">
              <Logo className="w-40" />
            </Link>
          </div>
          {/* Search Section */}
          <div className="flex-1 flex justify-center pr-4" data-search>
            <div className="relative w-full max-w-3xl">
              <div className={cn(
                "relative group",
                "flex items-center bg-stone-800/50 rounded-full overflow-hidden transition-all duration-300",
                // Glow effect container
                "before:absolute before:inset-0 before:rounded-full before:opacity-0",
                "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
                "hover:before:opacity-100",
                isSearchFocused ? 'ring-2 ring-indigo-500/50 before:opacity-100' : ''
              )}>
                {/* Search Icon (Left) */}
                <div className="pl-4 pr-4">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    setIsSearchOpen(true);
                    setIsSearchFocused(true);
                  }}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search games..."
                  className={cn(
                    "w-full bg-transparent text-white px-4 py-2 outline-none relative z-10",
                    "placeholder:text-gray-400",
                    "transition-all duration-300"
                  )}
                  aria-label="Search games"
                />

                {/* Clear Search Button */}
                {searchQuery && (
                  <button
                    onClick={handleSearchClear}
                    className={cn(
                      "p-2 hover:bg-stone-700/50 relative z-10",
                      "transition-colors duration-300"
                    )}
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-white hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {(isSearchOpen && debouncedSearch.length >= 2) && (
                  <div className="absolute w-full">
                    <SearchResults
                      query={debouncedSearch}
                      onClose={() => setIsSearchOpen(false)}
                      isOpen={isSearchOpen}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Section - User Actions */}
          {/* <div className="flex items-center gap-4 text-md font-semibold text-gray-400 uppercase">
            <Link to="/login" className="hover:text-green-800">Login</Link>
            <Link to="/signup" className="hover:text-green-800">Sign Up</Link> */}
          <nav className="flex items-center gap-2 text-md font-semibold text-gray-400 uppercase">
            <Link
              to="/login"
              className={cn(
                "relative px-4 py-2 font-medium text-gray-400 rounded-full",
                "transition-all duration-300",
                "hover:text-white",
                // Glow effect
                "before:absolute before:inset-0 before:rounded-full before:opacity-10",
                "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
                "hover:before:opacity-100",
                // Active/hover state
                "hover:bg-stone-800/50"
              )}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={cn(
                "relative px-4 py-2 text-sm font-medium text-white rounded-full outline",
                "transition-all duration-300",
                "bg-blue-900 hover:bg-indigo-500",
                // Enhanced glow for primary button
                "before:absolute before:inset-0 before:rounded-full before:opacity-0",
                "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.3)_0%,transparent_70%)]",
                "hover:before:opacity-100",
                // Shadow effect
                "shadow-lg shadow-indigo-500/20"
              )}
            >
              Sign Up
            </Link>
            {/* User Profile */}
            {/* <motion.div
              whileHover={{ scale: 1.05 }}
              className="items-center gap-3 px-4 py-2 
                        bg-gradient-game rounded-full cursor-pointer"
            >
              <img
                src="https://assets.vogue.in/photos/5d7224d50ce95e0008696c55/2:3/w_2560%2Cc_limit/Joker.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </motion.div> */}
          </nav>
        </header>
      </div>
      {/* Main Layout Structure */}
      <div className="pt-16 flex">
        {/* Animated Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 top-16 bottom-0 bg-stone-950 z-40 border-stone-800"
            >
              <Sidebar isCollapsed={false} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
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