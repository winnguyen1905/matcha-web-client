import { createTheme, Theme } from '@mui/material/styles';

// Centralized MUI theme configuration
// Adjust the palette, typography, and other options as needed

// Light theme
export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#047857', // emerald-700
    },
    secondary: {
      main: '#14b8a6', // teal-500
    },
    background: {
      default: '#f0fdf4', // green-50
    },
  },
  typography: {
    fontFamily: [
      'Nunito Sans',
      'Source Sans Pro',
      'Work Sans',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    fontWeightLight: 200,
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 500,
  },
});

// Dark theme
export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#14b8a6', // teal-500
    },
    secondary: {
      main: '#047857', // emerald-700
    },
    background: {
      default: '#18181b', // zinc-900
      paper: '#23272f',
    },
  },
  typography: {
    fontFamily: [
      'Nunito Sans',
      'Source Sans Pro',
      'Work Sans',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    fontWeightLight: 200,
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 500,
  },
});

// Helper to get theme by mode
export const getTheme = (mode: 'light' | 'dark') => (mode === 'dark' ? darkTheme : lightTheme);
