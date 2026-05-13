import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import MainLayout from './layouts/MainLayout';

// Components
import ProtectedRoute from './component/ProtectedRoute';
import ErrorBoundary from './component/ErrorBoundary';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import StaffLogin from './pages/public/StaffLogin';
import LaporBencana from './pages/public/LaporBencana';
import DaftarRelawan from './pages/public/DaftarRelawan';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Bencana from './pages/admin/Bencana';
import Laporan from './pages/admin/Laporan';
import Relawan from './pages/admin/Relawan';
import Posko from './pages/admin/Posko';
import Logistik from './pages/admin/Logistik';
import DetailBencana from './pages/admin/DetailBencana';
import UserManagement from './pages/admin/UserManagement';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Landing />} />
              <Route path="lapor" element={<LaporBencana />} />
              <Route path="daftar-relawan" element={<DaftarRelawan />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/login-petugas" element={<StaffLogin />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'petugas', 'relawan']} />}>
              <Route path="" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="bencana" element={<Bencana />} />
                <Route path="bencana/:id" element={<DetailBencana />} />
                <Route path="laporan" element={<Laporan />} />
                <Route path="posko" element={<Posko />} />
                <Route path="relawan" element={<Relawan />} />
                <Route path="logistik" element={<Logistik />} />
                <Route path="penugasan" element={<Relawan />} />
                <Route path="users" element={<UserManagement />} />
              </Route>
            </Route>

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
