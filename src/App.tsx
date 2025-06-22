import React from 'react';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BrowserRouter, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { UserProvider, useUser } from './hooks/useUser';
import { ProductsProvider } from './context/Product';
import AppRoutes from './routes';
import { lightTheme } from './theme';
import { NotificationProvider } from './context/NotificationContext';
import { AccountProvider } from './context/Account';

const AppContent = () => {
  return (
    <>
      <AppRoutes />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <NotificationProvider>
          <AuthProvider>
            <AccountProvider>
              <UserProvider>
                <ProductsProvider>
                  <BrowserRouter>
                    <AppContent />
                  </BrowserRouter>
                </ProductsProvider>
              </UserProvider>
            </AccountProvider>
          </AuthProvider>
        </NotificationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
