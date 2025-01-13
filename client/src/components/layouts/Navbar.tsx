// src/components/layout/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGameSearch } from '../../hooks/useGameSearch';
import { SearchResults } from '../search/SearchResults';
import { cn } from '../../utils/styles';
import Logo from '../Logo';

export const Navbar = () => {
  const { user } = useAuth();
  const { 
    searchQuery, 
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    isSearching,
    searchResults,
    handleSearchSelect,
  } = useGameSearch();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo variant="small" className="h-8" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/games"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Browse
            </Link>
            <Link
              to="/blog"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/community"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Community
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative" data-search-container>
            <div className="relative">
              <Search 
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                  isSearchOpen ? "text-purple-500" : "text-gray-400"
                )}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search games..."
                className={cn(
                  "w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg",
                  "border border-gray-700 focus:border-purple-500",
                  "focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50",
                  "transition-all duration-200"
                )}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <SearchResults
              results={searchResults}
              isVisible={isSearchOpen && searchQuery.length > 2}
              isSearching={isSearching}
              onSelect={handleSearchSelect}
            />
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button className="flex items-center gap-2 p-1.5 text-sm text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block">{user.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <Link
                to="/games"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                to="/blog"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/community"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;