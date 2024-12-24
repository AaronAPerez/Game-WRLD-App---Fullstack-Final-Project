

// export const userService = {
//   login: async (credentials: LoginDTO) => {
//     const response = await api.post('/User/Login', credentials);
//     return response.data;
//   },

//   register: async (data: CreateAccountDTO) => {
//     const response = await api.post('/User/AddUsers', data);
//     return response.data;
//   },

//   getProfile: async () => {
//     const response = await api.get<UserProfileDTO>('/User/Profile');
//     return response.data;
//   },

//   updateProfile: async (data: UpdateUserProfileDTO) => {
//     const response = await api.put('/User/Profile', data);
//     return response.data;
//   },

//   searchUsers: async (query: string) => {
//     const response = await api.get<UserProfileDTO[]>(`/User/search?query=${query}`);
//     return response.data;
//   },

//   getFriends: async () => {
//     const response = await api.get<UserProfileDTO[]>('/User/Friends');
//     return response.data;
//   },

//   sendFriendRequest: async (addresseeId: number) => {
//     const response = await api.post('/User/Friends/Request', { addresseeId });
//     return response.data;
//   },

//   getFriendRequests: async (requestId: number) => {
//     const response = await api.post('/User/Friends/Requests', { requestId });
//     return response.data;
//   },

//   respondToFriendRequest: async (requestId: number, accept: boolean) => {
//     const response = await api.post('/User/Friends/Respond', { requestId, accept });
//     return response.data;
//   }
// };