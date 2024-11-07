import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import APIClient from '../services/apiClient';
import { Game } from '../hooks/useGames';
import getCroppedImageUrl from '../services/imageUrl';

const FeaturedGames = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const apiClient = new APIClient<Game>('/games');

  const { data, isLoading } = useQuery({
    queryKey: ['featuredGames'],
    queryFn: () => apiClient.getAll({
      params: {
        dates: `2023-01-01,${new Date().toISOString().split('T')[0]}`,
        ordering: '-metacritic',
        page_size: 5
      }
    })
  });

  if (isLoading) return <div className="h-96 animate-pulse bg-gray-800 rounded-xl" />;

  const featured = data?.results[currentIndex];
  if (!featured) return null;

  return (
    <div className="relative overflow-hidden rounded-xl group">
      <div className="aspect-[21/9]">
        <img
          src={getCroppedImageUrl(featured.background_image)}
          alt={featured.name}
          className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">
              {featured.name}
            </h1>
            <div className="flex gap-2">
              {data?.results.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white scale-100' : 'bg-white/50 scale-75'
                  } hover:scale-100`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewReleases = () => {
  const apiClient = new APIClient<Game>('/games');
  const today = new Date();
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1));

  const { data } = useQuery({
    queryKey: ['newReleases'],
    queryFn: () => apiClient.getAll({
      params: {
        dates: `${new Date().toISOString().split('T')[0]},${nextMonth.toISOString().split('T')[0]}`,
        ordering: '-added',
        page_size: 6
      }
    })
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">New & Upcoming Releases</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.results.map(game => (
          <div
            key={game.id}
            className="group bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-900/30"
          >
            <div className="aspect-video">
              <img
                src={getCroppedImageUrl(game.background_image)}
                alt={game.name}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white">{game.name}</h3>
              <p className="text-sm text-gray-400 mt-2">
                Release Date: {new Date(game.released).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrendingGames = () => {
  const apiClient = new APIClient<Game>('/games');

  const { data } = useQuery({
    queryKey: ['trendingGames'],
    queryFn: () => apiClient.getAll({
      params: {
        ordering: '-metacritic',
        dates: '2023-01-01,2024-12-31',
        page_size: 4
      }
    })
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Trending Now</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.results.map(game => (
          <div
            key={game.id}
            className="group bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-900/30"
          >
            <div className="aspect-video">
              <img
                src={getCroppedImageUrl(game.background_image)}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white">{game.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">{game.released}</span>
                <span className="text-sm font-bold text-green-400">
                  {game.metacritic}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { FeaturedGames, NewReleases, TrendingGames };