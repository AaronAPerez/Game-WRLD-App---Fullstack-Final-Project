import axios from 'axios';
import { BASE_URL } from '../constants';
import { UserProfileDTO } from '../types/index';


export interface SearchResult {
  id: number;
  type: 'game' | 'user' | 'post';
  title: string;
  subtitle?: string;
  image?: string;
  url: string;
  metadata?: {
    rating?: number;
    friendCount?: number;
    postDate?: string;
    status?: 'online' | 'offline';
  };
}

export interface UserSearchFilters {
  query: string;
  status?: 'online' | 'offline' | 'all';
  mutualFriends?: boolean;
  mutualGames?: boolean;
}

export const searchService = {
  async universalSearch(query: string): Promise<SearchResult[]> {
    try {
      // Combine results from different sources
      const [users, games, posts] = await Promise.all([
        this.searchUsers({ query, status: 'all' }),
        this.searchGames(query),
        this.searchPosts(query)
      ]);

      return [
        ...users.map(user => ({
          id: user.Id,
          type: 'user' as const,
          title: user.Username,
          subtitle: user.Status,
          image: user.Avatar,
          url: `/profile/${user.Id}`,
          metadata: {
            friendCount: user.FriendsCount,
            status: user.Status
          }
        })),
        ...games,
        ...posts
      ];
    } catch (error) {
      console.error('Universal search error:', error);
      return [];
    }
  },

  async searchUsers(filters: UserSearchFilters): Promise<UserProfileDTO[]> {
    try {
      const response = await axios.get(`${BASE_URL}/User/search`, {
        params: {
          query: filters.query,
          status: filters.status,
          mutualFriends: filters.mutualFriends,
          mutualGames: filters.mutualGames
        }
      });
      return response.data;
    } catch (error) {
      console.error('User search error:', error);
      return [];
    }
  },

  async searchGames(query: string): Promise<SearchResult[]> {
    try {
      // Implement game search using RAWG or another game service
      const response = await axios.get('https://api.rawg.io/api/games', {
        params: {
          key: process.env.RAWG_API_KEY,
          search: query,
          page_size: 5
        }
      });

      return response.data.results.map((game: any) => ({
        id: game.id,
        type: 'game' as const,
        title: game.name,
        subtitle: game.released,
        image: game.background_image,
        url: `/game/${game.id}`,
        metadata: {
          rating: game.rating
        }
      }));
    } catch (error) {
      console.error('Game search error:', error);
      return [];
    }
  },

  async searchPosts(query: string): Promise<SearchResult[]> {
    try {
      const response = await axios.get(`${BASE_URL}/Blog/search`, {
        params: { query }
      });

      return response.data.map((post: any) => ({
        id: post.id,
        type: 'post' as const,
        title: post.title,
        subtitle: post.category,
        image: post.image,
        url: `/blog/${post.id}`,
        metadata: {
          postDate: post.date
        }
      }));
    } catch (error) {
      console.error('Post search error:', error);
      return [];
    }
  }
};