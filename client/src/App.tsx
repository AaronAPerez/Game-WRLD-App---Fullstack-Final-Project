import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import AppRoutes from './AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});

export function App() {

  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChatProvider>
            <AppRoutes />
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'bg-stone-900 text-white border border-stone-800',
                duration: 4000
              }}
            />
<<<<<<< HEAD
        
            <AppRoutes />
=======
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17
          </ChatProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}