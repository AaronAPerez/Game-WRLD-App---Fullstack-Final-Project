// src/utils/index.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { UserIdDTO } from '../types/auth';

// Combine Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Storage utilities
export const storage = {
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  setToken: (token: string) => localStorage.setItem(STORAGE_KEYS.TOKEN, token),
  getUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? (JSON.parse(data) as UserIdDTO) : null;
  },
  setUser: (user: UserIdDTO) => localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
  clear: () => localStorage.clear()
};

// Format date utility
export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Error handling utility
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
};