
export const BASE_URL= 'http://localhost:5182/api';
 // This will use relative path in production
// API Base URLs
// export const BASE_URL = isDevelopment ? DEV_API_URL : PROD_API_URL;
export const CHAT_HUB_URL = `${BASE_URL.replace('/api', '')}/hubs/chat`;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth Endpoints
  AUTH: {
    LOGIN: '/User/Login',
    SIGNUP: '/User/AddUsers',
    PROFILE: '/User/Profile',
    UPDATE_PROFILE: '/User/Profile',
  },

  // Chat Endpoints
  CHAT: {
    ROOMS: '/Chat/rooms',
    ROOM_MESSAGES: (roomId: number) => `/Chat/rooms/${roomId}/messages`,
    ROOM_JOIN: (roomId: number) => `/Chat/rooms/${roomId}/join`,
    ROOM_LEAVE: (roomId: number) => `/Chat/rooms/${roomId}/leave`,
    DIRECT_START: '/Chat/direct/start',
    DIRECT_MESSAGES: (userId: number) => `/Chat/direct/${userId}`,
    DIRECT_SEND: '/Chat/direct/send',
  },

  // User Endpoints
  USER: {
    SEARCH: '/User/search',
    GET_BY_USERNAME: (username: string) => `/User/GetUserByUsername/${username}`,
    FRIENDS: '/User/Friends',
    FRIEND_REQUESTS: '/User/Friends/Requests',
    FRIEND_REQUEST_SEND: '/User/Friends/Request',
    FRIEND_REQUEST_RESPOND: '/User/Friends/Respond',
    GAMES: '/User/Games',
  },

  // Blog Endpoints
  BLOG: {
    ALL: '/Blog/GetBlogItems',
    ADD: '/Blog/AddBlogItems',
    UPDATE: '/Blog/UpdateBlogItems',
    DELETE: (id: number) => `/Blog/DeleteBlogItem/${id}`,
    BY_CATEGORY: (category: string) => `/Blog/GetBlogItemByCategory/${category}`,
    BY_USER: (userId: number) => `/Blog/GetItemsByUserId/${userId}`,
    PUBLISHED: '/Blog/GetPublishedItems',
  }
};

// SignalR Events
export const SIGNALR_EVENTS = {
  // Connection Events
  CONNECT: 'Connect',
  DISCONNECT: 'Disconnect',
  RECONNECT: 'Reconnect',
  CONNECTION_ERROR: 'ConnectionError',

  // Message Events
  RECEIVE_MESSAGE: 'ReceiveMessage',
  RECEIVE_DIRECT_MESSAGE: 'ReceiveDirectMessage',
  USER_TYPING: 'UserTyping',
  MESSAGE_READ: 'MessageRead',

  // User Status Events
  USER_ONLINE: 'UserOnlineStatus',
  USER_JOINED_ROOM: 'UserJoinedRoom',
  USER_LEFT_ROOM: 'UserLeftRoom',
  USER_TYPING_STATUS: 'UserTypingStatus',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_ID: 'userId',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
};

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  TYPING_TIMEOUT: 3000,
  RECONNECT_INTERVAL: 5000,
  MESSAGE_BATCH_SIZE: 50,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Validation Rules
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  MESSAGE: {
    MAX_LENGTH: 1000,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to server. Please check your internet connection.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UPLOAD_ERROR: 'Failed to upload file. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  FRIEND_REQUEST_SENT: 'Friend request sent successfully',
  FRIEND_REQUEST_ACCEPTED: 'Friend request accepted',
  MESSAGE_SENT: 'Message sent successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
};

// Animation Variants
export const ANIMATION_VARIANTS = {
  FADE_IN: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  SLIDE_UP: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  SLIDE_RIGHT: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
};