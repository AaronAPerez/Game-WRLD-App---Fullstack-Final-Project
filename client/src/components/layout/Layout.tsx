import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, UserSearchIcon, X } from 'lucide-react';
import Sidebar from './SideBar';
import { Link, Outlet } from 'react-router-dom';
import { cn } from '../../utils/styles';
import Logo from '../Logo';
import { useSearch } from '../../hooks/useSearch';
import { useAuth } from '../../hooks/useAuth';
import SearchResults from '../SearchResults';
import { FriendRequestsNotifications } from '../FriendRequestsNotifications';
import { NotificationBell } from '../chat/Notification';
import AvatarMenu from '../AvatarMenu';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { NotificationIndicator } from '../NotificationIndicator';


const Layout = () => {
  // State Management
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [, setIsMobile] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  // Define types for navigation items



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
    const handleResize = (): void => {
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
                "relative rounded-full transition-all duration-300",
                "hover:bg-stone-800/50 group",
                "before:absolute before:inset-0 before:rounded-full before:opacity-0",
                "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
                "hover:before:opacity-100"
              )}
              title="Side Menu"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}>
              <Menu className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:scale-110 transition-transform" />
           
            </button>

          
            <Link to="/" aria-label="Home" className="hover:opacity-90 transition-opacity">
            <Logo />
            </Link>
          </div>

          {/* Search Section */}
          <div className="flex-1 flex justify-center pr-4" data-search>
            <div className="relative w-full max-w-2xl px-4">
              <div className={cn(
                "relative group",
                "flex items-center bg-stone-800/50 rounded-full overflow-hidden transition-all duration-300",
                "before:absolute before:inset-0 before:rounded-full before:opacity-0",
                "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
                "hover:before:opacity-100",
                isSearchFocused ? 'ring-2 ring-indigo-500/50 before:opacity-100' : ''
              )}>
                <div className="pl-4 pr-4">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>

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

          {/* Right Section - Auth Actions */}
          <div className="flex items-center gap-4">
          
        
 

            {/* <FriendRequestsNotifications /> */}

             {/* <NotificationIndicator />  */}

          
            {isAuthenticated ? (
              <AvatarMenu />
            ) : (
              <nav className="flex items-center gap-2 text-md font-semibold text-gray-400 uppercase">
                <Link
                  to="/login"
                  className={cn(
                    "relative px-4 py-2 font-medium text-gray-400 rounded-full",
                    "transition-all duration-300",
                    "hover:text-white",
                    "before:absolute before:inset-0 before:rounded-full before:opacity-10",
                    "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
                    "hover:before:opacity-100",
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
                    "bg-indego-900 hover:bg-indigo-500",
                    "before:absolute before:inset-0 before:rounded-full before:opacity-0",
                    "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.3)_0%,transparent_70%)]",
                    "hover:before:opacity-100",
                    "shadow-lg shadow-indigo-500/20"
                  )}
                >
                  Sign Up
                </Link>
              </nav>
            )}
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
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 top-16 bottom-0 bg-stone-950 z-40 border-r border-stone-800"
            >
              <Sidebar/>
              {/* <Sidebar isCollapsed={false} /> */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main
          className={cn(
            "flex flex-1 transition-all duration-300 custom-scrollbar",
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
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Link, Outlet, useLocation } from 'react-router-dom';
// import Logo from '../Logo';
// import { useAuth } from '../../hooks/useAuth';
// import {
//     Home,
//     Search,
//     Gamepad2,
//     Flame,
//     Calendar,
//     BarChart,
//     Users,
//     MessageSquare,
//     BookOpen,
//     Menu,
//     X,
//     Bell,
//     UserSearchIcon
// } from 'lucide-react';
// import { useSearch } from '../../hooks/useSearch';
// import SearchResults from '../SearchResults';
// import AvatarMenu from '../AvatarMenu';
// import { cn } from '../../utils/styles';


// // Navigation items with required properties
// const navItems = [
//     { icon: Home, label: 'Home', path: '/' },
//     { icon: UserSearchIcon, label: 'Connect', path: '/search' },
//     { icon: Gamepad2, label: 'Games', path: '/games' },
//     { icon: Flame, label: 'Trending', path: '/trending' },
//     { icon: Calendar, label: 'New Releases', path: '/new-releases' },
//     { icon: BarChart, label: 'Top Rated', path: '/top-rated' }
// ];

// const socialItems = [
//     { icon: MessageSquare, label: 'Messages', path: '/messages' },
//     { icon: Users, label: 'Friends', path: '/friends' },
//     { icon: BookOpen, label: 'Blog', path: '/blog' }
// ];

// const Layout =() => {
//     const { isAuthenticated } = useAuth();
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [isScrolled, setIsScrolled] = useState(false);
//     const location = useLocation();
//     const {
//         searchQuery,
//         debouncedSearch,
//         isSearchOpen,
//         setIsSearchOpen,
//         handleSearchChange,
//         handleSearchClear
//     } = useSearch();

//     // Handle scroll behavior
//     useEffect(() => {
//         const handleScroll = () => {
//             setIsScrolled(window.scrollY > 0);
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     // Close mobile menu when route changes
//     useEffect(() => {
//         setIsMobileMenuOpen(false);
//     }, [location.pathname]);

//     // Navigation Link Component
//     const NavLink = ({ icon: Icon, label, path }: {
//         icon: typeof Home;
//         label: string;
//         path: string;
//     }) => {
//         const isActive = location.pathname === path;

//         return (
//             <Link
//                 to={path}
//                 className={cn(
//                     "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
//                     "hover:bg-stone-800/50",
//                     "group relative",
//                     isActive && "bg-stone-800 text-white",
//                     !isActive && "text-gray-400"
//                 )}
//             >
//                 <Icon className="w-5 h-5" />
//                 <span className="text-sm font-medium">{label}</span>
//                 {isActive && (
//                     <motion.div
//                         layoutId="activeNav"
//                         className="absolute left-0 w-1 h-full bg-indigo-500 rounded-full"
//                     />
//                 )}
//             </Link>
//         );
//     };

//     return (
//       <>
//         {/* Header */}
//          <div className="">
//             <header className={cn(
//                 "fixed top-0 w-full z-50 transition-all duration-200",
//                 isScrolled ? "bg-black/90 backdrop-blur-lg" : "bg-transparent",
//                 "border-b border-slate-800/50"
//             )}>
//                 <div className="px-4 h-16 flex items-center justify-between gap-4">
//                     {/* Mobile Menu Button */}
//                     <button
//                         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                         className="lg:hidden p-2 text-gray-400 hover:text-white"
//                     >
//                         {isMobileMenuOpen ? (
//                             <X className="w-6 h-6" />
//                         ) : (
//                             <Menu className="w-6 h-6" />
//                         )}
//                     </button>

//                     {/* Logo */}
//                     <Link to="/" className="flex-shrink-0">
//                         <Logo className="w-48" />
//                     </Link>

//                     {/* Search Bar */}
//                     <div className="hidden md:flex flex-1 max-w-xl relative">
//                         <div className={cn(
//                             "w-full bg-stone-800/50 rounded-full overflow-hidden transition-all",
//                             isSearchOpen && "ring-2 ring-indigo-500/50",
//                         )}>
//                             <div className="flex items-center px-4 py-1">
//                                 <Search className="w-5 h-5 text-gray-400" />
//                                 <input
//                                     type="text"
//                                     value={searchQuery}
//                                     onChange={(e) => handleSearchChange(e.target.value)}
//                                     onFocus={() => setIsSearchOpen(true)}
//                                     placeholder="Search games, friends, or posts..."
//                                     className="w-full bg-transparent text-white px-3 focus:outline-none"
//                                 />
//                                 {searchQuery && (
//                                     <button
//                                         onClick={handleSearchClear}
//                                         className="p-1 text-gray-400 hover:text-white"
//                                     >
//                                         <X className="w-4 h-4" />
//                                     </button>
//                                 )}
//                             </div>

//                             {/* Search Results Dropdown */}
//                             <AnimatePresence>
//                                 {isSearchOpen && debouncedSearch.length >= 2 && (
//                                     <SearchResults
//                                         query={debouncedSearch}
//                                         onClose={() => setIsSearchOpen(false)}
//                                         isOpen={isSearchOpen}
//                                     />
//                                 )}
//                             </AnimatePresence>
//                         </div>
//                     </div>

//                     {/* Right Actions */}
//                     <div className="flex items-center gap-2">
//                         {isAuthenticated ? (
//                             <>
//                                 <button className="p-2 text-gray-400 hover:text-white">
//                                     <Bell className="w-6 h-6" />
//                                 </button>
//                                 <AvatarMenu />
//                             </>
//                         ) : (
//                             <div className="flex gap-2">
//                                 <Link
//                                     to="/login"
//                                     className="px-4 py-2 text-gray-400 hover:text-white"
//                                 >
//                                     Login
//                                 </Link>
//                                 <Link
//                                     to="/signup"
//                                     className={cn(
//                                         "relative px-4 py-2 text-sm font-medium text-white rounded-full outline",
//                                         "transition-all duration-300",
//                                         "bg-indigo-700/50 text-white whitespace-nowrap",
//                                         "border border-stone-700/50",
//                                         // Enhanced glow for primary button
//                                         "before:absolute before:inset-0 before:rounded-full before:opacity-0",
//                                         "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.3)_0%,transparent_70%)]",
//                                         "hover:before:opacity-100",
//                                         // Shadow effect
//                                         "shadow-lg shadow-indigo-500/20")}
//                                 >
//                                     Sign Up
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </header>

//             {/* Mobile Menu */}
//             <AnimatePresence>
//                 {isMobileMenuOpen && (
//                     <motion.div
//                         initial={{ opacity: 0, x: -300 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: -300 }}
//                         className="fixed inset-0 z-40 lg:hidden"
//                     >
//                         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
//                         <nav className="relative w-64 h-full bg-stone-900 overflow-y-auto">
//                             <div className="p-4 space-y-4">
//                                 {navItems.map((item) => (
//                                     <NavLink key={item.path} {...item} />
//                                 ))}
//                                 {isAuthenticated && (
//                                     <div className="pt-4 mt-4 border-t border-stone-800">
//                                         {socialItems.map((item) => (
//                                             <NavLink key={item.path} {...item} />
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         </nav>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Desktop Layout */}
//             <div className="pt-16 lg:grid lg:grid-cols-[240px,1fr]">
//                 {/* Desktop Sidebar */}
//                 <aside className="hidden lg:block h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto border-r border-stone-800/50">
//                     <nav className="p-4 space-y-0">
//                         {navItems.map((item) => (
//                             <NavLink key={item.path} {...item} />
//                         ))}
//                         {isAuthenticated && (
//                             <div className="pt-4 mt-4 border-t border-stone-800 space-y-2">
//                                 {socialItems.map((item) => (
//                                     <NavLink key={item.path} {...item} />
//                                 ))}
//                             </div>
//                         )}
//                     </nav>
//                 </aside>

//                 {/* Main Content */}
//                 <main className="min-h-screen">
//                     <Outlet />
//                 </main>
//             </div>
//           </div>
//           </>
//     );
// }

// export default Layout;
