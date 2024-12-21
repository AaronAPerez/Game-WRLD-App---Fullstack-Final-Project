import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import AppRoutes from './AppRoutes';
import { ChatProvider } from './contexts/ChatContext';



// Create query client
const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChatProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1c1917',
                  color: '#fff',
                },
              }}
            />
        
            <AppRoutes />
          </ChatProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;