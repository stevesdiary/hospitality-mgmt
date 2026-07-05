import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './store';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages - Public
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Pages - Hotels
import HotelLandingPage from './pages/hotels/HotelLandingPage';

// Pages - Rooms
import RoomDetailPage from './pages/rooms/RoomDetailPage';
import BookingPage from './pages/bookings/BookingPage';

// Pages - User
import ProfilePage from './pages/user/ProfilePage';
import MyReservationsPage from './pages/user/MyReservationsPage';
import SettingsPage from './pages/user/SettingsPage';

// Pages - Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageHotelsPage from './pages/admin/ManageHotelsPage';
import ManageRoomsPage from './pages/admin/ManageRoomsPage';
import ManageReservationsPage from './pages/admin/ManageReservationsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import FrontDeskPage from './pages/admin/FrontDeskPage';

// Pages - Bookings
import BookingConfirmationPage from './pages/bookings/BookingConfirmationPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user) {
    const userData = JSON.parse(user);
    // Both platform admins and hotel admins (org_admin) run the management console.
    if (userData.userType !== 'admin' && userData.userType !== 'org_admin') {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          {/* Per-hotel public landing/booking page — a single hotel's own branded page */}
          <Route path="/h/:slug" element={<MainLayout><HotelLandingPage /></MainLayout>} />
          {/* Retired marketplace surfaces — StayNG is not a cross-hotel catalogue.
              Guests reach a hotel via its own /h/:slug link. */}
          <Route path="/hotels" element={<Navigate to="/" replace />} />
          <Route path="/hotels/:id" element={<Navigate to="/" replace />} />
          <Route path="/search" element={<Navigate to="/" replace />} />
          <Route path="/rooms/:id" element={<MainLayout><RoomDetailPage /></MainLayout>} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
          <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />
          
          {/* Booking Routes */}
          <Route path="/book/:roomId" element={<MainLayout><BookingPage /></MainLayout>} />
          <Route
            path="/booking/:id/confirmation"
            element={
              <ProtectedRoute>
                <MainLayout><BookingConfirmationPage /></MainLayout>
              </ProtectedRoute>
            }
          />
          
          {/* User Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <MainLayout><ProfilePage /></MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-reservations" 
            element={
              <ProtectedRoute>
                <MainLayout><MyReservationsPage /></MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <MainLayout><SettingsPage /></MainLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <MainLayout><AdminDashboardPage /></MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/hotels" 
            element={
              <ProtectedRoute requireAdmin>
                <MainLayout><ManageHotelsPage /></MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/rooms" 
            element={
              <ProtectedRoute requireAdmin>
                <MainLayout><ManageRoomsPage /></MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reservations" 
            element={
              <ProtectedRoute requireAdmin>
                <MainLayout><ManageReservationsPage /></MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <MainLayout><ManageUsersPage /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/front-desk"
            element={
              <ProtectedRoute requireAdmin>
                <FrontDeskPage />
              </ProtectedRoute>
            }
          />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </Provider>
  );
};

export default App;
