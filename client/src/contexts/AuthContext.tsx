// import { 
//   createContext, 
//   useContext, 
//   useReducer, 
//   useEffect, 
//   useMemo 
// } from 'react';
// import { userService } from '../api/user';

// import { useQueryClient } from '@tanstack/react-query';
// import { toast } from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import { UserProfileDTO } from '../types/auth';

// interface AuthState {
//   user: UserProfileDTO | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
// }

// type AuthAction =
//   | { type: 'LOGIN_START' }
//   | { type: 'LOGIN_SUCCESS'; payload: UserProfileDTO }
//   | { type: 'LOGIN_ERROR'; payload: string }
//   | { type: 'LOGOUT' }
//   | { type: 'UPDATE_PROFILE'; payload: UserProfileDTO };

// const initialState: AuthState = {
//   user: null,
//   isAuthenticated: false,
//   isLoading: true,
//   error: null
// };

// const authReducer = (state: AuthState, action: AuthAction): AuthState => {
//   switch (action.type) {
//     case 'LOGIN_START':
//       return {
//         ...state,
//         isLoading: true,
//         error: null
//       };
//     case 'LOGIN_SUCCESS':
//       return {
//         ...state,
//         isAuthenticated: true,
//         user: action.payload,
//         isLoading: false,
//         error: null
//       };
//     case 'LOGIN_ERROR':
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//         isLoading: false,
//         error: action.payload
//       };
//     case 'LOGOUT':
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//         isLoading: false,
//         error: null
//       };
//     case 'UPDATE_PROFILE':
//       return {
//         ...state,
//         user: action.payload
//       };
//     default:
//       return state;
//   }
// };

// interface AuthContextValue extends AuthState {
//   login: (username: string, password: string) => Promise<void>;
//   logout: () => void;
//   updateProfile: (data: Partial<UserProfileDTO>) => Promise<void>;
//   register: (username: string, password: string) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         dispatch({ type: 'LOGOUT' });
//         return;
//       }

//       try {
//         const profile = await userService.getProfile();
//         dispatch({ type: 'LOGIN_SUCCESS', payload: profile });
//       } catch (error) {
//         localStorage.removeItem('token');
//         dispatch({ type: 'LOGOUT' });
//       }
//     };

//     initAuth();
//   }, []);

//   const login = async (username: string, password: string) => {
//     dispatch({ type: 'LOGIN_START' });
//     try {
//       const { token } = await userService.login({ userName: username, password });
//       localStorage.setItem('token', token);
      
//       const profile = await userService.getProfile();
//       dispatch({ type: 'LOGIN_SUCCESS', payload: profile });
      
//       toast.success('Welcome back!');
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'Failed to login';
//       dispatch({ type: 'LOGIN_ERROR', payload: message });
//       toast.error(message);
//       throw error;
//     }
//   };

//   const register = async (username: string, password: string) => {
//     dispatch({ type: 'LOGIN_START' });
//     try {
//       await userService.register({ username, password });
      
//       // After registration, log the user in
//       const { token } = await userService.login({ userName: username, password });
//       localStorage.setItem('token', token);
      
//       const profile = await userService.getProfile();
//       dispatch({ type: 'LOGIN_SUCCESS', payload: profile });
      
//       toast.success('Account created successfully!');
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'Failed to register';
//       dispatch({ type: 'LOGIN_ERROR', payload: message });
//       toast.error(message);
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     queryClient.clear(); // Clear all queries from cache
//     dispatch({ type: 'LOGOUT' });
//     toast.success('Logged out successfully');
//   };

//   const updateProfile = async (data: Partial<UserProfileDTO>) => {
//     try {
//       const updatedProfile = await userService.updateProfile(data);
//       dispatch({ type: 'UPDATE_PROFILE', payload: updatedProfile });
//       queryClient.invalidateQueries({ queryKey: ['userProfile'] });
//       toast.success('Profile updated successfully');
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'Failed to update profile';
//       toast.error(message);
//       throw error;
//     }
//   };

//   // Session timeout checker
//   useEffect(() => {
//     if (!state.isAuthenticated) return;

//     const checkSession = async () => {
//       try {
//         await userService.getProfile();
//       } catch (error) {
//         if (error instanceof Error && error.message.includes('401')) {
//           logout();
//           toast.error('Session expired. Please login again.');
//         }
//       }
//     };

//     const interval = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes
//     return () => clearInterval(interval);
//   }, [state.isAuthenticated]);

//   const value = useMemo(
//     () => ({
//       ...state,
//       login,
//       logout,
//       register,
//       updateProfile
//     }),
//     [state]
//   );

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook for using auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Custom hook for protected routes
// export const useRequireAuth = () => {
//   const auth = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!auth.isLoading && !auth.isAuthenticated) {
//       navigate('/login', { replace: true });
//     }
//   }, [auth.isLoading, auth.isAuthenticated, navigate]);

//   return auth;
// };