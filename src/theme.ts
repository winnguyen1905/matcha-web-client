import { createTheme } from '@mui/material/styles';

// Centralized MUI theme configuration
// Adjust the palette, typography, and other options as needed
const theme = createTheme({
  palette: {
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

export default theme;
