// import axios from 'axios';
// import { LoginCredentials, CreateAccountDTO } from '../types/auth';

//  export const BASE_URL = 'http://localhost:5182/api/User';

// export const login = async (credentials: LoginCredentials) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/Login`, credentials);
//     // Assuming the API returns a JWT token
//     const token = response.headers['authorization'];
//     if (token) {
//       localStorage.setItem('token', token);
//       return token;
//     }
//     throw new Error('No token received');
//   } catch (error) {
//     throw new Error('Login failed');
//   }
// };

// export const register = async (userData: CreateAccountDTO) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/AddUsers`, userData);
//     return response.data;
//   } catch (error) {
//     throw new Error('Registration failed');
//   }
// };

// export const logout = () => {
//   localStorage.removeItem('token');
// };