import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import { Dashboard, ShoppingCart, People, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminSidebar = ({ mobileOpen, onClose, onLogout }: AdminSidebarProps) => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { text: 'Products', icon: <ShoppingCart />, path: '/admin/products' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={onLogout}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="admin navigation"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

// Box and Drawer are already imported from @mui/material
