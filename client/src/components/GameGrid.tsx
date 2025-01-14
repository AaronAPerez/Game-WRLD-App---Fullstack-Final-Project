import React from "react";
import { useGames } from "../hooks/useGames";
import GameCard from "./games/GameCard";

const GameGrid = () => {
    const {
      games,
      isLoading,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    } = useGames();
  
    const observerTarget = React.useRef(null);
  
    React.useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1 }
      );
  
      if (observerTarget.current) {
        observer.observe(observerTarget.current);
      }
  
      return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  
    if (error) return <div className="text-red-500">Error loading games</div>;
  
    return (
      <div className="container mx-auto px-4 py-2">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game, index) => (
        <GameCard 
          key={game.id} 
          game={game}
          priority={index < 4} // Prioritize loading for first 4 cards
        />
      ))}
    </div>
        
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center mt-8">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Infinite scroll trigger */}
        <div ref={observerTarget} className="h-20" />
        
        {/* Load more indicator */}
        {isFetchingNextPage && (
          <div className="text-center mt-4 text-gray-400">
            Loading more games...
          </div>
        )}
      </div>
    );
  };
  
  export default GameGrid;