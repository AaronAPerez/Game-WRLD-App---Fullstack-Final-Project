

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

// export const friendService = {
//   // Friend Requests
//   async getFriendRequests(): Promise<{
//     received: IDBRequest[];
//     sent: IDBRequest[];
//   }> {
//     const response = await api.get(API_ENDPOINTS.USER.FRIEND_REQUESTS);
//     return response.data;
//   },

// import { API_ENDPOINTS, BASE_URL } from '../constants';
// import { UserProfileDTO } from '../types/index';
// import { FriendRequests } from '../types/index';

// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

//   // Friends Management
//   async getFriends(): Promise<UserProfileDTO[]> {
//     const response = await api.get(API_ENDPOINTS.USER.FRIENDS);
//     return response.data;
//   },

// // export const friendService = {
// //   // Friend Requests
// //   async getFriendRequests(): Promise<{
// //     received: FriendRequests[];
// //     sent: FriendRequests[];
// //   }> {
// //     const response = await api.get(API_ENDPOINTS.USER.FRIEND_REQUESTS);
// //     return response.data;
// //   },

// //   async sendFriendRequest(userId: number): Promise<boolean> {
// //     const response = await api.post(API_ENDPOINTS.USER.FRIEND_REQUEST_SEND, {
// //       addresseeName: userId,
// //       stsatus: 'pending'
// //     });
// //     return response.data;
// //   },

//   // Friend Search
//   async searchFriends(query: string): Promise<UserProfileDTO[]> {
//     const response = await api.get(`${API_ENDPOINTS.USER.FRIENDS}/search`, {
//       params: { query }
//     });
//     return response.data;
//   }
// };
