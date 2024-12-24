import { NavLink } from 'react-router-dom';
import { LucideIcon, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../utils/styles';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { discoveryNavItems, mainNavItems, personalNavItems } from '../../navigation.config';


type NavItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

// Navigation Item Component
const NavItem = ({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => cn(
        "group relative flex items-center gap-3 px-3 py-2 rounded-lg",
        "transition-all duration-300",
        isCollapsed ? "justify-center w-12 mx-auto" : "w-full",
        "hover:bg-stone-800/50",
        "before:absolute before:inset-0 before:rounded-lg before:opacity-0",
        "before:transition-opacity",
        "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
        "hover:before:opacity-100",
        isActive ? [
          "bg-stone-800",
          "after:absolute after:inset-0 after:rounded-lg after:ring-1",
          "after:ring-indigo-500/50 after:transition-all",
          "text-white",
          "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.25)_0%,transparent_70%)]",
          "before:opacity-100"
        ] : "text-gray-400 hover:text-white"
      )}
      title={isCollapsed ? item.label : undefined}
    >
      <div className="relative z-10 flex items-center gap-3">
        <Icon className={cn(
          "w-5 h-5 min-w-[20px] transition-transform duration-300",
          "group-hover:scale-110",
        )} />
        {!isCollapsed && (
          <span className="transition-colors duration-300 whitespace-nowrap">
            {item.label}
          </span>
        )}
      </div>
    </NavLink>
  );
};

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 72 : 240,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "h-full custom-scrollbar overflow-y-auto py-4 transition-all duration-300",
        "bg-stone-950/95 backdrop-blur-sm fixed left-0 top-16 bottom-0 z-40 border-r border-stone-800"
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute right-2 top-0 rounded-full",
          "text-gray-400 hover:text-white hover:bg-stone-800",
          "transition-colors duration-300",
          "lg:flex hidden"
        )}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.div>
      </button>

      <nav className="space-y-6 px-2 mt-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* Discovery Section */}
        {!isCollapsed && (
          <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Discover
          </h3>
        )}
        <div className="space-y-1">
          {discoveryNavItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* Personal Section - Only shown when authenticated */}
        {isAuthenticated && (
          <>
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Personal
              </h3>
            )}
            <div className="space-y-1">
              {personalNavItems.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </>
        )}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;