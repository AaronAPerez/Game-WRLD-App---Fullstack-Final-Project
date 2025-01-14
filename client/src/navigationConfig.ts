import {
  Home,
  Gamepad2,
  Flame,
  Calendar,
  BarChart,
  Users,
  MessageSquare,
  BookOpen,
  Settings
} from 'lucide-react';

interface NavigationItem {
  icon: React.ElementType;
  label: string;
  path: string;
  requiresAuth?: boolean;
}

interface NavigationConfig {
  main: NavigationItem[];
  social: NavigationItem[];
  settings: NavigationItem[];
}

export const navigationConfig: NavigationConfig = {
  main: [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Gamepad2, label: 'Games', path: '/games' },
    { icon: Flame, label: 'Trending', path: '/trending' },
    { icon: Calendar, label: 'New Releases', path: '/new-releases' },
    { icon: BarChart, label: 'Top Rated', path: '/top-rated' }
  ],
  social: [
    { icon: MessageSquare, label: 'Messages', path: '/messages', requiresAuth: true },
    { icon: Users, label: 'Friends', path: '/friends', requiresAuth: true },
    { icon: BookOpen, label: 'Blog', path: '/blog' }
  ],
  settings: [
    { icon: Settings, label: 'Settings', path: '/settings', requiresAuth: true }
  ]
};