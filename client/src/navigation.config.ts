import {
  Home,
  Gamepad2,
  Flame,
  Calendar,
  Trophy,
  Users,
  MessageSquare,
  BookOpen,
  LayoutDashboard,
  MessagesSquare
} from 'lucide-react';

// Main navigation items (public)
export const mainNavItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Gamepad2, label: 'Browse', path: '/games' },
];

// Discovery navigation items
export const discoveryNavItems = [
  { icon: Flame, label: 'Trending', path: '/trending' },
  { icon: Trophy, label: 'Popular', path: '/popular' },
  { icon: Calendar, label: 'Upcoming', path: '/upcoming' },
];

// Personal navigation items (requires auth)
export const personalNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Blog', path: '/blog' },
  { icon: Users, label: 'Friends', path: '/friends' },
  { icon: Users, label: 'Social', path: '/social' },
  { icon: MessagesSquare, label: 'Chat Room', path: '/chat' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
];

// Mobile menu items
export const mobileMenuItems = [
  ...mainNavItems,
  ...discoveryNavItems,
  ...personalNavItems
];