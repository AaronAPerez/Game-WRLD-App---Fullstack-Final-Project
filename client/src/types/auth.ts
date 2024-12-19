interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  }
  
  interface AuthContext {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
  }