// import React, { useRef, useState } from 'react';
// import { Game } from '../../types/game';
// import { Star, Users } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import { gameService } from '../../services/gameService';
// import { queryClient } from '@/lib/queryClient';
// import MediaPlayer from './MediaPlayer';
// import { GameDetailsModal } from '../GameDetailsModal';

// interface GameCardProps {
//   game: Game;
// }

// const GameCard = ({ game }: GameCardProps) => {
//   const [showModal, setShowModal] = useState(false);
//   const cardRef = useRef<HTMLDivElement>(null);
//   const [rotateX, setRotateX] = useState(0);
//   const [rotateY, setRotateY] = useState(0);
//   const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
//   const [glareOpacity, setGlareOpacity] = useState(0);

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!cardRef.current) return;

//     const card = cardRef.current;
//     const rect = card.getBoundingClientRect();
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;
//     const mouseX = e.clientX;
//     const mouseY = e.clientY;

//     // Calculate rotation values
//     const rotateXValue = ((mouseY - centerY) / (rect.height / 2)) * 10;
//     const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * 10;
    
//     // Calculate glare position
//     const glareX = ((mouseX - rect.left) / rect.width) * 100;
//     const glareY = ((mouseY - rect.top) / rect.height) * 100;

//     setRotateX(-rotateXValue);
//     setRotateY(rotateYValue);
//     setGlarePosition({ x: glareX, y: glareY });
//     setGlareOpacity(0.5);
//   };

//   const handleMouseLeave = () => {
//     setRotateX(0);
//     setRotateY(0);
//     setGlareOpacity(0);
//   };

//     // Fetch trailers and screenshots
//     const { data: trailers } = useQuery({
//       queryKey: ['trailers', game.id],
//       queryFn: () => gameService.getGameTrailers(game.id),
//       enabled: false, // Only fetch when hovered
//     });

//     const { data: screenshots } = useQuery({
//       queryKey: ['screenshots', game.id],
//       queryFn: () => gameService.getGameScreenshots(game.id),
//       enabled: false, // Only fetch when hovered
//     });
  

//   return (
//     <div
//       ref={cardRef}
//       onClick={() => setShowModal(true)}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       className="relative group cursor-pointer perspective-1000"
//       onMouseEnter={() => {
//         queryClient.prefetchQuery(['trailers', game.id]);
//         queryClient.prefetchQuery(['screenshots', game.id]);
//       }}
//       style={{
//         transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
//         transition: 'transform 0.1s ease-out',
//       }}
//     >
//       <div className="relative bg-gray-800/50 rounded-lg overflow-hidden transform-gpu transition-all duration-300">
//          {/* Media Player */}
//          {(trailers || screenshots) && (
//           <MediaPlayer 
//             trailer={trailers?.[0]} 
//             screenshots={screenshots?.results || []}
//           />
//         )}
//         {/* Image with gradient overlay */}
//         <div className="aspect-video w-full relative">
//           <img
//             src={game.background_image}
//             alt={game.name}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0" />
          
//           {/* Glare effect */}
//           <div
//             className="absolute inset-0 pointer-events-none"
//             style={{
//               background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgb(255,255,255,${glareOpacity}), transparent 25%)`,
//               mixBlendMode: 'overlay',
//               transition: 'opacity 0.1s ease-out',
//             }}
//           />
//         </div>

//         {/* Content */}
//         <div className="p-2">
//           <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
          
//           {/* Metadata */}
//           <div className="flex items-center space-x-4 text-gray-300">
//             <div className="flex items-center">
//               <Star className="w-4 h-4 text-yellow-400 mr-1" />
//               <span>{game.rating.toFixed(1)}</span>
//             </div>
//             <div className="flex items-center">
//               <Users className="w-4 h-4 text-blue-400 mr-1" />
//               <span>{game.metacritic || 'N/A'}</span>
//             </div>
//           </div>

//           {/* Platforms */}
//           <div className="mt-2 flex flex-wrap gap-2">
//             {game.platforms.slice(0, 3).map(({ platform }) => (
//               <span
//                 key={platform.id}
//                 className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300"
//               >
//                 {platform.name}
//               </span>
//             ))}
//             {game.platforms.length > 3 && (
//               <span className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300">
//                 +{game.platforms.length - 3}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Hover state overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
//           <div className="absolute bottom-4 left-4 right-4">
//             <p className="text-white text-sm line-clamp-2">
//               Click to view more details
//             </p>
//           </div>
//         </div>
//       </div>
//       {showModal && (
//   <GameDetailsModal 
//     gameId={game.id} 
//     onClose={() => setShowModal(false)} 
//   />
// )}

//     </div>
//   );
// };

// export default GameCard;
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Star, Users } from 'lucide-react';
import { Game } from '@/types/game';

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/games/${game.id}`)}
      className="group relative overflow-hidden rounded-lg bg-gray-900 transition-all hover:scale-105 cursor-pointer"
    >
      {/* Image with gradient overlay */}
      <div className="aspect-video w-full relative">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
        
        {/* Metadata */}
        <div className="flex items-center space-x-4 text-gray-300">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{game.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 text-blue-400 mr-1" />
            <span>{game.metacritic || 'N/A'}</span>
          </div>
        </div>

        {/* Platforms */}
        <div className="mt-2 flex flex-wrap gap-2">
          {game.platforms.slice(0, 3).map(({ platform }) => (
            <span
              key={platform.id}
              className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300"
            >
              {platform.name}
            </span>
          ))}
          {game.platforms.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300">
              +{game.platforms.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-sm line-clamp-2">
            Click to view more details
          </p>
        </div>
      </div>
    </div>
  );
};
export default GameCard;