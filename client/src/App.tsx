import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './AppRoutes';

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
 
          <AppRoutes />
    
      </QueryClientProvider>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;