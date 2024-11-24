import { NavLink } from 'react-router-dom';
import {
  LucideIcon,
  Home,
  Gamepad2,
  Clock,
  Trophy,
  History,
  LayoutGrid,
  Flame,
  BarChart,
} from 'lucide-react';
import { cn } from '../../utils/styles';
// import { useAuth } from '../../hooks/useAuth';

// Navigation Item Component with glow effect
const NavItem = ({
  item,
  isCollapsed
}: {
  item: { icon: LucideIcon; label: string; path: string; };
  isCollapsed: boolean;
}) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => cn(
        "group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300",
        isCollapsed ? "justify-center" : "",
        // Base styles
        "hover:bg-stone-800/50",
        // Glow effect on hover using pseudo-element
        "before:absolute before:inset-0 before:rounded-lg before:opacity-0 before:transition-opacity",
        "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)]",
        "hover:before:opacity-100",
        // Active state
        isActive ? [
          "bg-stone-800",
          "after:absolute after:inset-0 after:rounded-lg after:ring-1",
          "after:ring-indigo-500/50 after:transition-all",
          "text-white",
          // Stronger glow for active state
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


const Sidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
  // const { isAuthenticated } = useAuth();

  // Navigation sections configuration
  const navigationSections = [
    {
      items: [
        { icon: Home, label: 'Home', path: '/' },
        { icon: LayoutGrid, label: 'Browse', path: '/homepage' },
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
    // Show these sections only for authenticated users
    // (isAuthenticated ? [
    //   {
    //     title: 'Your Library',
    //     items: [
    //       { icon: Heart, label: 'Favorites', path: '/favorites' },
    //       { icon: BookMarked, label: 'Wishlist', path: '/wishlist' },
    //       { icon: Star, label: 'Rated Games', path: '/rated' },
    //       { icon: Calendar, label: 'Coming Soon', path: '/upcoming' }
    //     ]
    //   },
    //   {
    //     title: 'Social',
    //     items: [
    //       { icon: Users, label: 'Friends', path: '/friends' },
    //       { icon: MessageCircle, label: 'Messages', path: '/messages' },
    //     ]
    //   },
    //   {
    //     title: 'Account',
    //     items: [
    //       { icon: Settings, label: 'Settings', path: '/settings' },
    //       { icon: TrendingUp, label: 'Dashboard', path: '/dashboard' },
    //     ]
    //   }
    // ] : [])
  ];

  return (
    <div
      className={cn(
        "h-full custom-scrollbar overflow-y-auto py-4 transition-all duration-300",
        isCollapsed ? "w-16" : "w-30"
      )}
      role="navigation"
    >
      <nav className="space-y-6 px-2">
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