import { Container, Box, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  [theme.breakpoints.up('sm')]: {
    marginLeft: '240px',
  },
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const AdminMainContent = () => {
  return (
    <Main>
      <Box component="div" sx={{ height: '64px' }} /> {/* Toolbar spacer */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </Main>
  );
};
