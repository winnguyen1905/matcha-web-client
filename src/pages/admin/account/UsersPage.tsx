import React, { useState, useEffect } from 'react';
import { useAccount, UserAccount, UpdateUserData } from '../../../context/Account';
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
} from '@mui/material';
import { 
  Search, 
  MoreVert, 
  Edit, 
  Delete, 
  Block, 
  CheckCircle,
  Refresh,
  Add
} from '@mui/icons-material';
import { green, red, orange, blue } from '@mui/material/colors';

const UsersPage: React.FC = () => {
  const { 
    users, 
    loading, 
    error, 
    listUsers, 
    searchUsers, 
    updateUser, 
    deleteUser, 
    updateUserRole, 
    updateUserStatus,
  } = useAccount();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateUserData>({});

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Search users when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const query = `name.contains("${searchTerm}") || email.contains("${searchTerm}")`;
      searchUsers(query);
    } else {
      loadUsers();
    }
  }, [searchTerm]);

  const loadUsers = async () => {
    try {
      await listUsers();
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

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
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        address: selectedUser.address,
        status: selectedUser.status,
        labels: selectedUser.labels,
      });
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleUpdateUser = async () => {
    if (selectedUser && editFormData) {
      try {
        await updateUser(selectedUser.$id, editFormData);
        setEditDialogOpen(false);
        setEditFormData({});
        await loadUsers();
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.$id);
        setDeleteDialogOpen(false);
        await loadUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleToggleStatus = async (user: UserAccount) => {
    try {
      await updateUserStatus(user.$id, !user.status);
      await loadUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
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
        <Box>
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
        <Typography variant="h6" gutterBottom>
          Quick Filters
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`All (${accountStats.total})`}
            onClick={() => loadUsers()}
            color="primary"
            variant="outlined"
          />
          <Chip 
            label={`Active (${accountStats.active})`}
            onClick={() => searchUsers('status.equal(true)')}
            color="success"
            variant="outlined"
          />
          <Chip 
            label={`Inactive (${accountStats.inactive})`}
            onClick={() => searchUsers('status.equal(false)')}
            color="error"
            variant="outlined"
          />
          <Chip 
            label={`Verified (${accountStats.verified})`}
            onClick={() => searchUsers('isEmailVerified.equal(true)')}
            color="warning"
            variant="outlined"
          />
          <Chip 
            label={`Unverified (${accountStats.unverified})`}
            onClick={() => searchUsers('isEmailVerified.equal(false)')}
            color="default"
            variant="outlined"
          />
          <Chip 
            label={`Admins (${accountStats.admins})`}
            onClick={() => searchUsers('labels.contains("ADMIN")')}
            color="error"
            variant="outlined"
          />
          <Chip 
            label={`Managers (${accountStats.managers})`}
            onClick={() => searchUsers('labels.contains("MANAGER")')}
            color="warning"
            variant="outlined"
          />
          <Chip 
            label={`Customers (${accountStats.customers})`}
            onClick={() => searchUsers('labels.contains("CUSTOMER")')}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
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
                      {new Date(user.$createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(user.$createdAt).toLocaleTimeString()}
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
                    {selectedUser?.$createdAt ? new Date(selectedUser.$createdAt).toLocaleString() : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {selectedUser?.$updatedAt ? new Date(selectedUser.$updatedAt).toLocaleString() : 'N/A'}
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
            />
            <TextField
              label="Email"
              value={editFormData.email || ''}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              fullWidth
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
                  labels: [e.target.value as string] 
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
                  checked={editFormData.status || false}
                  onChange={(e) => setEditFormData({ 
                    ...editFormData, 
                    status: e.target.checked 
                  })}
                />
              }
              label="Active Status"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">
            Update User
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
    </Box>
  );
};

export default UsersPage;
