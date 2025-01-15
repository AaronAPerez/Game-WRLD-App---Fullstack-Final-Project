// import axios from 'axios';
// import { Post, CreatePostDto } from '../types/social';


// const api = axios.create({
//   baseURL: '/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const socialService = {
//   // Posts
//   getPosts: async () => {
//     const response = await api.get<Post[]>('/Blog/GetBlogItems');
//     return response.data;
//   },

//   getPostsByCategory: async (category: string) => {
//     const response = await api.get<Post[]>(`/Blog/GetBlogItemByCategory/${category}`);
//     return response.data;
//   },

//   getPostsByUser: async (userId: number) => {
//     const response = await api.get<Post[]>(`/Blog/GetItemsByUserId/${userId}`);
//     return response.data;
//   },

//   createPost: async (post: CreatePostDto) => {
//     const response = await api.post<boolean>('/Blog/AddBlogItems', post);
//     return response.data;
//   },

//   updatePost: async (post: Post) => {
//     const response = await api.post<boolean>('/Blog/UpdateBlogItems', post);
//     return response.data;
//   },

//   deletePost: async (postId: string) => {
//     const response = await api.post<boolean>(`/Blog/DeleteBlogItem/${postId}`);
//     return response.data;
//   },
// };