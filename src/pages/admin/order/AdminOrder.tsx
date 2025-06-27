import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar,
  TablePagination,
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Avatar,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as ExportIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
  Assignment as OrderIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ShoppingCart as CartIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { OrderStatistics, useOrders } from '../../../hooks/Order';
import { useAccount } from '../../../hooks/Account';
import { useProducts } from '../../../hooks/Product';
import { useDiscounts } from '../../../hooks/Discount';
import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  Currency,
  ShippingAddress,
  BillingAddress,
} from '../../../lib/schema';
import type { UserAccount } from '../../../hooks/Account';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface OrderFilters {
  status: OrderStatus | 'ALL';
  paymentStatus: PaymentStatus | 'ALL';
  paymentMethod: PaymentMethod | 'ALL';
  dateFrom: Date | null;
  dateTo: Date | null;
  searchTerm: string;
  userId: string;
}

const AdminOrderPage: React.FC = () => {
  const {
    orders,
    loading,
    error,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    refundOrder,
    getOrderItems,
    getOrderStatistics,
    deleteOrder,
    init,
    refreshOrders,
    bulkUpdateOrderStatus,
    bulkDeleteOrders,
  } = useOrders();

  const { users, listUsers } = useAccount();
  const { products } = useProducts();
  const { discounts } = useDiscounts();

  // State management
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'info' | 'success' | 'error' | 'warning' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  
  // Filters
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'ALL',
    paymentStatus: 'ALL',
    paymentMethod: 'ALL',
    dateFrom: null,
    dateTo: null,
    searchTerm: '',
    userId: '',
  });

  // Debounced search function
  const debouncedSearch = useCallback((searchTerm: string) => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchTerm }));
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          init(),
          listUsers(),
          loadStatistics(),
        ]);
      } catch (error) {
        showSnackbar('Failed to load data', 'error');
      }
    };
    loadData();
  }, []);

  const loadStatistics = async () => {
    try {
      const stats = await getOrderStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    // Helper to safely parse address if it's stored as a JSON string
    const parseAddress = (addr: any): { fullName?: string; phone?: string } => {
      if (!addr) return {};
      if (typeof addr === 'string') {
        try {
          return JSON.parse(addr);
        } catch {
          return {};
        }
      }
      return addr as any;
    };

    return orders.filter(order => {
      // Status filter
      if (filters.status !== 'ALL' && order.status !== filters.status) return false;

      // Payment status filter
      if (filters.paymentStatus !== 'ALL' && order.paymentStatus !== filters.paymentStatus) return false;

      // Payment method filter
      if (filters.paymentMethod !== 'ALL' && order.paymentMethod !== filters.paymentMethod) return false;

      // Date filters
      if (filters.dateFrom && new Date(order.createdAt) < filters.dateFrom) return false;
      if (filters.dateTo && new Date(order.createdAt) > filters.dateTo) return false;

      // User filter (early exit to avoid extra processing)
      if (filters.userId && order.userId !== filters.userId) return false;

      // Search term
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const { fullName = '', phone = '' } = parseAddress(order.shippingAddress);

        return (
          order.orderCode.toLowerCase().includes(term) ||
          order.userId.toLowerCase().includes(term) ||
          fullName.toLowerCase().includes(term) ||
          phone.includes(term)
        );
      }

      return true;
    });
  }, [orders, filters]);

  // Pagination
  const paginatedOrders = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredOrders, page, rowsPerPage]);

  // Event handlers
  const showSnackbar = (message: string, severity: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleViewOrder = async (order: Order) => {
    try {
      setSelectedOrder(order);
      const items = await getOrderItems(order.$id);
      setOrderItems(items);
      setOrderDialogOpen(true);
    } catch (error) {
      showSnackbar('Failed to load order details', 'error');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showSnackbar('Order status updated successfully', 'success');
      await refreshOrders();
      await loadStatistics();
    } catch (error) {
      showSnackbar('Failed to update order status', 'error');
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newStatus: PaymentStatus) => {
    try {
      await updatePaymentStatus(orderId, newStatus);
      showSnackbar('Payment status updated successfully', 'success');
      await refreshOrders();
    } catch (error) {
      showSnackbar('Failed to update payment status', 'error');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      showSnackbar('Order cancelled successfully', 'success');
      await refreshOrders();
      await loadStatistics();
    } catch (error) {
      showSnackbar('Failed to cancel order', 'error');
    }
  };

  const handleRefundOrder = async (orderId: string, amount?: number) => {
    try {
      await refundOrder(orderId, amount);
      showSnackbar('Order refunded successfully', 'success');
      await refreshOrders();
    } catch (error) {
      showSnackbar('Failed to refund order', 'error');
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    try {
      await deleteOrder(selectedOrder.$id);
      showSnackbar('Order deleted successfully', 'success');
      setDeleteDialogOpen(false);
      setSelectedOrder(null);
      await refreshOrders();
      await loadStatistics();
    } catch (error) {
      showSnackbar('Failed to delete order', 'error');
    }
  };

  const handleBulkStatusUpdate = async (status: OrderStatus) => {
    try {
      await bulkUpdateOrderStatus(selectedOrders, status);
      showSnackbar(`${selectedOrders.length} orders updated successfully`, 'success');
      setSelectedOrders([]);
      setBulkMenuAnchor(null);
      await refreshOrders();
      await loadStatistics();
    } catch (error) {
      showSnackbar('Failed to update orders', 'error');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteOrders(selectedOrders);
      showSnackbar(`${selectedOrders.length} orders deleted successfully`, 'success');
      setSelectedOrders([]);
      setBulkMenuAnchor(null);
      await refreshOrders();
      await loadStatistics();
    } catch (error) {
      showSnackbar('Failed to delete orders', 'error');
    }
  };

  const getStatusColor = (status: OrderStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'PROCESSING': return 'info';
      case 'SHIPPED': return 'primary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      case 'REFUNDED': return 'secondary';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'PAID': return 'success';
      case 'FAILED': return 'error';
      case 'REFUNDED': return 'secondary';
      case 'PARTIALLY_REFUNDED': return 'info';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: Currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserName = (userId: string) => {
    const user = users.find((u: UserAccount) => u.$id === userId);
    return user?.name || 'Unknown User';
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.$id === productId);
    return product?.name || 'Unknown Product';
  };

  const renderStatisticsCards = () => {
    if (!statistics) return null;

    const cards = [
      {
        title: 'Total Orders',
        value: statistics.totalOrders.toLocaleString(),
        icon: <OrderIcon />,
        color: '#1976d2',
      },
      {
        title: 'Total Revenue',
        value: formatCurrency(statistics.totalRevenue),
        icon: <MoneyIcon />,
        color: '#388e3c',
      },
      {
        title: 'Pending Orders',
        value: statistics.pendingOrders.toLocaleString(),
        icon: <TrendingUpIcon />,
        color: '#f57c00',
      },
      {
        title: 'Completed Orders',
        value: statistics.completedOrders.toLocaleString(),
        icon: <CheckIcon />,
        color: '#4caf50',
      },
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {card.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: card.color, width: 56, height: 56 }}>
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderFilters = () => (
    <Card sx={{ mb: 3 }}>
      <CardHeader 
        title="Filters" 
        action={
          <IconButton onClick={() => setFilters({
            status: 'ALL',
            paymentStatus: 'ALL',
            paymentMethod: 'ALL',
            dateFrom: null,
            dateTo: null,
            searchTerm: '',
            userId: '',
          })}>
            <RefreshIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
                         <TextField
               fullWidth
               label="Search"
               placeholder="Order code, user ID, name, phone..."
               onChange={(e) => debouncedSearch(e.target.value)}
               InputProps={{
                 startAdornment: <SearchIcon />,
               }}
             />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as OrderStatus | 'ALL' }))}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="PROCESSING">Processing</MenuItem>
                <MenuItem value="SHIPPED">Shipped</MenuItem>
                <MenuItem value="DELIVERED">Delivered</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                <MenuItem value="REFUNDED">Refunded</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={filters.paymentStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value as PaymentStatus | 'ALL' }))}
              >
                <MenuItem value="ALL">All Payment Statuses</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="PAID">Paid</MenuItem>
                <MenuItem value="FAILED">Failed</MenuItem>
                <MenuItem value="REFUNDED">Refunded</MenuItem>
                <MenuItem value="PARTIALLY_REFUNDED">Partially Refunded</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={filters.paymentMethod}
                onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value as PaymentMethod | 'ALL' }))}
              >
                <MenuItem value="ALL">All Methods</MenuItem>
                <MenuItem value="COD">Cash on Delivery</MenuItem>
                <MenuItem value="ONLINE">Online Payment</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <Select
                value={filters.userId}
                onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              >
                <MenuItem value="">All Users</MenuItem>
                {users.map((user: UserAccount) => (
                  <MenuItem key={user.$id} value={user.$id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
                 <LocalizationProvider dateAdapter={AdapterDateFns}>
           <Grid container spacing={2} sx={{ mt: 1 }}>
             <Grid item xs={12} md={3}>
               <DatePicker
                 label="Date From"
                 value={filters.dateFrom}
                 onChange={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                 slotProps={{
                   textField: { fullWidth: true }
                 }}
               />
             </Grid>
             <Grid item xs={12} md={3}>
               <DatePicker
                 label="Date To"
                 value={filters.dateTo}
                 onChange={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                 slotProps={{
                   textField: { fullWidth: true }
                 }}
               />
             </Grid>
           </Grid>
         </LocalizationProvider>
      </CardContent>
    </Card>
  );

  const renderOrdersTable = () => (
    <Card>
      <CardHeader
        title={`Orders (${filteredOrders.length})`}
        action={
          <Stack direction="row" spacing={1}>
            {selectedOrders.length > 0 && (
              <Button
                variant="outlined"
                onClick={(e) => setBulkMenuAnchor(e.currentTarget)}
                startIcon={<MoreVertIcon />}
              >
                Bulk Actions ({selectedOrders.length})
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={refreshOrders}
            >
              Refresh
            </Button>
          </Stack>
        }
      />
      <CardContent>
        {loading && <LinearProgress />}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedOrders.length > 0 && selectedOrders.length < paginatedOrders.length}
                    checked={paginatedOrders.length > 0 && selectedOrders.length === paginatedOrders.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(paginatedOrders.map(order => order.$id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Order Code</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.$id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedOrders.includes(order.$id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders(prev => [...prev, order.$id]);
                        } else {
                          setSelectedOrders(prev => prev.filter(id => id !== order.$id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {order.orderCode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {getUserName(order.userId)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {order.shippingAddress.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Chip
                        label={order.paymentStatus}
                        color={getPaymentStatusColor(order.paymentStatus)}
                        size="small"
                      />
                      <Typography variant="caption" color="textSecondary">
                        {order.paymentMethod}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(order.finalPrice, order.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewOrder(order)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedOrder(order);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </CardContent>
    </Card>
  );

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <Dialog
        open={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Order Details - {selectedOrder.orderCode}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.$id, e.target.value as OrderStatus)}
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="PROCESSING">Processing</MenuItem>
                  <MenuItem value="SHIPPED">Shipped</MenuItem>
                  <MenuItem value="DELIVERED">Delivered</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                  <MenuItem value="REFUNDED">Refunded</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Payment</InputLabel>
                <Select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => handlePaymentStatusChange(selectedOrder.$id, e.target.value as PaymentStatus)}
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="PAID">Paid</MenuItem>
                  <MenuItem value="FAILED">Failed</MenuItem>
                  <MenuItem value="REFUNDED">Refunded</MenuItem>
                  <MenuItem value="PARTIALLY_REFUNDED">Partially Refunded</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
            <Tab label="General" />
            <Tab label="Items" />
            <Tab label="Shipping" />
            <Tab label="Payment" />
          </Tabs>

          <TabPanel value={currentTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Order Information" />
                  <CardContent>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Order Code:</Typography>
                        <Typography variant="body2" fontWeight="bold">{selectedOrder.orderCode}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Customer:</Typography>
                        <Typography variant="body2">{getUserName(selectedOrder.userId)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Date:</Typography>
                        <Typography variant="body2">{formatDate(selectedOrder.createdAt)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Payment Method:</Typography>
                        <Typography variant="body2">{selectedOrder.paymentMethod}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Currency:</Typography>
                        <Typography variant="body2">{selectedOrder.currency}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Order Summary" />
                  <CardContent>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Subtotal:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.subtotal, selectedOrder.currency)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Tax:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.taxAmount, selectedOrder.currency)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Discount:</Typography>
                        <Typography variant="body2" color="success.main">-{formatCurrency(selectedOrder.discountTotal, selectedOrder.currency)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Shipping:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.shippingAmount, selectedOrder.currency)}</Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6" fontWeight="bold">{formatCurrency(selectedOrder.finalPrice, selectedOrder.currency)}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Variant</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.$id}>
                      <TableCell>{getProductName(item.productId)}</TableCell>
                      <TableCell>{item.productVariantId}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.unitPrice, selectedOrder.currency)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.discountAmount, selectedOrder.currency)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.total, selectedOrder.currency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Shipping Address" />
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="body2"><strong>{selectedOrder.shippingAddress.fullName}</strong></Typography>
                      <Typography variant="body2">{selectedOrder.shippingAddress.phone}</Typography>
                      <Typography variant="body2">{selectedOrder.shippingAddress.address}</Typography>
                      <Typography variant="body2">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                      </Typography>
                      <Typography variant="body2">{selectedOrder.shippingAddress.country}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              {selectedOrder.billingAddress && !selectedOrder.billingAddress.sameAsShipping && (
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Billing Address" />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2"><strong>{selectedOrder.billingAddress.fullName}</strong></Typography>
                        <Typography variant="body2">{selectedOrder.billingAddress.address}</Typography>
                        <Typography variant="body2">
                          {selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state} {selectedOrder.billingAddress.postalCode}
                        </Typography>
                        <Typography variant="body2">{selectedOrder.billingAddress.country}</Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          <TabPanel value={currentTab} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => handleCancelOrder(selectedOrder.$id)}
                      disabled={selectedOrder.status === 'CANCELLED' || selectedOrder.status === 'DELIVERED'}
                    >
                      Cancel Order
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={() => handleRefundOrder(selectedOrder.$id)}
                      disabled={selectedOrder.paymentStatus !== 'PAID'}
                    >
                      Full Refund
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={() => handleRefundOrder(selectedOrder.$id, selectedOrder.finalPrice / 2)}
                      disabled={selectedOrder.paymentStatus !== 'PAID'}
                    >
                      Partial Refund (50%)
                    </Button>
                  </Box>
                  {selectedOrder.notes && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Notes:</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedOrder.notes}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Order Management
      </Typography>

      {renderStatisticsCards()}
      {renderFilters()}
      {renderOrdersTable()}
      {renderOrderDetails()}

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkMenuAnchor}
        open={Boolean(bulkMenuAnchor)}
        onClose={() => setBulkMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleBulkStatusUpdate('PROCESSING')}>
          <ListItemIcon><CheckIcon /></ListItemIcon>
          <ListItemText>Mark as Processing</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkStatusUpdate('SHIPPED')}>
          <ListItemIcon><ShippingIcon /></ListItemIcon>
          <ListItemText>Mark as Shipped</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkStatusUpdate('DELIVERED')}>
          <ListItemIcon><CheckIcon /></ListItemIcon>
          <ListItemText>Mark as Delivered</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkStatusUpdate('CANCELLED')}>
          <ListItemIcon><CancelIcon /></ListItemIcon>
          <ListItemText>Cancel Orders</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleBulkDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
          <ListItemText>Delete Orders</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete order {selectedOrder?.orderCode}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteOrder} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminOrderPage;
