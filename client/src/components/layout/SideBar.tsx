import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Gamepad2,
  Clock,
  Trophy,
  Flame,
  BarChart,
  Calendar,
  Users,
  MessageSquare,
  LayoutDashboard,
  BookOpen,
  MessagesSquare,
  ChevronLeft,
  LucideIcon
} from 'lucide-react';
import { cn } from '../../utils/styles';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  requiresAuth?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
  requiresAuth?: boolean;
}

interface SidebarProps {
  isCollapsed: boolean;
  onClose: () => void;
}

const navigationSections: NavSection[] = [
  {
    items: [
      { icon: Home, label: 'Home', path: '/' },
      { icon: Gamepad2, label: 'Browse', path: '/games' },
    ]
  },
  {
    title: 'Discover',
    items: [
      { icon: Flame, label: 'Trending', path: '/trending' },
      { icon: Clock, label: 'New Releases', path: '/new-releases' },
      { icon: BarChart, label: 'Top Rated', path: '/top-rated' },
      { icon: Trophy, label: 'Popular', path: '/popular' },
      { icon: Calendar, label: 'Upcoming', path: '/upcoming' }
    ]
  },
  {
    title: 'Social',
    requiresAuth: true,
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', requiresAuth: true },
      { icon: BookOpen, label: 'Blog', path: '/blog', requiresAuth: true },
      { icon: Users, label: 'Friends', path: '/friends', requiresAuth: true },
      { icon: MessagesSquare, label: 'Chat Room', path: '/chat', requiresAuth: true },
      { icon: MessageSquare, label: 'Messages', path: '/messages', requiresAuth: true },
    ]
  }
];

const Sidebar = ({ isCollapsed, onClose }: SidebarProps) => {
  const { isAuthenticated } = useAuth();

  const renderNavItem = useCallback((item: NavItem) => {
    if (item.requiresAuth && !isAuthenticated) return null;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) => cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg",
          "transition-colors relative group",
          isCollapsed ? "justify-center" : "",
          isActive 
            ? "bg-stone-800 text-white" 
            : "text-gray-400 hover:text-white hover:bg-stone-800/50"
        )}
      >
        <item.icon className={cn(
          "w-5 h-5",
          "transition-transform group-hover:scale-110"
        )} />
        
        {!isCollapsed && (
          <span className="text-sm">{item.label}</span>
        )}

        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-stone-800 rounded text-sm text-white opacity-0 group-hover:opacity-100 pointer-events-none z-50">
            {item.label}
          </div>
        )}
      </NavLink>
    );
  }, [isCollapsed, isAuthenticated]);

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 240, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "fixed left-0 top-16 bottom-0",
        "bg-stone-950/95 backdrop-blur-sm",
        "border-r border-stone-800",
        "z-40 overflow-hidden"
      )}
    >
      <nav className="h-full px-2 py-4 overflow-y-auto">
        {navigationSections.map((section, index) => {
          if (section.requiresAuth && !isAuthenticated) return null;

          return (
            <div key={index} className="mb-6">
              {section.title && !isCollapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map(renderNavItem)}
              </div>
            </div>
          );
        })}
      </nav>

      <button
        onClick={onClose}
        className={cn(
          "absolute right-2 top-2",
          "p-2 rounded-full",
          "text-gray-400 hover:text-white",
          "hover:bg-stone-800",
          "transition-colors"
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </motion.aside>
  );
};

export default Sidebar;