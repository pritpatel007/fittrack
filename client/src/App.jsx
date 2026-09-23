import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import MemberLayout from './layouts/MemberLayout';
import TrainerLayout from './layouts/TrainerLayout';
import AdminLayout from './layouts/AdminLayout';

// Route guards
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Public pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import PlansPage from './pages/public/PlansPage';
import TrainersPage from './pages/public/TrainersPage';
import ClassesPage from './pages/public/ClassesPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Member pages
import MemberDashboard from './pages/member/MemberDashboard';
import MemberProfilePage from './pages/member/MemberProfilePage';
import MemberBookingsPage from './pages/member/MemberBookingsPage';
import MemberAttendancePage from './pages/member/MemberAttendancePage';
import MemberWorkoutPage from './pages/member/MemberWorkoutPage';
import MemberProgressPage from './pages/member/MemberProgressPage';

// Trainer pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerMembersPage from './pages/trainer/TrainerMembersPage';
import TrainerClassesPage from './pages/trainer/TrainerClassesPage';
import TrainerWorkoutManagerPage from './pages/trainer/TrainerWorkoutManagerPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminTrainersPage from './pages/admin/AdminTrainersPage';
import AdminPlansPage from './pages/admin/AdminPlansPage';
import AdminClassesPage from './pages/admin/AdminClassesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminAttendancePage from './pages/admin/AdminAttendancePage';

import LoadingSpinner from './components/common/LoadingSpinner';

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'trainer') return <Navigate to="/trainer" replace />;
  return <Navigate to="/member" replace />;
};

export default function App() {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Dashboard redirect */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

      {/* Member */}
      <Route path="/member" element={<RoleRoute roles={['member']}><MemberLayout /></RoleRoute>}>
        <Route index element={<MemberDashboard />} />
        <Route path="profile" element={<MemberProfilePage />} />
        <Route path="bookings" element={<MemberBookingsPage />} />
        <Route path="attendance" element={<MemberAttendancePage />} />
        <Route path="workout" element={<MemberWorkoutPage />} />
        <Route path="progress" element={<MemberProgressPage />} />
      </Route>

      {/* Trainer */}
      <Route path="/trainer" element={<RoleRoute roles={['trainer']}><TrainerLayout /></RoleRoute>}>
        <Route index element={<TrainerDashboard />} />
        <Route path="members" element={<TrainerMembersPage />} />
        <Route path="classes" element={<TrainerClassesPage />} />
        <Route path="workouts" element={<TrainerWorkoutManagerPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<RoleRoute roles={['admin']}><AdminLayout /></RoleRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="trainers" element={<AdminTrainersPage />} />
        <Route path="plans" element={<AdminPlansPage />} />
        <Route path="classes" element={<AdminClassesPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="attendance" element={<AdminAttendancePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
