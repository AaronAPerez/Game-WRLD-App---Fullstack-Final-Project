import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../utils/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useSearch } from '../../hooks/useSearch';
import Logo from '../Logo';

import AvatarMenu from '../user/AvatarMenu';
import { SearchResults } from '../search/SearchResults';
import { navigationConfig } from '../../navigationConfig';
import AnimatedSidebar from './sidebars/AnimatedSidebar';

interface NavLinkProps {
  path: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const {
    searchQuery,
    debouncedSearch,
    isSearchOpen,
    setIsSearchOpen,
    handleSearchChange,
    handleSearchClear
  } = useSearch();

  // Navigation Link Component
  const NavLink = ({ icon: Icon, label, path, onClick }: NavLinkProps) => {
    const isActive = location.pathname === path;

    return (
      <Link
        to={path}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
          "hover:bg-stone-800/50 group relative",
          isActive ? "bg-stone-800 text-white" : "text-gray-400"
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
    <div className="min-h-full min-w-full">
      {/* Header */}
      <motion.header
        className={cn(
          "fixed top-0 w-full z-50 transition-colors duration-200",
          "border-slate-800/50"
        )}
      >
        <div className="container w-full mx-auto px-2 h-16 flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          {/* Logo */}
          <Link to="/" className="flex-shrink-1">
            <Logo className="w-48" />
          </Link>
          {/* Search Bar */}
          <div className="rounded-full bg-gray-600/50 hidden md:flex flex-1 max-w-xl relative">
            <div className={cn(
              "w-full bg-stone-950/50 rounded-full overflow-hidden transition-all",
              isSearchOpen && "ring-2 ring-indigo-500/50",
            )}>
              <div className="flex items-center px-4 py-1">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search games, friends, or posts..."
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
          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <AvatarMenu />
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="auth/login"
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="auth/signup"
                  className={cn(
                    "w-full relative px-4 py-2 font-medium text-white rounded-full outline",
                    "transition-all duration-300",
                    "bg-indigo-900 hover:bg-indigo-500",
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
              </div>
            )}
          </div>
        </div>
      </motion.header>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)} />
            <nav className="relative w-64 h-full bg-stone-900 overflow-y-auto">
              <div className="p-4 space-y-4">
                {navigationConfig.main.map((item) => (
                  <NavLink
                    key={item.path}
                    {...item}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
                {isAuthenticated && navigationConfig.social.map((item) => (
                  <NavLink
                    key={item.path}
                    {...item}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Desktop Layout */}
      <div className="w-full pt-16 lg:grid lg:grid-cols-[80px,1fr]">
        {/* Desktop Sidebar */}
        <aside className="z-auto hidden lg:block h-[calc(100vh-3rem)] sticky top-16 overflow-y-auto border-r border-stone-600/50">
         <AnimatedSidebar/> 

          {/* <nav className="p-4 space-y-0">
            {navigationConfig.main.map((item) => (
              <NavLink key={item.path} {...item} />
            ))}
            {isAuthenticated && navigationConfig.social.map((item) => (
              <NavLink key={item.path} {...item} />
            ))}
          </nav> */}
        </aside>
        {/* Main Content */}
        <main className="rounded-xl border-slate-300">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;