import React from 'react';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BrowserRouter, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { UserProvider, useUser } from './hooks/useUser';
import AppRoutes from './routes';
import theme from './theme';

// const Navbar = () => {
//   const { current: user, logout } = useUser();
//   const { isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   // Don't show navbar on login/register pages
//   if (['/login', '/register'].includes(location.pathname)) {
//     return null;
//   }

//   return (
//     <AppBar position="static" color="default" elevation={0} sx={{ mb: 4 }}>
//       <Container maxWidth="lg">
//         <Toolbar disableGutters>
//           <Typography
//             variant="h6"
//             component={RouterLink}
//             to="/"
//             sx={{
//               flexGrow: 1,
//               textDecoration: 'none',
//               color: 'inherit',
//               fontWeight: 700,
//             }}
//           >
//             Trà Matcha A Hiếu
//           </Typography>

//           {isAuthenticated ? (
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <Button
//                 component={RouterLink}
//                 to="/profile"
//                 color="inherit"
//               >
//                 {user?.email || 'Profile'}
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="inherit"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </Button>
//             </Box>
//           ) : (
//             <Button
//               component={RouterLink}
//               to="/login"
//               color="inherit"
//               variant="outlined"
//             >
//               Login
//             </Button>
//           )}
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// };

const AppContent = () => {
  return (
    <>
    <AppRoutes />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <UserProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </UserProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
