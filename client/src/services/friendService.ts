<<<<<<< HEAD
import axios from 'axios';
import type { UserProfileDTO } from '../types/index';
import { API_ENDPOINTS, BASE_URL } from '../constants';

=======
// import axios from 'axios';
// import { BASE_URL } from '../constants';
// import type { FriendRequests } from '../types';
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17

// export const friendService = {
//   async sendFriendRequest(userId: number): Promise<void> {
//     await axios.post(`${BASE_URL}/User/Friends/Request`, {
//       addresseeId: userId
//     });
//   },

//   async respondToFriendRequest(requestId: number, accept: boolean): Promise<void> {
//     await axios.post(`${BASE_URL}/User/Friends/Respond`, {
//       requestId,
//       accept
//     });
//   },

<<<<<<< HEAD
export const friendService = {
  // Friend Requests
  async getFriendRequests(): Promise<{
    received: IDBRequest[];
    sent: IDBRequest[];
  }> {
    const response = await api.get(API_ENDPOINTS.USER.FRIEND_REQUESTS);
    return response.data;
  },
=======
//   async getFriendRequests(): Promise<{
//     sent: FriendRequests[];
//     received: FriendRequests[];
//   }> {
//     const response = await axios.get(`${BASE_URL}/User/Friends/Requests`);
//     return response.data;
//   }
// };
// import axios from 'axios';
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17

// import { API_ENDPOINTS, BASE_URL } from '../constants';
// import { UserProfileDTO } from '../types/index';
// import { FriendRequests } from '../types/index';

// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

<<<<<<< HEAD
  // Friends Management
  async getFriends(): Promise<UserProfileDTO[]> {
    const response = await api.get(API_ENDPOINTS.USER.FRIENDS);
    return response.data;
  },
=======
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17

// export const friendService = {
//   // Friend Requests
//   async getFriendRequests(): Promise<{
//     received: FriendRequests[];
//     sent: FriendRequests[];
//   }> {
//     const response = await api.get(API_ENDPOINTS.USER.FRIEND_REQUESTS);
//     return response.data;
//   },

//   async sendFriendRequest(userId: number): Promise<boolean> {
//     const response = await api.post(API_ENDPOINTS.USER.FRIEND_REQUEST_SEND, {
//       addresseeName: userId,
//       stsatus: 'pending'
//     });
//     return response.data;
//   },

<<<<<<< HEAD
  // Friend Search
  async searchFriends(query: string): Promise<UserProfileDTO[]> {
    const response = await api.get(`${API_ENDPOINTS.USER.FRIENDS}/search`, {
      params: { query }
    });
    return response.data;
  }
};
=======
//   async respondToFriendRequest(requestId: number, accept: boolean): Promise<boolean> {
//     const response = await api.post(API_ENDPOINTS.USER.FRIEND_REQUEST_RESPOND, {
//       requestId,
//       accept
//     });
//     return response.data;
//   },

//   // Friends Management
//   async getFriends(): Promise<UserProfileDTO[]> {
//     const response = await api.get(API_ENDPOINTS.USER.FRIENDS);
//     return response.data;
//   },

//   async removeFriend(friendId: number): Promise<boolean> {
//     const response = await api.delete(`${API_ENDPOINTS.USER.FRIENDS}/${friendId}`);
//     return response.data;
//   },

//   // Friend Status
//   async getUserFriendStatus(userId: number): Promise<{
//     isFriend: boolean;
//     isPending: boolean;
//   }> {
//     const response = await api.get(`${API_ENDPOINTS.USER.FRIENDS}/status/${userId}`);
//     return response.data;
//   },

//   // Friend Search
//   async searchFriends(query: string): Promise<UserProfileDTO[]> {
//     const response = await api.get(`${API_ENDPOINTS.USER.FRIENDS}/search`, {
//       params: { query }
//     });
//     return response.data;
//   }
// };
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17
