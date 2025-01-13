
import apiClient from './apiClient';


export const UserService = {
  // Get User Profile
  async getUserProfile(userId: string) {
    return apiClient.get(`/User/Profile/${userId}`);
  },

  // async updateProfile(data: UpdateUserProfile) {
  //   return apiClient.put('/User/Profile', data);
  // },
  // Search users
  searchUsers: async (query: string) => {
    return await apiClient.get(`/User/search?query=${query}`);
  },

  // Get friends list
  getFriends: async () => {
    return await apiClient.get('/User/Friends');
  },

  // Get friend requests
  getFriendRequests: async () => {
    return await apiClient.get('/User/Friends/Requests');
  },

  // Send friend request
  sendFriendRequest: async (userId: number) => {
    return await apiClient.post('/User/Friends/Request', { addresseeId: userId });
  },

  // Respond to friend request
  respondToFriendRequest: async (requestId: number, accept: boolean) => {
    return await apiClient.post('/User/Friends/Respond', { requestId, accept });
  },

   //Update Avatar  
    async updateAvatar(formData: FormData) {
    const response = await apiClient.post('/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};



