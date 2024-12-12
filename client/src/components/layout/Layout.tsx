import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu, Search, UserSearch, X } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { cn } from '../../utils/styles';
import Logo from '../Logo';
import { useSearch } from '../../hooks/useSearch';
import { useAuth } from '../../hooks/useAuth';
import SearchResults from '../SearchResults';
import { FriendRequestsNotifications } from '../FriendRequestsNotifications';
import { NotificationBell } from '../chat/NotificationBell';
import AvatarMenu from '../AvatarMenu';
import Sidebar from './SideBar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [, setIsMobile] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const {
    searchQuery,
    debouncedSearch,
    isSearchOpen,
    setIsSearchOpen,
    handleSearchChange,
    handleSearchClear
  } = useSearch();

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-stone-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-stone-950 z-50 flex items-center px-4 bg-stone-950/80 backdrop-blur-md">
        {/* Menu and Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "p-2 rounded-full transition-colors",
              "hover:bg-stone-800/50 group",
              "relative",
              "before:absolute before:inset-0 before:rounded-full",
              "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
              "before:opacity-0 hover:before:opacity-100"
            )}
          >
            <Menu className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:scale-110 transition-transform" />
          </button>

          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo className="w-40" />
          </Link>
        </div>

        {/* Search Section */}
        <div className="flex-1 flex justify-center max-w-3xl mx-auto px-4">
          <div className="relative w-full">
            <div className={cn(
              "relative group",
              "flex items-center bg-stone-800/50 rounded-full",
              "transition-all duration-300",
              isSearchFocused && "ring-2 ring-indigo-500/50"
            )}>
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
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
                className="w-full bg-transparent text-white pl-12 pr-4 py-2 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={handleSearchClear}
                  className="p-2 hover:bg-stone-700/50 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {isSearchOpen && debouncedSearch.length >= 2 && (
                <SearchResults
                  query={debouncedSearch}
                  onClose={() => setIsSearchOpen(false)}
                  isOpen={isSearchOpen}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Section - Auth Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <Link
                to="/search"
                className={cn(
                  "p-2 rounded-full transition-colors",
                  "hover:bg-stone-800/50 group",
                  "relative",
                  "before:absolute before:inset-0 before:rounded-full",
                  "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
                  "before:opacity-0 hover:before:opacity-100"
                )}
              >
                <UserSearch className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:scale-110 transition-transform" />
              </Link>
              <FriendRequestsNotifications />
              <NotificationBell />
              <AvatarMenu />
            </>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className={cn(
                  "px-4 py-2 text-sm font-medium text-gray-400",
                  "hover:text-white rounded-full transition-colors"
                )}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={cn(
                  "px-4 py-2 text-sm font-medium text-white",
                  "bg-blue-900 rounded-full",
                  "hover:bg-indigo-500 transition-colors"
                )}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16 flex">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <Sidebar isCollapsed={false} onClose={() => setIsSidebarOpen(false)} />
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main
          className={cn(
            "flex-1 transition-all duration-300",
            "min-h-screen bg-stone-950",
            isSidebarOpen ? 'ml-60' : 'ml-0'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;