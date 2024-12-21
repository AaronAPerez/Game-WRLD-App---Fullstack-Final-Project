import {
    Home,
    Search as UserSearchIcon,
    Gamepad2,
    Flame,
    Calendar,
    BarChart,
    Users,
    MessageSquare,
<<<<<<< HEAD
    BookOpen
=======
    BookOpen,
    Clock
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17
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
<<<<<<< HEAD
      { icon: UserSearchIcon, label: 'Users', path: '/search' },
      { icon: Gamepad2, label: 'Games', path: '/games' },
      { icon: Flame, label: 'Trending', path: '/trending' },
      // { icon: Calendar, label: 'New Releases', path: '/new-releases' },
      // { icon: BarChart, label: 'Top Rated', path: '/top-rated' }
=======
      { icon: UserSearchIcon, label: 'Search', path: '/search' },
      { icon: Clock, label: 'Timeline', path: '/timeline' },
      { icon: Gamepad2, label: 'Games', path: '/games' },
      { icon: Flame, label: 'Trending', path: '/trending' },
      { icon: Calendar, label: 'New Releases', path: '/new-releases' },
      { icon: BarChart, label: 'Top Rated', path: '/top-rated' }
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17
    ],
    social: [
      { icon: MessageSquare, label: 'Messages', path: '/messages' },
      { icon: Users, label: 'Friends', path: '/friends' },
      { icon: BookOpen, label: 'Blog', path: '/blog' }
    ]
  };