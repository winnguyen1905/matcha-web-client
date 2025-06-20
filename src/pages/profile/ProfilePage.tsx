import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { Button, Container, Typography, Box, Paper, Divider, CircularProgress } from '@mui/material';

const ProfilePage: React.FC = () => {
  const { current: user, logout, isLoading } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box my={4} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Not Logged In
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/auth/login')}
          >
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box mb={2}>
            <Typography variant="subtitle1" color="textSecondary">Name</Typography>
            <Typography variant="body1">{user.name || 'N/A'}</Typography>
          </Box>
          
          <Box mb={2}>
            <Typography variant="subtitle1" color="textSecondary">Email</Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Box>
          
          <Box mb={2}>
            <Typography variant="subtitle1" color="textSecondary">Account Status</Typography>
            <Typography variant="body1">
              {user.emailVerification ? 'Verified' : 'Not Verified'}
            </Typography>
          </Box>
          
          <Box mt={4}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleLogout}
              fullWidth
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;
