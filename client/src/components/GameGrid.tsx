import React from "react";
import { useGames } from "../hooks/useGames";
import GameCard from "./GameCard";

export const GameGrid = () => {
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
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