import { useState } from "react";
import { Box, useTheme, useMediaQuery, CssBaseline, Toolbar } from '@mui/material';
import { Routes, Route } from 'react-router-dom';

// Компоненты
import ScrollHeader from './components/Header';
import ResponsiveDrawer from './components/ResponsiveDrawer';
import BottomNavigationBar from './components/BottomNavigation';
import LoginForm from './components/LoginForm';

// Страницы
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import Lab1 from './pages/Lab1';
import Lab2 from './pages/Lab2';
import Lab3 from './pages/Lab3';
import Lab4 from './pages/Lab4';
import Lab5 from './pages/Lab5';
import Lab6 from './pages/Lab6';
import Lab7 from './pages/Lab7';
import Lab8 from './pages/Lab8';

// Админ страницы
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminFeedbacksPage from './pages/AdminFeedbacksPage';

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Скрываемый Header */}
      <ScrollHeader onMenuToggle={handleDrawerToggle} />

      {/* Toolbar для отступа от фиксированного header */}
      <Toolbar />

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Navigation Drawer */}
        <ResponsiveDrawer
          open={drawerOpen}
          onClose={handleDrawerClose}
          variant={isMobile ? 'temporary' : 'permanent'}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            transition: theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
          }}
        >
          <Routes>
            {/* Основные страницы */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginForm />} />

            {/* Лабораторные работы */}
            <Route path="/lab/1" element={<Lab1 />} />
            <Route path="/lab/2" element={<Lab2 />} />
            <Route path="/lab/3" element={<Lab3 />} />
            <Route path="/lab/4" element={<Lab4 />} />
            <Route path="/lab/5" element={<Lab5 />} />
            <Route path="/lab/6" element={<Lab6 />} />
            <Route path="/lab/7" element={<Lab7 />} />
            <Route path="/lab/8" element={<Lab8 />} />

            {/* Административные страницы */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/feedbacks" element={<AdminFeedbacksPage />} />
          </Routes>
        </Box>
      </Box>

      {/* Bottom Navigation для мобильных */}
      <BottomNavigationBar />
    </Box>
  );
}
