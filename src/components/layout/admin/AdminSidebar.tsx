import { useState, useEffect, useRef } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Typography, 
  IconButton, 
  useTheme, 
  useMediaQuery, 
  styled,
  Tooltip
} from '@mui/material';
import { 
  DashboardOutlined, 
  ShoppingCartOutlined, 
  PeopleOutline, 
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useThemeMode } from '../../../context/ThemeModeContext';

const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 180;
const MAX_WIDTH = 400;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onCollapse: () => void;
}

const drawerWidth = DEFAULT_WIDTH;
const collapsedWidth = 64;

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'isCollapsed',
})<{ isCollapsed?: boolean }>(({ theme, isCollapsed }) => ({
  width: isCollapsed ? collapsedWidth : drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  position: 'fixed',
  top: 64,
  left: 0,
  height: 'calc(100vh - 64px)',
  zIndex: theme.zIndex.drawer,
  '& .MuiDrawer-paper': {
    width: isCollapsed ? collapsedWidth : drawerWidth,
    boxSizing: 'border-box',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    borderRight: 'none',
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
    position: 'fixed',
    top: 64,
    left: 0,
    height: 'calc(100vh - 64px)',
    zIndex: theme.zIndex.drawer,
  },
}));

export const AdminSidebar = ({ mobileOpen, onClose, onLogout, isCollapsed, onCollapse }: AdminSidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const menuItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const resizerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(isCollapsed ? collapsedWidth : drawerWidth);

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardOutlined />, path: '/admin' },
    { text: 'Products', icon: <ShoppingCartOutlined />, path: '/admin/products' },
    { text: 'Users', icon: <PeopleOutline />, path: '/admin/users' },
  ];

  useEffect(() => {
    setSidebarWidth(isCollapsed ? collapsedWidth : drawerWidth);
  }, [isCollapsed]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(Math.max(e.clientX, MIN_WIDTH), MAX_WIDTH);
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    if (isMobile) {
      setSidebarWidth(DEFAULT_WIDTH);
    }
  }, [isMobile]);

  // Animation effects
  useEffect(() => {
    const tl = gsap.timeline();
    const validMenuItems = menuItemsRef.current.filter((item): item is HTMLLIElement => item !== null);
    if (validMenuItems.length > 0) {
      tl.fromTo(
        validMenuItems,
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.3, 
          stagger: 0.08, 
          ease: 'power2.out' 
        }
      );
    }
    return () => {
      tl.kill();
    };
  }, [sidebarWidth]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const isDashboard = (path: string) => {
    return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
  };

  const renderMenuItems = () => {
    return menuItems.map((item: MenuItem, index: number) => {
      const active = item.text === 'Dashboard' ? isDashboard(item.path) : isActive(item.path);
      return (
        <ListItem
          key={item.path}
          ref={el => {
            if (el) menuItemsRef.current[index] = el;
          }}
          onClick={() => navigate(item.path)}
          sx={{
            cursor: 'pointer',
            borderRadius: 2,
            mb: 1,
            mx: 1,
            px: 2,
            py: 1.5,
            transition: 'all 0.2s ease-in-out',
            backgroundColor: active 
              ? theme.palette.primary.main 
              : 'transparent',
            '&:hover': {
              backgroundColor: active 
                ? theme.palette.primary.dark 
                : theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon 
            sx={{
              minWidth: isCollapsed ? '48px' : 40,
              color: active 
                ? theme.palette.primary.contrastText 
                : theme.palette.text.primary,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '& svg': {
                fontSize: isCollapsed ? '1.5rem' : '1.25rem',
                width: isCollapsed ? '24px' : '20px',
                height: isCollapsed ? '24px' : '20px',
              },
              borderRadius: isCollapsed ? '50%' : '0',
              padding: isCollapsed ? '8px' : '0',
              backgroundColor: isCollapsed ? (active ? theme.palette.primary.main : theme.palette.action.hover) : 'transparent',
            }}
          >
            {item.icon}
          </ListItemIcon>
          {sidebarWidth > MIN_WIDTH + 40 && (
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                color: active 
                  ? theme.palette.primary.contrastText 
                  : theme.palette.text.primary,
                fontWeight: 500,
                fontSize: '0.9375rem',
              }}
            />
          )}
        </ListItem>
      );
    });
  };

  const toggleSidebar = () => {
    if (isMobile) {
      onClose();
    } else {
      onCollapse();
    }
  };

  return (
    <StyledDrawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={mobileOpen}
      onClose={onClose}
      isCollapsed={isCollapsed}
      PaperProps={{
        sx: {
          '& .MuiDrawer-paper': {
            borderRight: 'none',
            borderRadius: isMobile ? 0 : '0 16px 16px 0',
            overflow: 'visible',
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex', 
          flexDirection: 'column', 
          gap: 0.5,
          px: 0.5,
          '& .MuiListItem-root': {
            mx: 0.5,
            '&:last-child': {
              mb: 0.5,
            }
          }
        }}
      >
        {/* Header */}
        <Box 
          sx={{
            p: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {sidebarWidth > MIN_WIDTH + 40 && (
            <Box sx={{ textAlign: isCollapsed ? 'center' : 'left', width: '100%' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: isCollapsed ? '0.75rem' : '1.25rem',
                  lineHeight: isCollapsed ? 1.2 : 1.5,
                }}
              >
                {isCollapsed ? 'AP' : 'Admin Panel'}
              </Typography>
              {!isCollapsed && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    mt: 0.5,
                  }}
                >
                  Administrator
                </Typography>
              )}
            </Box>
          )}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: isCollapsed ? 'center' : 'flex-end',
            width: '100%',
            pr: isCollapsed ? 0 : 1,
            gap: 1,
          }}>
            <Tooltip title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <IconButton
                onClick={onCollapse}
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  display: { xs: 'none', md: 'inline-flex' },
                  transition: 'transform 0.2s',
                  transform: isCollapsed ? 'rotate(180deg)' : 'none',
                  mr: 1
                }}
              >
                {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                display: { md: 'none' },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Menu Items */}
        <Box sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            p: 1,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.divider,
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}>
          <List sx={{ 
            p: 1,
            '& .MuiListItem-root': {
              mx: 0.5,
              mb: 1,
              width: 'calc(100% - 8px)',
              '&.Mui-selected, &.Mui-selected:hover': {
                backgroundColor: theme.palette.primary.main,
                '& .MuiListItemIcon-root, & .MuiTypography-root': {
                  color: theme.palette.primary.contrastText,
                },
              },
            } 
          }}>
            {renderMenuItems()}
          </List>
        </Box>

        {/* Resizer Bar */}
        {!isMobile && (
          <Box
            ref={resizerRef}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 6,
              height: '100%',
              cursor: 'ew-resize',
              zIndex: 2,
              background: 'transparent',
              '&:hover': {
                background: theme.palette.action.hover,
              },
            }}
            onMouseDown={() => setIsResizing(true)}
          />
        )}

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Menu Items */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <List sx={{ 
              p: 1,
              '& .MuiListItem-root': {
                mx: 0.5,
                mb: 1,
                width: 'calc(100% - 8px)',
                '&.Mui-selected, &.Mui-selected:hover': {
                  backgroundColor: theme.palette.primary.main,
                  '& .MuiListItemIcon-root, & .MuiTypography-root': {
                    color: theme.palette.primary.contrastText,
                  },
                },
              } 
            }}>
              {renderMenuItems()}
            </List>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 'auto' }}>
            <Box 
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0.5,
                '& .MuiListItem-root': {
                  mx: 0.5,
                  mb: 0.5,
                  minHeight: 44,
                  borderRadius: 1,
                  '&:last-child': {
                    mb: 0,
                  }
                }
              }}>
                <ListItem
                  button
                  onClick={onLogout}
                  sx={{
                    color: theme.palette.error.main,
                    '&:hover': {
                      backgroundColor: theme.palette.error.light + '1a',
                    },
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: isCollapsed ? 0 : 2,
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: isCollapsed ? 'auto' : 40,
                    color: 'inherit',
                    display: 'flex',
                    justifyContent: 'center',
                    '& svg': {
                      fontSize: isCollapsed ? '1.5rem' : '1.25rem',
                    }
                  }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  {!isCollapsed && 'Logout'}
                </ListItem>
                <ListItem
                  button
                  onClick={toggleMode}
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: isCollapsed ? 0 : 2,
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: isCollapsed ? 'auto' : 40,
                    color: 'inherit',
                    display: 'flex',
                    justifyContent: 'center',
                    '& svg': {
                      fontSize: isCollapsed ? '1.5rem' : '1.25rem',
                    }
                  }}>
                    {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <Typography variant="body2">
                      {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </Typography>
                  )}
                </ListItem>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export { drawerWidth, collapsedWidth };

export default AdminSidebar;
