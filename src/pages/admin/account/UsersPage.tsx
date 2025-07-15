import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, UserAccount, UpdateUserData, Labels, CreateUserAccountData, SearchFilters } from '../../../hooks/Account';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Snackbar,
  Collapse,
  Divider,
  Grid,
  Autocomplete,
  Tooltip,
} from '@mui/material';
import { 
  Search, 
  MoreVert, 
  Edit, 
  Delete, 
  Block, 
  CheckCircle,
  Refresh,
  Add,
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  CalendarToday
} from '@mui/icons-material';
import { green, red, orange, blue } from '@mui/material/colors';

const UsersPage: React.FC = () => {
  const { 
    users, 
    loading, 
    error, 
    listUsers, 
    searchUsers, 
    createUserAccount,
    updateUser, 
    deleteUser, 
    updateUserRole, 
    updateUserStatus,
  } = useAccount();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateUserData>({});
  const [createFormData, setCreateFormData] = useState<CreateUserAccountData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    labels: ['CUSTOMER'],
    status: true,
    isEmailVerified: false,
  });
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadUsers = useCallback(async () => {
    try {
      await listUsers();
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }, [listUsers]);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Debounced search function
  const performSearch = useCallback(async () => {
    try {
      if (searchTerm.trim() || Object.keys(activeFilters).length > 0) {
        const filters: SearchFilters = {
          ...activeFilters,
          searchText: searchTerm.trim() || undefined,
        };
        
        // Remove undefined values
        const cleanFilters: SearchFilters = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== 'ALL') {
            cleanFilters[key as keyof SearchFilters] = value as any;
          }
        });
        
        if (Object.keys(cleanFilters).length > 0) {
          await searchUsers(cleanFilters);
        } else {
          await loadUsers();
        }
      } else {
        await loadUsers();
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [searchTerm, activeFilters, searchUsers, loadUsers]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [performSearch]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: UserAccount) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditUser = () => {
    if (selectedUser) {
      setEditFormData({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        phone: selectedUser.phone || '',
        address: selectedUser.address || '',
        status: selectedUser.status,
        labels: selectedUser.labels || ['CUSTOMER'],
        isEmailVerified: selectedUser.isEmailVerified,
      });
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCreateUser = async () => {
    try {
      // Validate required fields
      if (!createFormData.name.trim()) {
        showNotification('Name is required', 'error');
        return;
      }
      if (!createFormData.email.trim()) {
        showNotification('Email is required', 'error');
        return;
      }
      if (!createFormData.password.trim()) {
        showNotification('Password is required', 'error');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createFormData.email.trim())) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }

      // Password validation
      if (createFormData.password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
      }

      await createUserAccount(createFormData);
      setCreateDialogOpen(false);
      setCreateFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        labels: ['CUSTOMER'],
        status: true,
        isEmailVerified: false,
      });
      showNotification(`User "${createFormData.name}" created successfully!`, 'success');
    } catch (error) {
      console.error('Failed to create user:', error);
      showNotification('Failed to create user. Please try again.', 'error');
    }
  };

  const handleUpdateUser = async () => {
    if (selectedUser && editFormData) {
      try {
        // Validate required fields
        if (!editFormData.name?.trim()) {
          showNotification('Name is required', 'error');
          return;
        }
        if (!editFormData.email?.trim()) {
          showNotification('Email is required', 'error');
          return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editFormData.email.trim())) {
          showNotification('Please enter a valid email address', 'error');
          return;
        }

        // Prepare update data
        const updateData: UpdateUserData = {
          name: editFormData.name.trim(),
          email: editFormData.email.trim(),
          phone: editFormData.phone?.trim() || '',
          address: editFormData.address?.trim() || '',
          status: editFormData.status ?? true,
          labels: editFormData.labels || ['CUSTOMER'],
          isEmailVerified: editFormData.isEmailVerified ?? false,
        };

        await updateUser(selectedUser.$id, updateData);
        setEditDialogOpen(false);
        setEditFormData({});
        showNotification(`User "${updateData.name}" updated successfully!`, 'success');
      } catch (error) {
        console.error('Failed to update user:', error);
        showNotification('Failed to update user. Please try again.', 'error');
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.$id);
        setDeleteDialogOpen(false);
        showNotification(`User "${selectedUser.name}" deleted successfully!`, 'success');
      } catch (error) {
        console.error('Failed to delete user:', error);
        showNotification('Failed to delete user. Please try again.', 'error');
      }
    }
  };

  const handleToggleStatus = async (user: UserAccount) => {
    try {
      await updateUserStatus(user.$id, !user.status);
      const action = !user.status ? 'activated' : 'deactivated';
      showNotification(`User "${user.name}" ${action} successfully!`, 'success');
    } catch (error) {
      console.error('Failed to update user status:', error);
      showNotification('Failed to update user status. Please try again.', 'error');
    }
  };

  const handleRoleChange = async (userId: string, role: Labels) => {
    try {
      await updateUserRole(userId, role);
      await loadUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? green[500] : red[500];
  };

  const getRoleColor = (labels: string[]) => {
    if (labels.includes('ADMIN')) return 'error';
    if (labels.includes('MANAGER')) return 'warning';
    return 'default';
  };

  const getRoleLabel = (labels: string[]) => {
    if (labels.includes('ADMIN')) return 'Admin';
    if (labels.includes('MANAGER')) return 'Manager';
    return 'Customer';
  };

  const filteredUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Calculate account statistics
  const accountStats = {
    total: users.length,
    active: users.filter(user => user.status).length,
    inactive: users.filter(user => !user.status).length,
    verified: users.filter(user => user.isEmailVerified).length,
    unverified: users.filter(user => !user.isEmailVerified).length,
    admins: users.filter(user => user.labels.includes('ADMIN')).length,
    managers: users.filter(user => user.labels.includes('MANAGER')).length,
    customers: users.filter(user => user.labels.includes('CUSTOMER')).length,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Users Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            Create Account
          </Button>
          <IconButton onClick={loadUsers} disabled={loading}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Account Statistics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {accountStats.total}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total Users
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main">
            {accountStats.active}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Active Users
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main">
            {accountStats.verified}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Email Verified
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="error.main">
            {accountStats.admins}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Administrators
          </Typography>
        </Paper>
      </Box>

      {/* Quick Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Quick Filters
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              Advanced Filters
            </Button>
            {Object.keys(activeFilters).length > 0 && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Clear />}
                onClick={() => {
                  setActiveFilters({});
                  setSearchTerm('');
                }}
                color="error"
              >
                Clear All
              </Button>
            )}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`All (${accountStats.total})`}
            onClick={() => {
              setActiveFilters({});
              setSearchTerm('');
            }}
            color="primary"
            variant={Object.keys(activeFilters).length === 0 ? "filled" : "outlined"}
          />
          <Chip 
            label={`Active (${accountStats.active})`}
            onClick={() => setActiveFilters({ status: true })}
            color="success"
            variant={activeFilters.status === true ? "filled" : "outlined"}
          />
          <Chip 
            label={`Inactive (${accountStats.inactive})`}
            onClick={() => setActiveFilters({ status: false })}
            color="error"
            variant={activeFilters.status === false ? "filled" : "outlined"}
          />
          <Chip
            label={`Verified (${accountStats.verified})`}
            onClick={() => setActiveFilters({ isEmailVerified: true })}
            color="warning"
            variant={activeFilters.isEmailVerified === true ? "filled" : "outlined"}
          />
          <Chip 
            label={`Unverified (${accountStats.unverified})`}
            onClick={() => setActiveFilters({ isEmailVerified: false })}
            color="default"
            variant={activeFilters.isEmailVerified === false ? "filled" : "outlined"}
          />
          <Chip 
            label={`Admins (${accountStats.admins})`}
            onClick={() => setActiveFilters({ role: 'ADMIN' })}
            color="error"
            variant={activeFilters.role === 'ADMIN' ? "filled" : "outlined"}
          />
          <Chip 
            label={`Managers (${accountStats.managers})`}
            onClick={() => setActiveFilters({ role: 'MANAGER' })}
            color="warning"
            variant={activeFilters.role === 'MANAGER' ? "filled" : "outlined"}
          />
          <Chip 
            label={`Customers (${accountStats.customers})`}
            onClick={() => setActiveFilters({ role: 'CUSTOMER' })}
            color="primary"
            variant={activeFilters.role === 'CUSTOMER' ? "filled" : "outlined"}
          />
        </Box>

        {/* Advanced Filters Panel */}
        <Collapse in={filtersOpen}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Advanced Search Options
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={activeFilters.status === undefined ? 'ALL' : activeFilters.status.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setActiveFilters(prev => ({
                      ...prev,
                      status: value === 'ALL' ? undefined : value === 'true'
                    }));
                  }}
                  label="Status"
                >
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="true">Active Only</MenuItem>
                  <MenuItem value="false">Inactive Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Email Status</InputLabel>
                <Select
                  value={activeFilters.isEmailVerified === undefined ? 'ALL' : activeFilters.isEmailVerified.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setActiveFilters(prev => ({
                      ...prev,
                      isEmailVerified: value === 'ALL' ? undefined : value === 'true'
                    }));
                  }}
                  label="Email Status"
                >
                  <MenuItem value="ALL">All Email Status</MenuItem>
                  <MenuItem value="true">Verified Only</MenuItem>
                  <MenuItem value="false">Unverified Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select
                  value={activeFilters.role || 'ALL'}
                  onChange={(e) => {
                    const value = e.target.value as Labels | 'ALL';
                    setActiveFilters(prev => ({
                      ...prev,
                      role: value === 'ALL' ? undefined : value
                    }));
                  }}
                  label="Role"
                >
                  <MenuItem value="ALL">All Roles</MenuItem>
                  <MenuItem value="CUSTOMER">Customer</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Login Status</InputLabel>
                <Select
                  value={activeFilters.hasLoggedIn === undefined ? 'ALL' : activeFilters.hasLoggedIn.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setActiveFilters(prev => ({
                      ...prev,
                      hasLoggedIn: value === 'ALL' ? undefined : value === 'true'
                    }));
                  }}
                  label="Login Status"
                >
                  <MenuItem value="ALL">All Users</MenuItem>
                  <MenuItem value="true">Has Logged In</MenuItem>
                  <MenuItem value="false">Never Logged In</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Created After"
                value={activeFilters.createdAfter || ''}
                onChange={(e) => {
                  setActiveFilters(prev => ({
                    ...prev,
                    createdAfter: e.target.value || undefined
                  }));
                }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Created Before"
                value={activeFilters.createdBefore || ''}
                onChange={(e) => {
                  setActiveFilters(prev => ({
                    ...prev,
                    createdBefore: e.target.value || undefined
                  }));
                }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Collapse>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={() => setSearchTerm('')}
                    edge="end"
                    size="small"
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          {/* Active Filters Summary */}
          {Object.keys(activeFilters).length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
              <FilterList color="primary" />
              <Typography variant="body2" color="primary">
                {Object.keys(activeFilters).length} filter{Object.keys(activeFilters).length > 1 ? 's' : ''} active
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Active Filter Tags */}
        {Object.keys(activeFilters).length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {activeFilters.status !== undefined && (
              <Chip
                size="small"
                label={`Status: ${activeFilters.status ? 'Active' : 'Inactive'}`}
                onDelete={() => {
                  setActiveFilters(prev => {
                    const { status, ...rest } = prev;
                    return rest;
                  });
                }}
                color="primary"
                variant="outlined"
              />
            )}
            {activeFilters.isEmailVerified !== undefined && (
              <Chip
                size="small"
                label={`Email: ${activeFilters.isEmailVerified ? 'Verified' : 'Unverified'}`}
                onDelete={() => {
                  setActiveFilters(prev => {
                    const { isEmailVerified, ...rest } = prev;
                    return rest;
                  });
                }}
                color="warning"
                variant="outlined"
              />
            )}
            {activeFilters.role && (
              <Chip
                size="small"
                label={`Role: ${activeFilters.role}`}
                onDelete={() => {
                  setActiveFilters(prev => {
                    const { role, ...rest } = prev;
                    return rest;
                  });
                }}
                color="secondary"
                variant="outlined"
              />
            )}
            {activeFilters.hasLoggedIn !== undefined && (
              <Chip
                size="small"
                label={`Login: ${activeFilters.hasLoggedIn ? 'Has logged in' : 'Never logged in'}`}
                onDelete={() => {
                  setActiveFilters(prev => {
                    const { hasLoggedIn, ...rest } = prev;
                    return rest;
                  });
                }}
                color="info"
                variant="outlined"
              />
            )}
            {activeFilters.createdAfter && (
              <Chip
                size="small"
                label={`After: ${new Date(activeFilters.createdAfter).toLocaleDateString()}`}
                onDelete={() => {
                  setActiveFilters(prev => {
                    const { createdAfter, ...rest } = prev;
                    return rest;
                  });
                }}
                color="default"
                variant="outlined"
              />
            )}
            {activeFilters.createdBefore && (
              <Chip
                size="small"
                label={`Before: ${new Date(activeFilters.createdBefore).toLocaleDateString()}`}
                onDelete={() => {
                  setActiveFilters(prev => {
                    const { createdBefore, ...rest } = prev;
                    return rest;
                  });
                }}
                color="default"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Email Verified</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.$id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: blue[500], mr: 2 }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {user.$id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getRoleLabel(user.labels)} 
                      size="small" 
                      color={getRoleColor(user.labels) as any}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status ? 'Active' : 'Inactive'} 
                      size="small" 
                      sx={{ 
                        backgroundColor: getStatusColor(user.status),
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isEmailVerified ? 'Verified' : 'Unverified'} 
                      size="small" 
                      sx={{ 
                        backgroundColor: user.isEmailVerified ? green[500] : orange[500],
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {user.createdAt ? new Date(user.createdAt).toLocaleTimeString() : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {user.lastLoginAt 
                      ? (
                        <>
                          <Typography variant="body2">
                            {new Date(user.lastLoginAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(user.lastLoginAt).toLocaleTimeString()}
                          </Typography>
                        </>
                      )
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Account Information Section */}
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Account ID
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {selectedUser?.$id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Created Date
                  </Typography>
                  <Typography variant="body2">
                    {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Last Login
                  </Typography>
                  <Typography variant="body2">
                    {selectedUser?.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : 'Never'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Email Verification
                  </Typography>
                  <Chip 
                    label={selectedUser?.isEmailVerified ? 'Verified' : 'Unverified'} 
                    size="small" 
                    sx={{ 
                      backgroundColor: selectedUser?.isEmailVerified ? green[500] : orange[500],
                      color: 'white',
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* User Details Section */}
            <Typography variant="h6" gutterBottom>
              User Details
            </Typography>
            <TextField
              label="Name"
              value={editFormData.name || ''}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              fullWidth
              required
              error={!editFormData.name?.trim()}
              helperText={!editFormData.name?.trim() ? 'Name is required' : undefined}
            />
            <TextField
              label="Email"
              type="email"
              value={editFormData.email || ''}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              fullWidth
              required
              error={(() => {
                const email = editFormData.email?.trim();
                if (!email) return true;
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
              })()}
              helperText={
                !editFormData.email?.trim() 
                  ? 'Email is required' 
                  : (editFormData.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email.trim()))
                    ? 'Please enter a valid email address'
                    : undefined
              }
            />
            <TextField
              label="Phone"
              value={editFormData.phone || ''}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Address"
              value={editFormData.address || ''}
              onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editFormData.labels?.[0] || 'CUSTOMER'}
                onChange={(e) => setEditFormData({ 
                  ...editFormData, 
                  labels: [e.target.value as Labels] 
                })}
                label="Role"
              >
                <MenuItem value="CUSTOMER">Customer</MenuItem>
                <MenuItem value="MANAGER">Manager</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={editFormData.status ?? true}
                  onChange={(e) => setEditFormData({ 
                    ...editFormData, 
                    status: e.target.checked 
                  })}
                />
              }
              label="Active Status"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editFormData.isEmailVerified ?? false}
                  onChange={(e) => setEditFormData({ 
                    ...editFormData, 
                    isEmailVerified: e.target.checked 
                  })}
                />
              }
              label="Email Verified"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setEditDialogOpen(false);
              setEditFormData({});
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateUser} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New User Account</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" gutterBottom>
              Account Details
            </Typography>
            <TextField
              label="Full Name"
              value={createFormData.name}
              onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
              fullWidth
              required
              error={!createFormData.name.trim()}
              helperText={!createFormData.name.trim() ? 'Name is required' : undefined}
            />
            <TextField
              label="Email"
              type="email"
              value={createFormData.email}
              onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
              fullWidth
              required
              error={(() => {
                const email = createFormData.email.trim();
                if (!email) return true;
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
              })()}
              helperText={
                !createFormData.email.trim() 
                  ? 'Email is required' 
                  : (createFormData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createFormData.email.trim()))
                    ? 'Please enter a valid email address'
                    : undefined
              }
            />
            <TextField
              label="Password"
              type="password"
              value={createFormData.password}
              onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
              fullWidth
              required
              error={createFormData.password.length > 0 && createFormData.password.length < 8}
              helperText={
                !createFormData.password.trim()
                  ? 'Password is required'
                  : createFormData.password.length > 0 && createFormData.password.length < 8
                    ? 'Password must be at least 8 characters long'
                    : undefined
              }
            />
            <TextField
              label="Phone"
              value={createFormData.phone}
              onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Address"
              value={createFormData.address}
              onChange={(e) => setCreateFormData({ ...createFormData, address: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={createFormData.labels[0]}
                onChange={(e) => setCreateFormData({ 
                  ...createFormData, 
                  labels: [e.target.value as Labels] 
                })}
                label="Role"
              >
                <MenuItem value="CUSTOMER">Customer</MenuItem>
                <MenuItem value="MANAGER">Manager</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={createFormData.status}
                  onChange={(e) => setCreateFormData({ 
                    ...createFormData, 
                    status: e.target.checked 
                  })}
                />
              }
              label="Active Status"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={createFormData.isEmailVerified}
                  onChange={(e) => setCreateFormData({ 
                    ...createFormData, 
                    isEmailVerified: e.target.checked 
                  })}
                />
              }
              label="Email Verified"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setCreateDialogOpen(false);
              setCreateFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                address: '',
                labels: ['CUSTOMER'],
                status: true,
                isEmailVerified: false,
              });
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{selectedUser?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditUser}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit User</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedUser) {
            handleToggleStatus(selectedUser);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            {selectedUser?.status ? (
              <Block fontSize="small" color="error" />
            ) : (
              <CheckCircle fontSize="small" color="success" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedUser?.status ? 'Deactivate' : 'Activate'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          setDeleteDialogOpen(true);
          handleMenuClose();
        }} sx={{ color: red[500] }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersPage;
