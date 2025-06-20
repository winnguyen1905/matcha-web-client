import { useEffect, useRef, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  AccountCircle,
  Logout,
  Person,
  Help,
  Brightness4,
  Brightness7,
  MoreVert
} from '@mui/icons-material';
import { gsap } from 'gsap';
import { User } from '../../../types/user';
import { useThemeMode } from '../../../context/ThemeModeContext';

interface AdminHeaderProps {
  onMenuClick: () => void;
  user?: User | null;
  onSearch?: (query: string) => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
  isCollapsed?: boolean;
  onCollapse?: () => void;
}

export const AdminHeader = ({ 
  onMenuClick, 
  user, 
  onSearch,
  notificationCount = 0,
  onNotificationClick
}: AdminHeaderProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [quickMenuAnchor, setQuickMenuAnchor] = useState<null | HTMLElement>(null);
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleQuickMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setQuickMenuAnchor(event.currentTarget);
  };

  const handleQuickMenuClose = () => {
    setQuickMenuAnchor(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      ref={headerRef}
      position="fixed"
      elevation={1}
      sx={(theme) => ({
        width: '100%',
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
      })}
    >
      <Toolbar sx={{ 
        minHeight: '64px !important',
        px: { xs: 1, sm: 3 },
        // minHeight: { xs: '48px !important', sm: '64px !important' },
        height: { xs: 48, sm: 64 },
        flexDirection: { xs: 'row', sm: 'row' },
        alignItems: { xs: 'center', sm: 'center' },
        justifyContent: { xs: 'space-between', sm: 'space-between' },
      }}>
        {/* Left Section - Menu Toggle (mobile) or Logo+Toggle (desktop) */}
        {isMobile ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{
              mr: 1,
              display: 'inline-flex',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-start' },
              mb: { xs: 1, sm: 0 },
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onMenuClick}
              sx={{
                mr: 1,
                display: { xs: 'inline-flex', sm: 'none' },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                overflow: 'hidden'
              }}>
                <img 
                  src="/sounds/picture/logo/logo.png" 
                  alt="Logo" 
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '4px'
                  }} 
                />
              </Box>
              <Typography 
                variant="h6" 
                noWrap 
                component="div"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  background: mode === 'dark'
                    ? 'linear-gradient(135deg, #93c5fd 0%, #f3f4f6 100%)'
                    : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: mode === 'dark'
                      ? 'linear-gradient(90deg, #93c5fd, #f3f4f6)'
                      : 'linear-gradient(90deg, #2563eb, #1e40af)',
                    transform: 'scaleX(0.8)',
                    opacity: 0.8,
                    transition: 'all 0.3s ease'
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                    opacity: 1
                  }
                }}
              >
                Admin Dashboard
              </Typography>
            </Box>
          </Box>
        )}

        {/* Center Section - Search */}
        {!isMobile && (
          <Box
            sx={{
              flexGrow: { xs: 0, sm: 1 },
              width: { xs: '100%', sm: 'auto' },
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'center' },
              mb: { xs: 1, sm: 0 },
              mx: { xs: 0, sm: 2, md: 4 },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                position: 'relative',
                borderRadius: '24px',
                backgroundColor: mode === 'dark' ? '#23272f' : '#f5f5f5',
                border: mode === 'dark' ? '1px solid #374151' : 'none',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#1e293b' : '#eeeeee',
                },
                width: '100%',
                maxWidth: 400,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box sx={{ 
                p: '0 16px', 
                height: '100%', 
                position: 'absolute', 
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SearchIcon sx={{ color: '#666' }} />
              </Box>
              <InputBase
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  color: mode === 'dark' ? '#f3f4f6' : '#222',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: '12px 12px 12px 48px',
                    fontSize: '0.875rem',
                    color: mode === 'dark' ? '#f3f4f6' : '#222',
                    '::placeholder': {
                      color: mode === 'dark' ? '#cbd5e1' : '#888',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Box>
        )}

        {/* Right Section - Actions (mobile: More button) */}
        {isMobile ? (
          <IconButton onClick={handleMobileMenuOpen}>
            <MoreVert />
          </IconButton>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-end' },
              mt: { xs: 1, sm: 0 },
            }}
          >
            {/* Theme Toggle */}
            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton
                onClick={toggleMode}
                sx={{
                  color: '#666',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    color: '#2563eb'
                  }
                }}
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {/* Quick Actions */}
            <Tooltip title="Quick Actions">
              <IconButton
                onClick={handleQuickMenuOpen}
                sx={{
                  color: '#666',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    color: '#2563eb'
                  }
                }}
              >
                <DashboardIcon />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                onClick={onNotificationClick}
                sx={{
                  color: '#666',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    color: '#2563eb'
                  }
                }}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Settings */}
            <Tooltip title="Settings">
              <IconButton
                sx={{
                  color: '#666',
                  display: { xs: 'none', md: 'flex' },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    color: '#2563eb'
                  }
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            {/* Account */}
            <Tooltip title="Account">
              <IconButton
                onClick={handleAccountMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#2563eb',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                  src={user?.prefs?.avatar || ''}
                >
                  {getInitials(user?.name)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Quick Actions Menu */}
        <Menu
          anchorEl={quickMenuAnchor}
          open={Boolean(quickMenuAnchor)}
          onClose={handleQuickMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0'
            }
          }}
        >
          <MenuItem onClick={handleQuickMenuClose}>
            <DashboardIcon sx={{ mr: 2, fontSize: 20 }} />
            Dashboard
          </MenuItem>
          <MenuItem onClick={handleQuickMenuClose}>
            <Person sx={{ mr: 2, fontSize: 20 }} />
            Users
          </MenuItem>
          <MenuItem onClick={handleQuickMenuClose}>
            <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
            Settings
          </MenuItem>
        </Menu>

        {/* Account Menu */}
        <Menu
          anchorEl={accountMenuAnchor}
          open={Boolean(accountMenuAnchor)}
          onClose={handleAccountMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 220,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0'
            }
          }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem' }}>
              {user?.email || 'user@example.com'}
            </Typography>
          </Box>
          
          <MenuItem onClick={handleAccountMenuClose}>
            <AccountCircle sx={{ mr: 2, fontSize: 20 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleAccountMenuClose}>
            <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
            Account Settings
          </MenuItem>
          <MenuItem onClick={handleAccountMenuClose}>
            <Help sx={{ mr: 2, fontSize: 20 }} />
            Help & Support
          </MenuItem>
          
          <Divider />
          
          <MenuItem 
            onClick={handleAccountMenuClose}
            sx={{ color: '#d32f2f' }}
          >
            <Logout sx={{ mr: 2, fontSize: 20 }} />
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
