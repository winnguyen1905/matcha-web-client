import React from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const DashboardPage: React.FC = () => {
  const stats = [
    { title: 'Total Products', value: '1,234' },
    { title: 'Total Users', value: '567' },
    { title: 'Total Orders', value: '890' },
    { title: 'Revenue', value: '$12,345' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Item>
              <Typography variant="h6" component="div">
                {stat.title}
              </Typography>
              <Typography variant="h4" component="div" sx={{ mt: 1, fontWeight: 'bold' }}>
                {stat.value}
              </Typography>
            </Item>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ textAlign: 'left', mt: 2 }}>
              <Typography>• New order #1234 received</Typography>
              <Typography>• User John Doe registered</Typography>
              <Typography>• Product "Matcha Latte" updated</Typography>
            </Box>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography>• Add New Product</Typography>
              <Typography>• View Orders</Typography>
              <Typography>• Manage Users</Typography>
            </Box>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
