import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react';
import { cn } from '../../utils/styles';
import Logo from '../Logo';
import AvatarMenu from '../AvatarMenu';
import SearchResults from '../SearchResults';
import { useSearch } from '../../hooks/useSearch';
import { navigationConfig } from '../../navigation.config';
import { ChatNotifications } from '../chat/ChatNotifications';
import { useAuth } from '../../hooks/useAuth';
import { ChatPanel } from '../chat/ChatPanel';


interface NavLinkProps {
  path: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const {
    searchQuery,
    debouncedSearch,
    isSearchOpen,
    setIsSearchOpen,
    handleSearchChange,
    handleSearchClear
  } = useSearch();

  // Handle header visibility on scroll
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY;
  //     setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 50);
  //     setLastScrollY(currentScrollY);
  //   };

  //   window.addEventListener('scroll', handleScroll, { passive: true });
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [lastScrollY]);

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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <motion.header
        initial={false}
        animate={{
          y: isHeaderVisible ? 0 : -80,
          opacity: isHeaderVisible ? 1 : 0
        }}
        className={cn(
          "fixed top-0 w-full z-50 transition-colors duration-200",
          lastScrollY > 50 ? "bg-black/90 backdrop-blur-lg" : "bg-transparent",
          "border-b border-slate-800/50"
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
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
          <Link to="/" className="flex-shrink-0">
            <Logo className="w-48" />
          </Link>

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

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>

{/* <div className="h-[calc(100vh-4rem)]">
      <ChatPanel />
    </div> */}

                <ChatNotifications onOpenChat={function (): void {
                  throw new Error('Function not implemented.');
                } } />
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
                    "relative px-4 py-2 text-sm font-medium text-white rounded-full",
                    "bg-indigo-700/50 border border-stone-700/50",
                    "hover:bg-indigo-600/50 transition-colors",
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
      <div className="pt-16 lg:grid lg:grid-cols-[240px,1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto border-r border-stone-800/50">
          <nav className="p-4 space-y-0">
            {navigationConfig.main.map((item) => (
              <NavLink key={item.path} {...item} />
            ))}
            {isAuthenticated && navigationConfig.social.map((item) => (
              <NavLink key={item.path} {...item} />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-h-screen bg-black">
          <div className="container mx-auto p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

// import { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import { Menu, Sidebar } from 'lucide-react';
// import { cn } from '../../utils/styles';
// import { Navbar } from '../NavBar';



// export default function Layout() {
//   const [] = useState(true);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   return (
//     <div className="min-h-screen bg-stone-950 text-gray-100">
//       <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
//       <div className="flex">
//         {/* <Sidebar /> */}
//         <button
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className={cn(
//                 "relative p-2 rounded-full transition-all duration-300",
//                 "hover:bg-stone-800/50 group",
//                 // Glow effect
//                 "before:absolute before:inset-0 before:rounded-full before:opacity-0",
//                 "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
//                 "hover:before:opacity-100"
//               )}
//               title="Side Menu"
//               aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}>
//               <Menu className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:scale-110 transition-transform" />
//             </button>
        
        
//         <main className={cn(
//           "flex-1 transition-all duration-300",
//           isSidebarOpen ? "ml-64" : "ml-0"
//         )}>
//           <div className="container mx-auto pt-18 py-8">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

