import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import { Box, CssBaseline } from '@mui/material';
import { AdminHeader } from './admin/AdminHeader';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminMainContent } from './admin/AdminMainContent';

export const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { logout } = useAuth();
  const { current: user } = useUser();
  const navigate = useNavigate();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminHeader onMenuClick={handleDrawerToggle} user={user} />
      <AdminSidebar 
        mobileOpen={mobileOpen} 
        onClose={handleDrawerToggle} 
        onLogout={handleLogout} 
      />
      <AdminMainContent />
    </Box>
  );
};

export default AdminLayout;
