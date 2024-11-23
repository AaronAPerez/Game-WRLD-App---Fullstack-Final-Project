import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad, Star, Calendar, TrendingUp, 
  ChevronRight, 
  X
} from 'lucide-react';
import { gameService, getMetacriticColor } from '../services/gameService';
import { GameCard } from '../components/GameCard';
import type { Game } from '../types/rawg';
import FeaturedGames from '../components/FeaturedGames';




export default function  HomePage() {
  const [selectedGame, setSelectedGame] = useState(null);



  // Fetch New Releases (last 30 days)
  const { data: newReleases } = useQuery({
    queryKey: ['newReleases'],
    queryFn: () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      return gameService.getGames({
        dates: `${thirtyDaysAgo.toISOString().split('T')[0]},${new Date().toISOString().split('T')[0]}`,
        ordering: '-released',
        page_size: 4
      });
    }
  });

  // Fetch Upcoming Games (next 6 months)
  const { data: upcomingGames } = useQuery({
    queryKey: ['upcomingGames'],
    queryFn: () => {
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      
      return gameService.getGames({
        dates: `${new Date().toISOString().split('T')[0]},${sixMonthsLater.toISOString().split('T')[0]}`,
        ordering: 'released',
        page_size: 4
      });
    }
  });

  // Fetch Trending Games (high metacritic)
  const { data: trendingGames } = useQuery({
    queryKey: ['trendingGames'],
    queryFn: () => gameService.getGames({
      ordering: '-metacritic',
      metacritic: '80,100',
      page_size: 4
    })
  });

  return (
    <div className="min-h-screen space-y-12">
      {/* Hero Section */}
      <FeaturedGames/>


      {/* Game Categories */}
      <div className="container mx-auto px-4 space-y-12">
        {/* New Releases */}
        <GameSection
          title="New Releases"
          icon={Calendar}
          games={newReleases?.results || []}
          onGameSelect={setSelectedGame}
        />

        {/* Upcoming Games */}
        <GameSection
          title="Upcoming Games"
          icon={Gamepad}
          games={upcomingGames?.results || []}
          onGameSelect={setSelectedGame}
        />

        {/* Trending Now */}
        <GameSection
          title="Trending Now"
          icon={TrendingUp}
          games={trendingGames?.results || []}
          onGameSelect={setSelectedGame}
        />
      </div>

      {/* Game Details Modal */}
      <AnimatePresence>
        {selectedGame && (
          <GameDetailsModal
            gameId={selectedGame.id}
            onClose={() => setSelectedGame(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Game Section Component
interface GameSectionProps {
  title: string;
  icon: React.FC<{ className?: string }>;
  games: Game[];
  onGameSelect: (game: Game) => void;
}

function GameSection({ title, icon: Icon, games, onGameSelect }: GameSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-app-accent-primary" />
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        
        <button className="text-app-accent-primary hover:text-app-accent-primary/80 
                        flex items-center gap-1">
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GameCard game={game} onClick={() => onGameSelect(game)} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Game Details Modal Component
function GameDetailsModal({ gameId, onClose }: { gameId: number; onClose: () => void }) {
  // Fetch game details
  const { data: game } = useQuery({
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

  if (!game) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="container mx-auto px-4 min-h-screen py-12"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-app-card rounded-xl overflow-hidden max-w-6xl mx-auto">
          {/* Header Image */}
          <div className="relative aspect-video">
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-app-card via-transparent" />
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">{game.name}</h2>
                <div className="flex items-center gap-4 mt-2">
                  {game.metacritic && (
                    <div className={`px-3 py-1 rounded-full ${getMetacriticColor(game.metacritic)}`}>
                      Metacritic: {game.metacritic}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {game.rating}
                  </div>
                </div>
              </div>
              
                   {/* Close Button */}
                 <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-gray-900 backdrop-blur-sm text-orange-300 hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              {/* <button
                onClick={onClose}
                className="p-2 hover:bg-app-hover rounded-lg"
              >
                ×
              </button> */}
            </div>

            {/* Game Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                <div>
                  <h3 className="text-xl font-bold mb-4">About</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {game.description_raw}
                  </p>
                </div>

                {/* Screenshots */}
                {screenshots && screenshots.results.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Screenshots</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {screenshots.results.slice(0, 4).map(screenshot => (
                        <img
                          key={screenshot.id}
                          src={screenshot.image}
                          alt="Screenshot"
                          className="rounded-lg w-full aspect-video object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Release Info */}
                <div className="bg-app-hover rounded-lg p-4">
                  <h4 className="font-bold mb-4">Release Info</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Release Date</span>
                      <span>{new Date(game.released).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Publisher</span>
                      <span>{game.publishers?.[0]?.name || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <h4 className="font-bold mb-2">Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.map(({ platform }) => (
                      <span
                        key={platform.id}
                        className="px-3 py-1 bg-app-hover rounded-full text-sm"
                      >
                        {platform.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <h4 className="font-bold mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {game.genres.map(genre => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-app-accent-primary/20 text-app-accent-primary 
                                rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Game Series */}
                {gameSeries && gameSeries.results.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-2">More in the Series</h4>
                    <div className="space-y-2">
                      {gameSeries.results.map(game => (
                        <div
                          key={game.id}
                          className="bg-app-hover rounded-lg p-2 flex gap-2"
                        >
                          <img
                            src={game.background_image}
                            alt={game.name}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{game.name}</p>
                            <p className="text-sm text-text-secondary">
                              {new Date(game.released).getFullYear()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}