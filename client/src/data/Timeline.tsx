// src/pages/Timeline.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,  
  Calendar,
  GamepadIcon 
} from 'lucide-react';
import { timelineEras } from './timelineData';
import { GameCard } from '../components/game/GameCard';
import { GameDetailsModal } from '../components/GameDetailsModal';
import { useQuery } from '@tanstack/react-query';
import { gameService } from '../services/gameService';
import { cn } from '../utils/styles';
import type { Game } from '../types/rawg';
import type { TimelineEra, Platform } from '../types/timeline';

export default function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const selectedEra = timelineEras[activeIndex];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Fetch era games
  const { data: eraGames, isLoading } = useQuery({
    queryKey: ['era-games', selectedEra.id],
    queryFn: () => gameService.getGames(selectedEra.query)
  });

  // Event handlers
  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  return (
    <div className="space-y-8 min-h-screen bg-stone-950 px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[300px] rounded-2xl overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-10"
          style={{
            backgroundImage: `url(${selectedEra.majorPlatforms[0]?.image || eraGames?.results[0]?.background_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end p-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Gaming History
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Explore the evolution of video games through the decades
          </p>
        </div>
      </motion.div>

      {/* Timeline Navigation */}
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-stone-800 text-white hover:bg-stone-700"
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <div className="flex items-center gap-4 overflow-x-auto py-4 scrollbar-hide">
          {timelineEras.map((era: TimelineEra, index: number) => (
            <motion.button
              key={era.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "px-6 py-3 rounded-full transition-all whitespace-nowrap",
                activeIndex === index
                  ? "bg-green-600 text-white"
                  : "bg-stone-800 hover:bg-stone-700 text-gray-300"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {era.title}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-stone-800 text-white hover:bg-stone-700"
          onClick={() => setActiveIndex(Math.min(timelineEras.length - 1, activeIndex + 1))}
          disabled={activeIndex === timelineEras.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Era Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedEra.id}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Era Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-stone-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                {selectedEra.title}
              </h2>
              <p className="text-gray-300">
                {selectedEra.description}
              </p>
            </div>

            {/* Key Events */}
            <div className="bg-stone-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Key Events</h3>
              <div className="space-y-3">
                {selectedEra.keyEvents.map((event: string, index: number) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start gap-3 p-3 rounded-lg bg-stone-700/50"
                  >
                    <Calendar className="w-5 h-5 text-green-500 mt-1" />
                    <p className="text-gray-300">{event}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Major Platforms */}
            <div className="bg-stone-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Major Platforms</h3>
              <div className="space-y-3">
                {selectedEra.majorPlatforms.map((platform: Platform) => (
                  <motion.div
                    key={platform.id}
                    variants={itemVariants}
                    className="flex items-start gap-3 p-3 rounded-lg bg-stone-700/50"
                  >
                    <GamepadIcon className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">{platform.name}</h4>
                      <p className="text-sm text-gray-400">
                        {platform.manufacturer} ({platform.releaseYear})
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Games Grid */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            <h3 className="text-xl font-bold text-white">Notable Games</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-video bg-stone-800 rounded-lg animate-pulse"
                  />
                ))
              ) : (
                eraGames?.results.map((game: Game) => (
                  <motion.div
                    key={game.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <GameCard
                      game={game}
                      onClick={() => handleGameSelect(game)}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Game Details Modal */}
      <AnimatePresence>
        {selectedGame && (
          <GameDetailsModal
            gameId={selectedGame.id}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Calendar, 
//   Star, 
//   Filter,
//   ChevronDown,
//   ChevronUp,
//   GamepadIcon
// } from 'lucide-react';
// import { gameService } from '../services/gameService';
// import type { Game } from '../types/rawg';
// import GameDetailsModal from '../components/GameDetailsModal';

// interface TimelineEvent {
//   id: string;
//   type: 'game_release' | 'achievement' | 'activity' | 'news';
//   title: string;
//   description: string;
//   date: Date;
//   image?: string;
//   metadata?: {
//     game?: Game;
//     achievementName?: string;
//     achievementIcon?: string;
//     activityType?: string;
//     newsSource?: string;
//   };
// }

// const Timeline = () => {
//   const [selectedGame, setSelectedGame] = useState<Game | null>(null);
//   const [selectedFilter, setSelectedFilter] = useState<'all' | 'releases' | 'achievements' | 'activity'>('all');
//   const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

//   // Fetch upcoming games
//   const { data: upcomingGames, isLoading: isLoadingGames } = useQuery({
//     queryKey: ['upcoming-games'],
//     queryFn: () => {
//       const sixMonthsLater = new Date();
//       sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      
//       return gameService.getGames({
//         dates: `${new Date().toISOString().split('T')[0]},${sixMonthsLater.toISOString().split('T')[0]}`,
//         ordering: 'released',
//         page_size: 10
//       });
//     }
//   });

//   // Example timeline events (combine with game releases)
//   const generateTimelineEvents = (): TimelineEvent[] => {
//     const events: TimelineEvent[] = [];

//     // Add game releases
//     upcomingGames?.results.forEach(game => {
//       events.push({
//         id: `game-${game.id}`,
//         type: 'game_release',
//         title: `${game.name} Release`,
//         description: game.description_raw || 'Experience the latest gaming adventure!',
//         date: new Date(game.released),
//         image: game.background_image,
//         metadata: { game }
//       });
//     });

//     // Add example achievements and activities
//     events.push({
//       id: 'achievement-1',
//       type: 'achievement',
//       title: 'Achievement Unlocked: Master Gamer',
//       description: 'Completed 100 games in your collection',
//       date: new Date(Date.now() - 86400000 * 2), // 2 days ago
//       image: '/api/placeholder/64/64',
//       metadata: {
//         achievementName: 'Master Gamer',
//         achievementIcon: '/api/placeholder/32/32'
//       }
//     });

//     // Sort events by date
//     return events.sort((a, b) => b.date.getTime() - a.date.getTime());
//   };

//   const timelineEvents = generateTimelineEvents();

//   const toggleEventExpansion = (eventId: string) => {
//     setExpandedEvents(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(eventId)) {
//         newSet.delete(eventId);
//       } else {
//         newSet.add(eventId);
//       }
//       return newSet;
//     });
//   };

//   const getMetacriticColor = (score: number | null) => {
//     if (!score) return 'text-gray-400';
//     if (score >= 75) return 'text-green-500';
//     if (score >= 50) return 'text-yellow-500';
//     return 'text-red-500';
//   };

//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     }).format(date);
//   };

//   const renderTimelineEvent = (event: TimelineEvent) => {
//     const isExpanded = expandedEvents.has(event.id);
    
//     return (
      
//       <motion.div
//         key={event.id}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-stone-900 rounded-lg overflow-hidden shadow-lg"
//       >
//         {/* Event Header */}
//         <div className="relative">
//           {event.image && (
//             <div className="aspect-video">
//               <img
//                 src={event.image}
//                 alt={event.title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />
//             </div>
//           )}
          
//           {/* Event Info */}
//           <div className="absolute bottom-0 left-0 right-0 p-4">
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
//                 <div className="flex items-center gap-2 text-sm">
//                   <Calendar className="w-4 h-4 text-blue-400" />
//                   <span className="text-gray-300">{formatDate(event.date)}</span>
//                 </div>
//               </div>
              
//               {event.type === 'game_release' && event.metadata?.game && (
//                 <div className="flex items-center gap-2">
//                   {event.metadata.game.metacritic && (
//                     <div className={`px-2 py-1 rounded-full ${getMetacriticColor(event.metadata.game.metacritic)} bg-stone-800/90`}>
//                       <Star className="w-4 h-4 inline mr-1" />
//                       {event.metadata.game.metacritic}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Event Content */}
//         <div className="p-4">
//           <div className={`text-gray-400 ${isExpanded ? '' : 'line-clamp-2'}`}>
//             {event.description}
//           </div>
          
//           {/* Event Actions */}
//           <div className="mt-4 flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               {event.type === 'game_release' && event.metadata?.game && (
//                 <button
//                   onClick={() => setSelectedGame(event.metadata?.game || null)}
//                   className="text-blue-400 hover:text-blue-300 text-sm font-medium"
//                 >
//                   View Details
//                 </button>
//               )}
//             </div>
            
//             <button
//               onClick={() => toggleEventExpansion(event.id)}
//               className="text-gray-400 hover:text-white"
//             >
//               {isExpanded ? (
//                 <ChevronUp className="w-5 h-5" />
//               ) : (
//                 <ChevronDown className="w-5 h-5" />
//               )}
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   if (isLoadingGames) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-stone-950 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-white mb-4">Gaming Timeline</h1>
          
//           {/* Filters */}
//           <div className="flex items-center gap-4 overflow-x-auto pb-2">
//             <button
//               onClick={() => setSelectedFilter('all')}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//                 selectedFilter === 'all' 
//                   ? 'bg-blue-600 text-white' 
//                   : 'text-gray-400 hover:text-white'
//               }`}
//             >
//               <Filter className="w-4 h-4" />
//               All
//             </button>
//             <button
//               onClick={() => setSelectedFilter('releases')}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//                 selectedFilter === 'releases' 
//                   ? 'bg-blue-600 text-white' 
//                   : 'text-gray-400 hover:text-white'
//               }`}
//             >
//               <Calendar className="w-4 h-4" />
//               Releases
//             </button>
//             <button
//               onClick={() => setSelectedFilter('achievements')}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//                 selectedFilter === 'achievements' 
//                   ? 'bg-blue-600 text-white' 
//                   : 'text-gray-400 hover:text-white'
//               }`}
//             >
//               <Star className="w-4 h-4" />
//               Achievements
//             </button>
//             <button
//               onClick={() => setSelectedFilter('activity')}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//                 selectedFilter === 'activity' 
//                   ? 'bg-blue-600 text-white' 
//                   : 'text-gray-400 hover:text-white'
//               }`}
//             >
//               <GamepadIcon className="w-4 h-4" />
//               Activity
//             </button>
//           </div>
//         </div>

//         {/* Timeline */}
//         <div className="space-y-6">
//           {timelineEvents
//             .filter(event => selectedFilter === 'all' || event.type.includes(selectedFilter))
//             .map(renderTimelineEvent)}
//         </div>
//       </div>

//       {/* Game Details Modal */}
//       <AnimatePresence>
//         {selectedGame && (
//           <GameDetailsModal
//             gameId={selectedGame.id}
//             onClose={() => setSelectedGame(null)}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Timeline;