import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string;
  exp: number;
  [key: string]: any;
}

export const tokenUtils = {
  getToken: () => localStorage.getItem('token'),
  
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
  },
  
  isTokenValid: (token: string): boolean => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Date.now() / 1000;
      
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  },
  
  getTokenPayload: (token: string): TokenPayload | null => {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  },
  
  getUserIdFromToken: (token: string): string | null => {
    const payload = tokenUtils.getTokenPayload(token);
    return payload?.sub || null;
  }
};