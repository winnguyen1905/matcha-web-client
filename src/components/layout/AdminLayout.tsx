import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useAccount';
import { Box, CssBaseline } from '@mui/material';
import { AdminHeader } from './admin/AdminHeader';
import { AdminSidebar, drawerWidth, collapsedWidth } from './admin/AdminSidebar';
import { AdminMainContent } from './admin/AdminMainContent';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeModeProvider, useThemeMode } from '../../context/ThemeModeContext';
import { getTheme } from '../../theme';
import { AdminProviders } from '../providers/AdminProviders';

const AdminLayoutContent: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { logout } = useAuth();
  const { current: user } = useUser();
  const navigate = useNavigate();
  const { mode } = useThemeMode();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const handleSidebarCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, navigate]);

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <AdminProviders>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AdminHeader 
            onMenuClick={handleDrawerToggle} 
            user={user} 
            isCollapsed={isCollapsed}
            onCollapse={handleSidebarCollapse}
          />
          <AdminSidebar 
            mobileOpen={mobileOpen} 
            onClose={handleDrawerToggle} 
            onLogout={handleLogout} 
            isCollapsed={isCollapsed}
            onCollapse={handleSidebarCollapse}
          />
          <AdminMainContent isCollapsed={isCollapsed} />
        </Box>
      </AdminProviders>
    </ThemeProvider>
  );
};

export const AdminLayout: React.FC = () => {
  return (
    <ThemeModeProvider>
      <AdminLayoutContent />
    </ThemeModeProvider>
  );
};

export default AdminLayout;
