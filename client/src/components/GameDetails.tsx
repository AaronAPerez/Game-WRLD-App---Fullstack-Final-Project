import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Star, 
  Award, 
  Clock, 
  Tag,
  Globe,
  Store,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { gameService } from '../services/gameService';
import { cn } from '../utils/styles';
import { Link } from 'react-router-dom';

interface GameDetailsProps {
  gameId: number;
}

export default function GameDetails({ gameId }: GameDetailsProps) {
  const [activeTab, setActiveTab] = useState('about');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // Fetch game details
  const { data: game, isLoading: isLoadingGame } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => gameService.getGameDetails(gameId)
  });

  // Fetch screenshots
  const { data: screenshots } = useQuery({
    queryKey: ['screenshots', gameId],
    queryFn: () => gameService.getGameScreenshots(gameId)
  });

  // Fetch game series
  const { data: gameSeries } = useQuery({
    queryKey: ['gameSeries', gameId],
    queryFn: () => gameService.getGameSeries(gameId)
  });

  const getMetacriticColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (isLoadingGame) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) return null;



  return (
    <div className="min-h-screen bg-stone-950 text-gray-100">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={game.background_image} 
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">{game.name}</h1>
            <div className="flex items-center gap-6">
              {game.metacritic && (
                <div className={cn(
                  "px-3 py-1 rounded-full font-medium",
                  getMetacriticColor(game.metacritic)
                )}>
                  Metacritic: {game.metacritic}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>{game.rating}/5</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(game.released).getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Tabs */}
            <div className="flex gap-8 border-b border-stone-800">
              {['about', 'screenshots', 'series'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-4 text-lg font-medium capitalize transition-colors",
                    activeTab === tab 
                      ? "text-white border-b-2 border-indigo-500" 
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'about' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-8"
                >
                  <p className="text-lg leading-relaxed">
                    {game.description_raw}
                  </p>

                  {/* Platforms */}
                  <div>
                    <h3 className="text-xl font-medium mb-4">Available Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {game.platforms.map(({ platform }) => (
                        <span
                          key={platform.id}
                          className="px-3 py-1 bg-stone-900 rounded-full text-sm"
                        >
                          {platform.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'screenshots' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {screenshots?.results.map((screenshot) => (
                      <button
                        key={screenshot.id}
                        onClick={() => setSelectedScreenshot(screenshot.image)}
                        className="relative aspect-video rounded-lg overflow-hidden 
                                hover:ring-2 ring-indigo-500 transition-all"
                      >
                        <img 
                          src={screenshot.image} 
                          alt="Screenshot"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'series' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="relative"
                >
                  {/* Timeline Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-stone-800" />

                  {/* Games */}
                  <div className="space-y-8 pl-8">
                    {gameSeries?.results.map((game) => (
                      <motion.div
                        key={game.id}
                        className="relative"
                        whileHover={{ x: 4 }}
                      >
                        {/* Timeline Dot */}
                        <div className="absolute left-0 top-1/2 -translate-x-[1.95rem] -translate-y-1/2
                                    w-4 h-4 rounded-full border-4 border-indigo-500 bg-stone-950" />
                        
                        <Link
                          to={`/game/${game.id}`}
                          className="block p-4 bg-stone-900 rounded-lg hover:bg-stone-800 
                                  transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{game.name}</h3>
                              <p className="text-sm text-gray-400">
                                {new Date(game.released).getFullYear()}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-stone-900 rounded-lg">
                <Clock className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">Average Playtime</p>
                <p className="text-lg font-medium">{game.playtime} hours</p>
              </div>
              <div className="p-4 bg-stone-900 rounded-lg">
                <Award className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">Achievement Count</p>
                <p className="text-lg font-medium">{game.achievements_count}</p>
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Publishers & Developers */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Publishers & Developers
              </h3>
              <div className="space-y-4">
                {game.publishers.map((publisher) => (
                  <div key={publisher.id} className="text-gray-400">
                    <p className="font-medium text-white">{publisher.name}</p>
                    <p className="text-sm">Publisher</p>
                  </div>
                ))}
                {game.developers.map((developer) => (
                  <div key={developer.id} className="text-gray-400">
                    <p className="font-medium text-white">{developer.name}</p>
                    <p className="text-sm">Developer</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stores */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Store className="w-5 h-5" />
                Available On
              </h3>
              <div className="space-y-2">
                {game.stores.map(({ store }) => (
                  <a
                    key={store.id}
                    href={`https://${store.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-stone-900 rounded-lg hover:bg-stone-800 
                            transition-colors"
                  >
                    {store.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Modal */}
      <AnimatePresence>
        {selectedScreenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedScreenshot(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedScreenshot}
              alt="Screenshot"
              className="max-w-full max-h-full rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}