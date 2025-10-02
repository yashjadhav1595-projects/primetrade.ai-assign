import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from '../ui/Navbar.jsx';
import LoginPage from './auth/LoginPage.jsx';
import RegisterPage from './auth/RegisterPage.jsx';
import DashboardPage from './dashboard/DashboardPage.jsx';
import TasksPage from './tasks/TasksPage.jsx';
import ProtectedRoute from '../routes/ProtectedRoute.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/tasks"
            element={<ProtectedRoute><TasksPage /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}


