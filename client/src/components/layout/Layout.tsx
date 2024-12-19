import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, Gamepad2, Calendar, BarChart,
  Users, MessageSquare, Bell, Menu, X,
  UserSearchIcon,
  Flame,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../Logo';
import AvatarMenu from '../AvatarMenu';
import { FriendRequestsNotifications } from '../friends/FriendRequestsNotifications';
import { ChatNotifications } from '../chat/ChatNotifications';
import { ChatPanel } from '../chat/ChatPanel';
import { useQuery } from '@tanstack/react-query';
import {
  Gamepad,
  Star,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/styles';
import { useDebounce } from '../../hooks/useDebounce';
import { SearchResult, searchService } from '../../services/searchService';
import { useSearch } from '../../hooks/useSearch';
import SearchResults from '../SearchResults';
import SearchBar from '../shared/SearchBar';

// Navigation items configuration
const mainNavItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Gamepad2, label: 'Games', path: '/games' },
  { icon: Calendar, label: 'New Releases', path: '/new-releases' },
  { icon: Flame, label: 'Trending', path: '/trending' },
  { icon: BarChart, label: 'Top Rated', path: '/top-rated' }
];

const socialNavItems = [
  // { icon: MessageSquare, label: 'Chat', path: '/chat' },
  { icon: Users, label: 'Friends', path: '/friends' },
  { icon: UserSearchIcon, label: 'Connect', path: '/search' },
  { icon: BookOpen, label: 'Blog', path: '/blog' }
];

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const {
    searchQuery,
    debouncedSearch,
    isSearchOpen,
    setIsSearchOpen,
    handleSearchChange,
    handleSearchClear
  } = useSearch();





  const { data: results, isLoading } = useQuery({
    queryKey: ['universalSearch', debouncedQuery],
    queryFn: () => searchService.universalSearch(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused || !results?.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsFocused(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, results, selectedIndex]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setIsFocused(false);
    setQuery('');
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'game': return Gamepad;
      case 'user': return Users;
      case 'post': return BookOpen;
      default: return Search;
    }
  };


  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation Link Component
  const NavLink = ({ icon: Icon, label, path }: {
    icon: typeof Home;
    label: string;
    path: string;
  }) => {
    const isActive = location.pathname === path;


    return (
      <Link
        to={path}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
          "hover:bg-stone-800/50",
          "group relative",
          isActive && "bg-stone-800 text-white",
          !isActive && "text-gray-400"
        )}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{label}</span>
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute left-0 w-1 h-full bg-indigo-500 rounded-full"
          />
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-lg border-b border-stone-800/50">
        <div className="px-4 h-16 flex items-center justify-between gap-4">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo className="w-40" />
          </Link>



          {/* Search Bar */}
          {/* <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>  */}

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <div className={cn(
              "w-full bg-stone-800/50 rounded-full overflow-hidden transition-all",
              isSearchOpen && "ring-2 ring-indigo-500/50",
            )}>
              <div className="flex items-center px-4 py-1">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search games..."
                  className="w-full bg-transparent text-white px-3 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={handleSearchClear}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
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




          {/* Right User Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Friend Request Notifications */}
                <FriendRequestsNotifications />

                {/* Chat Notifications */}
                <ChatNotifications onOpenChat={() => setIsChatOpen(true)} />


                {/* Avatar Menu */}
                <AvatarMenu />
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium text-white rounded-full outline",
                    "transition-all duration-300",
                    "bg-indigo-700/50 text-white whitespace-nowrap",
                    "border border-stone-700/50",
                    // Enhanced glow for primary button
                    "before:absolute before:inset-0 before:rounded-full before:opacity-0",
                    "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.3)_0%,transparent_70%)]",
                    "hover:before:opacity-100",
                    // Shadow effect
                    "shadow-lg shadow-indigo-500/20")}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="pt-16 lg:grid lg:grid-cols-[240px,1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block h-[calc(100vh-4rem)] sticky top-16">
          <AnimatePresence mode="wait">
            {(isSidebarOpen || isMobileMenuOpen) && (
              <motion.aside
                initial={{ x: -240 }}
                animate={{ x: 0 }}
                exit={{ x: -240 }}
                className={cn(
                  "fixed lg:sticky top-16 bottom-0 left-0",
                  "w-60 z-40 backdrop-blur-sm",
                  "lg:block border-r border-stone-800/50",
                  isMobileMenuOpen ? "block" : "hidden"
                )}
              >
                <nav className="h-full p-4 space-y-6">
                  {/* Main Navigation */}
                  <div className="space-y-1">
                    {mainNavItems.map(({ icon: Icon, label, path }) => (
                      <NavLink
                        key={path}
                        icon={Icon}
                        label={label}
                        path={path}
                      />
                    ))}
                  </div>

                  {/* Social Navigation */}
                  {isAuthenticated && (
                    <div className="space-y-1">
                      <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Social
                      </div>
                      {socialNavItems.map(({ icon: Icon, label, path }) => (
                        <NavLink
                          key={path}
                          icon={Icon}
                          label={label}
                          path={path}
                        />
                      ))}
                    </div>
                  )}
                </nav>
              </motion.aside>
            )}
          </AnimatePresence>
        </aside>

        {/* Main Content */}
        <main className="min-h-screen relative">
          <Outlet />
          {/* Chat Panel */}
          {isAuthenticated && (
            <AnimatePresence>
              {isChatOpen && (
                <ChatPanel onClose={() => setIsChatOpen(false)} />
              )}
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  )
}


export default Layout;