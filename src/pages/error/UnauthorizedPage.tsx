import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <LockIcon sx={{ fontSize: 80, color: 'error.main' }} />
        
        <Typography variant="h4" component="h1" gutterBottom>
          Truy cập bị từ chối
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={handleGoBack}>
            Quay lại
          </Button>
          <Button variant="contained" onClick={handleGoHome}>
            Về trang chủ
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage; 
