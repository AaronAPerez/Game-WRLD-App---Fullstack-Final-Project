import { NavLink } from 'react-router-dom';
import { LucideIcon,
  Home, 
  Gamepad2, 
  Clock, 
  Trophy, 
  History,
  Calendar,
  TrendingUp,
  LayoutGrid,
  Flame,
  Star,
  BarChart
} from 'lucide-react';
import { cn } from '../../utils/styles';

// Interfaces for component props and data structures
interface SidebarProps {
  isCollapsed: boolean;
}

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
}

interface NavigationSection {
  title?: string;
  items: NavigationItem[];
}

// Navigation configuration Defines the structure of the sidebar navigation
const navigationSections: NavigationSection[] = [
  {
    items: [
      { icon: Home, label: 'Home', path: '/' },
      { icon: LayoutGrid, label: 'Browse', path: '/games' },
      { icon: History, label: 'Timeline', path: '/timeline' },
    ]
  },
  {
    title: 'Discover',
    items: [
      { icon: Flame, label: 'Trending', path: '/trending' },
      { icon: Clock, label: 'New Releases', path: '/new-releases' },
      { icon: BarChart, label: 'Top Rated', path: '/top-rated' },
      { icon: Trophy, label: 'Popular', path: '/popular' },
      { icon: Gamepad2, label: 'All Games', path: '/games' }
    ]
  },
  {
    title: 'Library',
    items: [
      { icon: Star, label: 'Favorites', path: '/favorites', badge: 0 },
      { icon: Calendar, label: 'Coming Soon', path: '/upcoming' }
    ]
  },
  {
    title: 'Personal',
    items: [
      { icon: TrendingUp, label: 'Dashboard', path: '/dashboard' },
    ]
  }
];

// Navigation Item Component Renders individual nav links w/ icons, labels
const NavItem = ({ 
  item, 
  isCollapsed 
}: { 
  item: NavigationItem; 
  isCollapsed: boolean 
}) => {
  const Icon = item.icon;
  
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
        isCollapsed ? "justify-center" : "",
        isActive 
          ? "bg-stone-800 text-white" 
          : "text-gray-400 hover:bg-stone-800 hover:text-white"
      )}
      title={isCollapsed ? item.label : undefined}
    >
      <div className="relative">
        <Icon className="w-5 h-5 min-w-[20px]" />
        {item.badge !== undefined && item.badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center bg-green-500 text-white rounded-full">
            {item.badge}
          </span>
        )}
      </div>
      {!isCollapsed && <span>{item.label}</span>}
    </NavLink>
  );
};

// Sidebar Component, Renders main navigation sidebar w/ collapsible functionality
const Sidebar = ({ isCollapsed }: SidebarProps) => {
  return (
    <div 
      className={cn(
        "h-full custom-scrollbar overflow-y-auto py-4 transition-all duration-300",
        isCollapsed ? "w-16" : "w-60"
      )}
      role="navigation"
    >
      <nav className="space-y-6 px-3">
        {navigationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1">
            {/* Section Title - Only shown when sidebar is expanded */}
            {section.title && !isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
            )}

            {/* Navigation Items */}
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
    </div>
  );
};

export default Sidebar;