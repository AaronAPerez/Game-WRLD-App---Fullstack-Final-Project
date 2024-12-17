import axios from 'axios';
import { UserProfile } from '../types';
import { BASE_URL } from '../constant';

const api = axios.create({
  baseURL: `${BASE_URL}/User`,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const friendService = {
  async sendFriendRequest(userId: number): Promise<boolean> {
    const response = await api.post('/User/Friends/Request', { addresseeId: userId });
    return response.data;
  },

  async getFriendRequests(): Promise<{
    sent: UserProfile[],
    received: UserProfile[],
    accepted: UserProfile[]
  }> {
    const response = await api.get('/User/Friends/Requests');
    return response.data;
  },

  async acceptFriendRequest(requestId: number, accept: boolean): Promise<boolean> {
    const response = await axios.post('/api/User/Friends/Respond', {
      requestId,
      accept: true
    });
    return response.data;
  },


  async getFriends(): Promise<UserProfile[]> {
    const response = await axios.get('/api/User/Friends');
    return response.data;
  }
};