import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { AuthProvider } from './hooks/useAuth';
import { UserProvider } from './hooks/useUser';
import { ProductsProvider } from './hooks/Product';
import AppRoutes from './routes';
import { lightTheme } from './theme';
import { NotificationProvider } from './context/NotificationContext';
import { AccountProvider } from './hooks/Account';
import { DiscountsProvider } from './hooks/Discount';

const AppContent = () => {
  return (
    <>
      <AppRoutes />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <DiscountsProvider>
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
        </DiscountsProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
