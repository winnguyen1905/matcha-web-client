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
  ChevronRight,
  NotificationsOutlined,
  SettingsOutlined,
  Assignment as OrderIcon,
  LocalOffer as DiscountIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useThemeMode } from '../../../context/ThemeModeContext';
import { useUser } from '../../../hooks/useUser';

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
  const { current } = useUser();
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
    { text: 'Orders', icon: <OrderIcon />, path: '/admin/orders' },
    { text: 'Discounts', icon: <DiscountIcon />, path: '/admin/discounts' },
    { text: 'Notifications', icon: <NotificationsOutlined />, path: '/admin/notifications' },
    { text: 'Settings', icon: <SettingsOutlined />, path: '/admin/settings' }
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
              minWidth: 40,
              color: active
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
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
          height: '100%',
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
                {isCollapsed ? 'AP' : 'Whats Up '}
              </Typography>
              {!isCollapsed && (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mt: 0.5,
                  }}
                >
                  Hello {current?.name}
                </Typography>
              )}
            </Box>
          )}
          {/* <Box sx={{
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
          </Box> */}
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

        {/* Footer - stick to bottom */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <ListItem
              button
              onClick={onLogout}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
              {sidebarWidth > MIN_WIDTH + 40 && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    variant: 'body2',
                    sx: { pl: 0 }
                  }}
                />
              )}
            </ListItem>
            <ListItem
              button
              onClick={toggleMode}
              sx={{
                borderRadius: 1,
                px: isCollapsed ? 0 : 1,
                py: 1,
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                alignItems: 'center',
                justifyContent: 'flex-start',
                minHeight: 44,
                '& .MuiListItemIcon-root': {
                  minWidth: isCollapsed ? 'auto' : 32,
                  color: 'inherit',
                  display: 'flex',
                  justifyContent: 'center',
                }
              }}
            >
              <ListItemIcon>
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  primaryTypographyProps={{
                    variant: 'body2',
                    sx: { pl: 0 }
                  }}
                />
              )}
            </ListItem>
          </Box>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export { drawerWidth, collapsedWidth };

export default AdminSidebar;
