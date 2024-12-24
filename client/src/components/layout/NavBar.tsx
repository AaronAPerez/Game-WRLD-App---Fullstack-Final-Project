// import { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { 
//   Menu, 
//   Search, 
//   X
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../../hooks/useAuth';
// import { useSearch } from '../../hooks/useSearch';
// import { cn } from '../../utils/styles';
// import AvatarMenu from '../AvatarMenu';
// import { ChatNotifications } from '../chat/ChatNotifications';
// import Logo from '../Logo';
// import SearchResults from '../SearchResults';


// interface NavbarProps {
//   onMenuClick: () => void;
// }
// interface NavLinkProps {
//   path: string;
//   label: string;
//   icon: React.ElementType;
//   onClick?: () => void;
// }


// export const Navbar = ({ onMenuClick }: NavbarProps) => {
//   // const { user, logout } = useAuth();
//   // const navigate = useNavigate();
//   // const [showProfileMenu, setShowProfileMenu] = useState(false);
//   // const [searchQuery, setSearchQuery] = useState('');
//   const { isAuthenticated } = useAuth();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isHeaderVisible, setIsHeaderVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const location = useLocation();

//   const {
//     searchQuery,
//     debouncedSearch,
//     isSearchOpen,
//     setIsSearchOpen,
//     handleSearchChange,
//     handleSearchClear
//   } = useSearch();

//   // Handle header visibility on scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 50);
//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [lastScrollY]);

//   // Navigation Link Component



//   // const handleSearch = (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   if (searchQuery.trim()) {
//   //     navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//   //     setSearchQuery('');
//   //   }
//   // };

//   // const handleLogout = () => {
//   //   logout();
//   //   navigate('/login');
//   // };

//   return (
//     <nav className="fixed top-0 left-0 right-0 h-16 bg-stone-900/80 backdrop-blur-sm border-b border-stone-800 z-50">
//       <div className="container mx-auto px-4 h-full flex items-center justify-between"> {/* Header */}
//       <motion.header
//         initial={false}
//         animate={{
//           y: isHeaderVisible ? 0 : -80,
//           opacity: isHeaderVisible ? 1 : 0
//         }}
//         className={cn(
//           "fixed top-0 w-full z-50 transition-colors duration-200",
//           lastScrollY > 50 ? "bg-black/90 backdrop-blur-lg" : "bg-transparent",
//           "border-b border-slate-800/50"
//         )}
//       >
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             className="lg:hidden p-2 text-gray-400 hover:text-white"
//           >
//             {isMobileMenuOpen ? (
//               <X className="w-6 h-6" />
//             ) : (
//               <Menu className="w-6 h-6" />
//             )}
//           </button>

//           {/* Logo */}
//           <Link to="/" className="flex-shrink-0">
//             <Logo className="w-48" />
//           </Link>

//           {/* Search Bar */}
//           <div className="hidden md:flex flex-1 max-w-xl relative">
//             <div className={cn(
//               "w-full bg-stone-800/50 rounded-full overflow-hidden transition-all",
//               isSearchOpen && "ring-2 ring-indigo-500/50",
//             )}>
//               <div className="flex items-center px-4 py-1">
//                 <Search className="w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => handleSearchChange(e.target.value)}
//                   onFocus={() => setIsSearchOpen(true)}
//                   placeholder="Search games, friends, or posts..."
//                   className="w-full bg-transparent text-white px-3 focus:outline-none"
//                 />
//                 {searchQuery && (
//                   <button
//                     onClick={handleSearchClear}
//                     className="p-1 text-gray-400 hover:text-white"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>

//               {/* Search Results Dropdown */}
//               <AnimatePresence>
//                 {isSearchOpen && debouncedSearch.length >= 2 && (
//                   <SearchResults
//                     query={debouncedSearch}
//                     onClose={() => setIsSearchOpen(false)}
//                     isOpen={isSearchOpen}
//                   />
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Right Actions */}
//           <div className="flex items-center gap-2">
//             {isAuthenticated ? (
//               <>
//                 <ChatNotifications onOpenChat={function (): void {
//                   throw new Error('Function not implemented.');
//                 } } />
//                 <AvatarMenu />
//               </>
//             ) : (
//               <div className="flex gap-2">
//                 <Link
//                   to="/login"
//                   className="px-4 py-2 text-gray-400 hover:text-white"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className={cn(
//                     "relative px-4 py-2 text-sm font-medium text-white rounded-full",
//                     "bg-indigo-700/50 border border-stone-700/50",
//                     "hover:bg-indigo-600/50 transition-colors",
//                     "shadow-lg shadow-indigo-500/20"
//                   )}
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </motion.header>

        {/* Left Section */}
        {/* <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link to="/" className="text-2xl font-bold text-white">
            GameWRLD
          </Link>
        </div>

   
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl mx-4"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games, users, or posts..."
              className={cn(
                "w-full pl-10 pr-4 py-2 bg-stone-800 rounded-full",
                "text-white placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500"
              )}
            />
          </div>
        </form>

    
        <div className="flex items-center gap-4">
          {user ? (
         
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800">
                < className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800">
                <Bell className="w-6 h-6" />
              </button>

          
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-800"
                >
                  <img
                    src={user?.avatar || '/default-avatar.png'}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:inline text-white">
                    {user.username}
                  </span>
                </button>

                {showProfileMenu && (
                  <div 
                    className={cn(
                      "absolute right-0 mt-2 w-48 py-2",
                      "bg-stone-900 rounded-lg shadow-lg",
                      "border border-stone-800",
                      "z-50"
                    )}
                  >
                    <Link
                      to="/dashboard"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2",
                        "text-gray-400 hover:text-white hover:bg-stone-800"
                      )}
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2",
                        "text-gray-400 hover:text-white hover:bg-stone-800"
                      )}
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    
                    <Link
                      to="/settings"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2",
                        "text-gray-400 hover:text-white hover:bg-stone-800"
                      )}
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className={cn(
                        "w-full flex items-center gap-2 px-4 py-2",
                        "text-red-400 hover:text-red-300 hover:bg-stone-800"
                      )}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-400 hover:text-white px-4 py-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={cn(
                  "px-4 py-2 rounded-lg",
                  "bg-indigo-500 text-white",
                  "hover:bg-indigo-600 transition-colors"
                )}
              >
                Sign Up
              </Link>
            </div>
          )}
//         </div> */}
//       </div>
//     </nav>
//   );
// };