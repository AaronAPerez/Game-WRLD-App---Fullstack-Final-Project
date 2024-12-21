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
      { icon: UserSearchIcon, label: 'Users', path: '/search' },
      { icon: Gamepad2, label: 'Games', path: '/games' },
      { icon: Flame, label: 'Trending', path: '/trending' },
      // { icon: Calendar, label: 'New Releases', path: '/new-releases' },
      // { icon: BarChart, label: 'Top Rated', path: '/top-rated' }
    ],
    social: [
      { icon: MessageSquare, label: 'Messages', path: '/messages' },
      { icon: Users, label: 'Friends', path: '/friends' },
      { icon: BookOpen, label: 'Blog', path: '/blog' }
    ]
  };