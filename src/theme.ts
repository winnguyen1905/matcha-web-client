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
      'Inter',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
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
      'Inter',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// Helper to get theme by mode
export const getTheme = (mode: 'light' | 'dark') => (mode === 'dark' ? darkTheme : lightTheme);
