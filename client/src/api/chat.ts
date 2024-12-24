// import { ChatRoomDTO, ChatMessageDTO } from "../types/chat";
// import { api } from "./axios";


// export const chatService = {
//   getRooms: async () => {
//     const response = await api.get<ChatRoomDTO[]>('/Chat/rooms');
//     return response.data;
//   },

//   createRoom: async (data: { name: string; description?: string; isPrivate?: boolean }) => {
//     const response = await api.post<ChatRoomDTO>('/Chat/rooms', data);
//     return response.data;
//   },

//   getRoomMessages: async (roomId: number, page = 1, pageSize = 50) => {
//     const response = await api.get<ChatMessageDTO[]>(
//       `/Chat/rooms/${roomId}/messages?page=${page}&pageSize=${pageSize}`
//     );
//     return response.data;
//   },

//   joinRoom: async (roomId: number) => {
//     await api.post(`/Chat/rooms/${roomId}/join`);
//   },

//   leaveRoom: async (roomId: number) => {
//     await api.post(`/Chat/rooms/${roomId}/leave`);
//   },

//   startDirectMessage: async (receiverId: number) => {
//     const response = await api.post<DirectMessageDTO>('/Chat/direct/start', {
//       receiverId
//     });
//     return response.data;
//   },

//   sendDirectMessage: async (data: SendDirectMessageDTO) => {
//     const response = await api.post<ChatMessageDTO>('/Chat/direct/send', data);
//     return response.data;
//   },

//   getDirectMessages: async (userId: number, page = 1, pageSize = 50) => {
//     const response = await api.get<DirectMessageDTO[]>(
//       `/Chat/direct/${userId}?page=${page}&pageSize=${pageSize}`
//     );
//     return response.data;
//   }
// };