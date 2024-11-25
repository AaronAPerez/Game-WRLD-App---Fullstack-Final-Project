import { NavLink, useLocation } from 'react-router-dom';
import {
  LucideIcon,
  Home,
  Gamepad2,
  Clock,
  Trophy,
  Flame,
  BarChart,
  Calendar,
  Search,
  Library
} from 'lucide-react';
import { cn } from '../../utils/styles';

// Define types for navigation items
type NavItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

// Navigation Item Component
const NavItem = ({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) => {
  const location = useLocation();
  const Icon = item.icon;
  
  // Check if the current path matches the nav item path
  const isActive = location.pathname === item.path;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => cn(
        // Base styles
        "group relative flex items-center gap-3 px-3 py-2 rounded-lg",
        "transition-all duration-300",
        isCollapsed ? "justify-center" : "",
        
        // Hover styles
        "hover:bg-stone-800/50",
        
        // Glow effect
        "before:absolute before:inset-0 before:rounded-lg before:opacity-0",
        "before:transition-opacity",
        "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
        "hover:before:opacity-100",
        
        // Active state
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
          <span className="transition-colors duration-300">
            {item.label}
          </span>
        )}
      </div>
    </NavLink>
  );
};

// Main Sidebar Component
const Sidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
  // Navigation sections with proper routing
  const navigationSections: NavSection[] = [
    {
      items: [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Browse', path: '/games' },
        // { icon: Library, label: 'My Library', path: '/library' },
      ]
    },
    {
      title: 'Discover',
      items: [
        // Each path corresponds to a specific page component
        { 
          icon: Flame, 
          label: 'Trending', 
          path: '/trending'
        },
        { 
          icon: Clock, 
          label: 'New Releases', 
          path: '/new-releases'
        },
        { 
          icon: BarChart, 
          label: 'Top Rated', 
          path: '/top-rated'
        },
        { 
          icon: Trophy, 
          label: 'Popular', 
          path: '/popular'
        },
        { 
          icon: Gamepad2, 
          label: 'All Games', 
          path: '/games'
        },
        {
          icon: Calendar,
          label: 'Upcoming',
          path: '/upcoming'
        }
      ]
    },
  ];

  return (
    <aside
      className={cn(
        "h-full custom-scrollbar overflow-y-auto py-4 transition-all duration-300",
        "bg-stone-950/95 backdrop-blur-sm",
        isCollapsed ? "w-16" : "w-60"
      )}
      role="navigation"
    >
      <nav className="space-y-6 px-2">
        {navigationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1">
            {section.title && !isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}

            {section.items.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;