import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, GamepadIcon, Star } from 'lucide-react';
import { timelineEras } from '../components/games/timelineData';
import { cn } from '../utils/styles';

const TimelineDot = ({ active, onClick, color }) => (
  <motion.button
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={cn(
      "w-4 h-4 rounded-full transition-colors",
      "border-2",
      active ? "border-white" : "border-gray-600",
    )}
    style={{ backgroundColor: active ? color : 'transparent' }}
  />
);

const TimelineContent = ({ era, onGameSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6"
    >
      {/* Left Column - Era Info */}
      <div className="space-y-6">
        <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-3xl font-bold text-white mb-4">{era.title}</h2>
          <p className="text-gray-300 leading-relaxed">{era.description}</p>
          
          {/* Year Range */}
          <div className="mt-4 flex items-center gap-2 text-gray-400">
            <Calendar className="w-5 h-5" />
            <span>{era.yearStart} - {era.yearEnd}</span>
          </div>
        </div>

        {/* Key Events */}
        <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Key Events</h3>
          <div className="space-y-3">
            {era.keyEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-stone-700/30"
              >
                <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
                <p className="text-gray-300 text-sm">{event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Platforms */}
      <div className="space-y-6">
        <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Major Platforms</h3>
          <div className="grid gap-4">
            {era.majorPlatforms.map((platform) => (
              <motion.div
                key={platform.id}
                whileHover={{ scale: 1.02 }}
                className="relative group rounded-lg overflow-hidden"
              >
                <div className="aspect-video relative">
                  <img
                    src={platform.image}
                    alt={platform.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h4 className="text-lg font-bold text-white">{platform.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <GamepadIcon className="w-4 h-4" />
                      <span>{platform.manufacturer} ({platform.releaseYear})</span>
                    </div>
                  </div>
                </div>
                
                {/* Platform Description - Appears on Hover */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 bg-black/80 p-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <p className="text-gray-200 text-sm text-center">
                    {platform.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TimeLinePage = () => {
  const [selectedEraIndex, setSelectedEraIndex] = useState(0);
  const selectedEra = timelineEras[selectedEraIndex];

  const nextEra = () => {
    setSelectedEraIndex((prev) => 
      prev < timelineEras.length - 1 ? prev + 1 : prev
    );
  };

  const prevEra = () => {
    setSelectedEraIndex((prev) => prev > 0 ? prev - 1 : prev);
  };

  return (
    <div className="min-h-screen bg-stone-950 relative">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-stone-900 to-stone-950"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${selectedEra.color}20 0%, transparent 70%)`
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevEra}
            disabled={selectedEraIndex === 0}
            className={cn(
              "p-2 rounded-full",
              selectedEraIndex === 0 
                ? "text-gray-600 cursor-not-allowed" 
                : "text-white hover:bg-white/10"
            )}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <div className="flex items-center gap-4">
            {timelineEras.map((era, index) => (
              <TimelineDot
                key={era.id}
                active={index === selectedEraIndex}
                onClick={() => setSelectedEraIndex(index)}
                color={era.color}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextEra}
            disabled={selectedEraIndex === timelineEras.length - 1}
            className={cn(
              "p-2 rounded-full",
              selectedEraIndex === timelineEras.length - 1
                ? "text-gray-600 cursor-not-allowed"
                : "text-white hover:bg-white/10"
            )}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <TimelineContent
            key={selectedEra.id} 
            era={selectedEra}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimeLinePage;