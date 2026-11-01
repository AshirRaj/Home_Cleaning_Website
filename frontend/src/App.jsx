import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { BookingProvider } from './store/bookingStore';
import { AdminAuthProvider } from './store/adminAuthStore';
import { AppRoutes } from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <BookingProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </BookingProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;