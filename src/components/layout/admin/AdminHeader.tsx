import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { User } from '../../../types/user';

interface AdminHeaderProps {
  onMenuClick: () => void;
  user?: User | null;
}

export const AdminHeader = ({ onMenuClick, user }: AdminHeaderProps) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - 240px)` },
        ml: { sm: '240px' },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onMenuClick}
              sx={{
                mr: 2,
                display: { sm: 'none' }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Admin Dashboard
            </Typography>
          </Box>
          <Typography variant="subtitle1" noWrap component="div">
            Welcome, {user?.name || 'Admin'}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
