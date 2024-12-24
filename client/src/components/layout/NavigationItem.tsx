import { useState, useRef } from 'react';
import { Home, Grid, Clock, Trending, Star, Trophy, Gamepad2 } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// Utility function to combine class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

const NavigationItem = ({ icon: Icon, label, isActive, onClick, mouseX }) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative flex items-center gap-4 px-4 py-2 my-1 rounded-lg transition-colors duration-200',
        isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
      )}
    >
      <motion.div
        style={{ width, height }}
        className="flex items-center justify-center rounded-full bg-gray-800/30"
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      <span className="text-sm font-medium">{label}</span>
      
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-4 px-2 py-1 text-xs bg-gray-800 rounded-md"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const Navigation = () => {
  const [activeItem, setActiveItem] = useState('home');
  const mouseX = useMotionValue(Infinity);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'browse', icon: Grid, label: 'Browse' },
    { id: 'timeline', icon: Clock, label: 'Timeline' },
    { id: 'divider1', type: 'divider', label: 'DISCOVER' },
    // { id: 'trending', icon: Trending, label: 'Trending' },
    // { id: 'new', icon: Star, label: 'New Releases' },
    // { id: 'top', icon: Trophy, label: 'Top Rated' },
    { id: 'popular', icon: Star, label: 'Popular' },
    { id: 'all', icon: Gamepad2, label: 'All Games' },
  ];

  return (
    <motion.div
      className={cn(
        'fixed left-0 h-screen bg-gray-900 text-gray-300 flex flex-col transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {/* Logo Section */}
      <div className="p-4 flex items-center gap-2">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center"
        >
          <Gamepad2 className="w-8 h-8 text-white" />
        </motion.div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-white"
          >
            GAME WRLD
          </motion.span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4">
        {menuItems.map((item) => {
          if (item.type === 'divider') {
            return !isCollapsed ? (
              <div key={item.id} className="px-4 py-2 text-xs font-semibold text-gray-500">
                {item.label}
              </div>
            ) : null;
          }

          return (
            <NavigationItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.id}
              onClick={() => setActiveItem(item.id)}
              mouseX={mouseX}
            />
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="m-4 p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
      >
        <Grid className={`w-6 h-6 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
      </motion.button>
    </motion.div>
  );
};

export default Navigation;