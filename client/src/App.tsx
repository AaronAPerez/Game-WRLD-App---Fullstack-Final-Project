import { BrowserRouter, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import { ChatProvider } from './contexts/ChatContext';
import AppRoutes from './AppRoutes';
import { useAuth } from './hooks/useAuth';

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

        
            <AppRoutes />


          </ChatProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}