import {
  Home,
  Search as UserSearchIcon,
  Gamepad2,
  Flame,
  Calendar,
  BarChart,
  Users,
  MessageSquare,
  BookOpen
} from 'lucide-react';

interface NavigationItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface NavigationConfig {
  main: NavigationItem[];
  social: NavigationItem[];
}

export const navigationConfig: NavigationConfig = {
  main: [
    { icon: Home, label: 'Home', path: '/' },
    { icon: UserSearchIcon, label: 'Connect', path: '/search' },
    { icon: Gamepad2, label: 'Games', path: '/games' },
    { icon: Flame, label: 'Trending', path: '/trending' },
    { icon: Calendar, label: 'New Releases', path: '/new-releases' },
    { icon: BarChart, label: 'Top Rated', path: '/top-rated' }
  ],
  social: [
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Users, label: 'Friends', path: '/friends' },
    { icon: BookOpen, label: 'Blog', path: '/blog' }
  ]
};
// import {
//   Home,
//   // Gamepad2,
//   Flame,
//   Calendar,
//   Trophy,
//   Users,
//   MessageSquare,
//   BookOpen,
//   LayoutDashboard,
//   MessagesSquare,
//   UserSearchIcon
// } from 'lucide-react';

// // Main navigation items (public)
// export const mainNavItems = [
//   { icon: Home, label: 'Home', path: '/' },
//   { icon: UserSearchIcon, label: 'Users', path: '/search' },
//   // { icon: Gamepad2, label: 'Browse', path: '/games' },
// ];

// // Discovery navigation items
// export const discoveryNavItems = [
//   { icon: Flame, label: 'Trending', path: '/trending' },
//   { icon: Trophy, label: 'Popular', path: '/popular' },
//   { icon: Calendar, label: 'Upcoming', path: '/upcoming' },
// ];

// // Personal navigation items (requires auth)
// export const personalNavItems = [
//   { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
//   { icon: BookOpen, label: 'Blog', path: '/blog' },
//   { icon: Users, label: 'Friends', path: '/friends' },
//   { icon: Users, label: 'Social', path: '/social' },
//   { icon: MessagesSquare, label: 'Chat Room', path: '/chat' },
//   { icon: MessageSquare, label: 'Messages', path: '/messages' },
// ];

// // Mobile menu items
// export const mobileMenuItems = [
//   ...mainNavItems,
//   ...discoveryNavItems,
//   ...personalNavItems
// ];

