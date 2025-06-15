import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BrowserRouter, Routes } from 'react-router-dom';
import AppRoutes from './routes';
import theme from './theme';

const App: React.FC = () => {
  return (
    // <ThemeProvider theme={theme}>
    <>
      {/* <CssBaseline /> */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <Routes>
          </Routes>
          <AppRoutes />
        </BrowserRouter>
      </LocalizationProvider>
    </>
    // </ThemeProvider>
  );
};

export default App;
