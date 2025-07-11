import React, { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Grid,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Popover,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled, useTheme } from '@mui/material/styles';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  MoreVertical,
  RefreshCw,
  Download,
  Calendar,
  Award,
  Tag,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Import hooks
import { useProducts } from '../../../hooks/Product';
import { useOrders } from '../../../hooks/Order';
import { useDiscounts } from '../../../hooks/Discount';
import { useAccount } from '../../../hooks/Account';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.primary.main}05 100%)`,
  border: `1px solid ${theme.palette.primary.main}20`,
  borderRadius: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[12],
    background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}08 100%)`,
  },
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  height: 300,
  width: '100%',
  '& .recharts-wrapper': {
    fontSize: theme.typography.body2.fontSize,
  },
}));

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  avgOrderValue: number;
}

interface ChartData {
  revenue: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  orderStatus: Array<{ name: string; value: number; color: string }>;
  discountUsage: Array<{ month: string; savings: number; usage: number }>;
}

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const { products, init: initProducts } = useProducts();
  const { orders, getOrderStatistics, init: initOrders } = useOrders();
  const { getDiscountStatistics, init: initDiscounts } = useDiscounts();
  const { users, listUsers } = useAccount();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    avgOrderValue: 0,
  });
  const [chartData, setChartData] = useState<ChartData>({
    revenue: [],
    topProducts: [],
    orderStatus: [],
    discountUsage: [],
  });
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [dateRangeAnchor, setDateRangeAnchor] = useState<null | HTMLElement>(null);
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Default to last 30 days
    return date;
  });
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  // Chart colors
  const colors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
  };

  const pieColors = [colors.primary, colors.secondary, colors.success, colors.warning, colors.error];

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      generateChartData();
    }
  }, [startDate, endDate]);

  const initializeData = async () => {
    try {
      setLoading(true);
      
      // Initialize all data sources
      await Promise.all([
        initProducts(),
        initOrders(),
        initDiscounts(),
        listUsers(),
      ]);

      // Calculate dashboard statistics
      await calculateStats();
      await generateChartData();
    } catch (error) {
      console.error('Error initializing dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async () => {
    try {
      const orderStats = await getOrderStatistics();
      const discountStats = await getDiscountStatistics();
      
      // Mock growth calculations (in real app, compare with previous period)
      const revenueGrowth = Math.random() * 20 - 5; // -5% to +15%
      const ordersGrowth = Math.random() * 25 - 10; // -10% to +15%

      setStats({
        totalRevenue: orderStats.totalRevenue,
        totalOrders: orderStats.totalOrders,
        totalProducts: products.length,
        totalUsers: users.length,
        revenueGrowth,
        ordersGrowth,
        avgOrderValue: orderStats.averageOrderValue,
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const generateChartData = async () => {
    try {
      // Generate revenue trend data based on selected date range
      const daysDiff = startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 30;
      const dataPoints = Math.min(Math.max(daysDiff, 7), 30); // Between 7 and 30 data points
      
      const revenueData = Array.from({ length: dataPoints }, (_, i) => {
        const date = new Date(startDate || new Date());
        date.setDate(date.getDate() + (i * daysDiff / dataPoints));
        
        // Generate more realistic data based on date range
        const baseRevenue = 15000 + (Math.random() * 35000);
        const seasonalMultiplier = 1 + 0.3 * Math.sin((i / dataPoints) * Math.PI * 2); // Seasonal variation
        
        return {
          date: date.toLocaleDateString('en-US', { 
            month: daysDiff > 60 ? 'short' : 'numeric',
            day: daysDiff <= 60 ? 'numeric' : undefined 
          }),
          revenue: Math.floor(baseRevenue * seasonalMultiplier),
          orders: Math.floor((baseRevenue * seasonalMultiplier) / 150) + Math.floor(Math.random() * 50),
        };
      });

      // Generate top products data
      const topProductsData = products
        .slice(0, 8)
        .map((product, index) => ({
          name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
          sales: Math.floor(Math.random() * 500) + 100,
          revenue: Math.floor(Math.random() * 10000) + 2000,
        }))
        .sort((a, b) => b.sales - a.sales);

      // Generate order status data
      const orderStatusData = [
        { name: 'Completed', value: Math.floor(Math.random() * 200) + 100, color: colors.success },
        { name: 'Pending', value: Math.floor(Math.random() * 50) + 20, color: colors.warning },
        { name: 'Processing', value: Math.floor(Math.random() * 30) + 10, color: colors.info },
        { name: 'Cancelled', value: Math.floor(Math.random() * 20) + 5, color: colors.error },
      ];

      // Generate discount usage data based on selected date range
      const discountDataPoints = Math.min(dataPoints, 12); // Max 12 points for discount chart
      const discountData = Array.from({ length: discountDataPoints }, (_, i) => {
        const date = new Date(startDate || new Date());
        date.setDate(date.getDate() + (i * daysDiff / discountDataPoints));
        
        // Generate realistic discount data
        const baseSavings = 1500 + (Math.random() * 3500);
        const discountTrend = 1 + 0.2 * Math.sin((i / discountDataPoints) * Math.PI); // Growth trend
        
        return {
          month: date.toLocaleDateString('en-US', { 
            month: daysDiff > 60 ? 'short' : 'numeric',
            day: daysDiff <= 30 ? 'numeric' : undefined 
          }),
          savings: Math.floor(baseSavings * discountTrend),
          usage: Math.floor((baseSavings * discountTrend) / 25) + Math.floor(Math.random() * 30),
        };
      });

      setChartData({
        revenue: revenueData,
        topProducts: topProductsData,
        orderStatus: orderStatusData,
        discountUsage: discountData,
      });
    } catch (error) {
      console.error('Error generating chart data:', error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDateRangeClick = (event: React.MouseEvent<HTMLElement>) => {
    setDateRangeAnchor(event.currentTarget);
  };

  const handleDateRangeClose = () => {
    setDateRangeAnchor(null);
  };

  const handleQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start);
    setEndDate(end);
    handleDateRangeClose();
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return 'Select Date Range';
    
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const isCurrentYear = startDate.getFullYear() === new Date().getFullYear() && 
                          endDate.getFullYear() === new Date().getFullYear();
    
    let dateFormat: Intl.DateTimeFormatOptions;
    
    if (daysDiff <= 7) {
      // For week or less, show day and month
      dateFormat = { month: 'short', day: 'numeric' };
    } else if (daysDiff <= 90 && isCurrentYear) {
      // For up to 3 months in current year, show month and day
      dateFormat = { month: 'short', day: 'numeric' };
    } else if (daysDiff <= 365 && isCurrentYear) {
      // For current year, show month only
      dateFormat = { month: 'short' };
    } else {
      // For longer periods or different years, include year
      dateFormat = { month: 'short', year: 'numeric' };
    }
    
    const start = startDate.toLocaleDateString('en-US', dateFormat);
    const end = endDate.toLocaleDateString('en-US', dateFormat);
    
    // Add quick labels for common ranges
    if (daysDiff === 7) return 'Last 7 days';
    if (daysDiff === 30) return 'Last 30 days';
    if (daysDiff === 90) return 'Last 90 days';
    if (daysDiff === 365) return 'Last year';
    
    return `${start} - ${end}`;
  };

  const MetricCardComponent = ({ 
    title, 
    value, 
    growth, 
    icon, 
    color 
  }: { 
    title: string; 
    value: string | number; 
    growth?: number; 
    icon: React.ReactNode; 
    color: string;
  }) => (
    <MetricCard>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Avatar sx={{ bgcolor: `${color}20`, color }}>
          {icon}
        </Avatar>
        {growth !== undefined && (
          <Chip
            size="small"
            icon={growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            label={`${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`}
            color={growth >= 0 ? 'success' : 'error'}
            variant="outlined"
          />
        )}
      </Box>
      <Typography variant="h4" component="div" fontWeight="bold" color={color}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        {title}
      </Typography>
    </MetricCard>
  );

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Dashboard Overview
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Calendar size={16} />}
            onClick={handleDateRangeClick}
            size="small"
          >
            {formatDateRange()}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={initializeData}
            size="small"
          >
            Refresh
          </Button>
          <IconButton onClick={handleMenuClick}>
            <MoreVertical />
          </IconButton>
          
          {/* Date Range Picker Popover */}
          <Popover
            open={Boolean(dateRangeAnchor)}
            anchorEl={dateRangeAnchor}
            onClose={handleDateRangeClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Box p={3} minWidth={300}>
              <Typography variant="h6" gutterBottom>
                Select Date Range
              </Typography>
              
              {/* Quick Select Buttons */}
              <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                <Chip
                  label="Last 7 days"
                  onClick={() => handleQuickDateRange(7)}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label="Last 30 days"
                  onClick={() => handleQuickDateRange(30)}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label="Last 90 days"
                  onClick={() => handleQuickDateRange(90)}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label="Last year"
                  onClick={() => handleQuickDateRange(365)}
                  variant="outlined"
                  size="small"
                />
              </Stack>

              {/* Custom Date Pickers */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={2}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleDateRangeClose}
                    size="small"
                  >
                    Apply Range
                  </Button>
                </Stack>
              </LocalizationProvider>
            </Box>
          </Popover>

          {/* Export Menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Download size={16} style={{ marginRight: 8 }} />
              Export Data
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCardComponent
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            growth={stats.revenueGrowth}
            icon={<DollarSign />}
            color={colors.success}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCardComponent
            title="Total Orders"
            value={stats.totalOrders}
            growth={stats.ordersGrowth}
            icon={<ShoppingCart />}
            color={colors.primary}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCardComponent
            title="Products"
            value={stats.totalProducts}
            icon={<Package />}
            color={colors.info}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCardComponent
            title="Active Users"
            value={stats.totalUsers}
            icon={<Users />}
            color={colors.secondary}
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Revenue Trend */}
        <Grid item xs={12} lg={8}>
          <StyledCard>
            <CardHeader
              title="Revenue & Orders Trend"
              subheader={`Performance for ${formatDateRange()}`}
              action={
                <Chip icon={<TrendingUp size={16} />} label="Growth" color="success" variant="outlined" />
              }
            />
            <CardContent>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.revenue}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: theme.spacing(1),
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={colors.primary}
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                      name="Revenue ($)"
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke={colors.secondary}
                      strokeWidth={2}
                      name="Orders"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Order Status Distribution */}
        <Grid item xs={12} lg={4}>
          <StyledCard>
            <CardHeader
              title="Order Status"
              subheader="Current distribution"
              action={<Activity size={20} color={colors.primary} />}
            />
            <CardContent>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.orderStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.orderStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Top Selling Products */}
        <Grid item xs={12} lg={8}>
          <StyledCard>
            <CardHeader
              title="Best Selling Products"
              subheader="Top performers by sales volume"
              action={<Award size={20} color={colors.warning} />}
            />
            <CardContent>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.topProducts} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis type="number" stroke={theme.palette.text.secondary} />
                    <YAxis dataKey="name" type="category" width={120} stroke={theme.palette.text.secondary} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: theme.spacing(1),
                      }}
                    />
                    <Bar dataKey="sales" fill={colors.primary} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Discount Usage */}
        <Grid item xs={12} lg={4}>
          <StyledCard>
            <CardHeader
              title="Discount Usage"
              subheader={`Savings trend for ${formatDateRange()}`}
              action={<Tag size={20} color={colors.warning} />}
            />
            <CardContent>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.discountUsage}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: theme.spacing(1),
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke={colors.warning}
                      strokeWidth={3}
                      name="Savings ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader title="Recent Activity" subheader="Latest system updates" />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: colors.success + '20', color: colors.success, width: 32, height: 32 }}>
                      <ShoppingCart size={16} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="New order #12345 received"
                    secondary="2 minutes ago"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: colors.info + '20', color: colors.info, width: 32, height: 32 }}>
                      <Users size={16} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="New user registration"
                    secondary="15 minutes ago"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: colors.warning + '20', color: colors.warning, width: 32, height: 32 }}>
                      <Package size={16} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Product inventory updated"
                    secondary="1 hour ago"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: colors.primary + '20', color: colors.primary, width: 32, height: 32 }}>
                      <Tag size={16} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Discount code applied 25 times"
                    secondary="2 hours ago"
                  />
                </ListItem>
              </List>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader title="Quick Actions" subheader="Frequently used operations" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Package />}
                    sx={{ mb: 2, justifyContent: 'flex-start' }}
                  >
                    Add Product
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ShoppingCart />}
                    sx={{ mb: 2, justifyContent: 'flex-start' }}
                  >
                    View Orders
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Users />}
                    sx={{ mb: 2, justifyContent: 'flex-start' }}
                  >
                    Manage Users
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Tag />}
                    sx={{ mb: 2, justifyContent: 'flex-start' }}
                  >
                    Create Discount
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Average Order Value
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      ${stats.avgOrderValue.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
