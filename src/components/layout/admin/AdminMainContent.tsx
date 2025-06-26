import { Box, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { drawerWidth, collapsedWidth } from './AdminSidebar';
import Breadcrumb from '../../common/Breadcrumb';

interface AdminMainContentProps {
  isCollapsed: boolean;
}

export const AdminMainContent = ({ isCollapsed }: AdminMainContentProps) => {
  const Main = styled('main')(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: '64px', // Height of the AppBar
    marginLeft: isCollapsed ? `${collapsedWidth}px` : `${drawerWidth}px`,
    width: isCollapsed ? `calc(100% - ${collapsedWidth}px)` : `calc(100% - ${drawerWidth}px)`,
    minHeight: 'calc(100vh - 64px)', // Full height minus header
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      width: '100%',
      padding: theme.spacing(2),
    },
  }));
  
  return (
    <Main>
      <Box component="div" sx={{ height: '64px' }} /> {/* Toolbar spacer */}
      <Box sx={{ width: '100%', p: 3 }}>
        {/* Breadcrumb Navigation */}
        <Box sx={{ mb: 2, mt: 1 }}>
          <Breadcrumb variant="admin" />
        </Box>
        <Box>
          <Outlet />
        </Box>
      </Box>
    </Main>
  );
};
