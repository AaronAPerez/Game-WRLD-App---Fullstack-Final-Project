import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../../types/game';


interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section = ({ title, children, className = '' }: SectionProps) => (
  <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 ${className}`}>
    <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
    {children}
  </div>
);

const GamingLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Game Categories */}
        <div className="lg:col-span-1 space-y-4">
          <Section title="Libraries" className="bg-gray-800/30">
            <nav className="space-y-2">
              {['All Games', 'Recent', 'Favorites', 'Installed'].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                >
                  {item}
                </button>
              ))}
            </nav>
          </Section>

          <Section title="Categories" className="bg-gray-800/30">
            <div className="grid gap-2">
              {['Action', 'RPG', 'Strategy', 'Sports', 'Racing'].map((genre) => (
                <button
                  key={genre}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                >
                  {genre}
                </button>
              ))}
            </div>
          </Section>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Featured Games" className="bg-gradient-to-br from-purple-900/50 to-gray-800/50">
            {/* Featured Games Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Featured Game Cards */}
            </div>
          </Section>

          <Section title="Recently Played" className="bg-gradient-to-br from-blue-900/50 to-gray-800/50">
            {/* Recently Played Games */}
            <div className="grid grid-cols-2 gap-4">
              {/* Game Cards */}
            </div>
          </Section>

          <Section title="Recommended" className="bg-gradient-to-br from-green-900/50 to-gray-800/50">
            {/* Recommended Games */}
            <div className="grid grid-cols-2 gap-4">
              {/* Game Cards */}
            </div>
          </Section>
        </div>

        {/* Right Sidebar - Social & Activity */}
        <div className="lg:col-span-1 space-y-4">
          <Section title="Friends Online" className="bg-gray-800/30">
            {/* Online Friends List */}
            <div className="space-y-3">
              {/* Friend Items */}
            </div>
          </Section>

          <Section title="Recent Activity" className="bg-gray-800/30">
            {/* Activity Feed */}
            <div className="space-y-4">
              {/* Activity Items */}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

// Enhance the game card component with layered shadow effect
export const GameCard = ({ game }: { game: Game }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/games/${game.id}`)}
      className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300
        hover:scale-[1.02] hover:-translate-y-1
        bg-gradient-to-br from-gray-800/80 to-gray-900/80
        ring-1 ring-gray-700/50"
      style={{
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="aspect-video w-full relative">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover rounded-t-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{game.name}</h3>
        <div className="flex items-center justify-between text-sm text-gray-300">
          <span>{game.released}</span>
          <span className="px-2 py-1 bg-purple-600/30 rounded-full">
            {game.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Hover overlay with glass effect */}
      <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" />
    </div>
  );
};

export default GamingLayout;