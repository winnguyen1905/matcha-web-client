import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../hooks/Account';
import { Address, UserInformation } from '../../lib/schema';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Button,
  TextField,
  Avatar,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Fab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const ProfilePage: React.FC = () => {
  const { currentUser, userProfile, loading, updateProfile, addAddress, updateAddress, removeAddress, setDefaultAddress, logout } = useAccount();
  const navigate = useNavigate();
  
  // Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    avatarUrl: '',
    dateOfBirth: '',
    gender: '' as '' | 'male' | 'female' | 'other' | 'prefer_not_to_say',
  });
  
  // Address management
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<Address, 'isDefault'>>({
    type: 'both',
    label: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'US',
    postalCode: '',
  });
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        fullName: userProfile.fullName || '',
        phone: userProfile.phone || '',
        avatarUrl: userProfile.avatarUrl || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        gender: userProfile.gender || '',
      });
    }
  }, [userProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to logout');
    }
  };

  const handleSaveProfile = async () => {
    try {
      setError(null);
      await updateProfile(profileForm as Partial<UserInformation>);
      setIsEditingProfile(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleAddressSubmit = async () => {
    try {
      setError(null);
      if (editingAddressIndex !== null) {
        // Update existing address
        await updateAddress(editingAddressIndex, { ...addressForm, isDefault: userProfile?.addresses[editingAddressIndex]?.isDefault || false });
        setSuccessMessage('Address updated successfully!');
      } else {
        // Add new address
        await addAddress(addressForm);
        setSuccessMessage('Address added successfully!');
      }
      
      setAddressDialogOpen(false);
      resetAddressForm();
    } catch (error) {
      setError('Failed to save address');
    }
  };

  const handleEditAddress = (index: number) => {
    const address = userProfile?.addresses[index];
    if (address) {
      setAddressForm({
        type: address.type,
        label: address.label || '',
        fullName: address.fullName,
        phone: address.phone || '',
        address: address.address,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
      });
      setEditingAddressIndex(index);
      setAddressDialogOpen(true);
    }
  };

  const handleDeleteAddress = async (index: number) => {
    try {
      setError(null);
      await removeAddress(index);
      setSuccessMessage('Address deleted successfully!');
    } catch (error) {
      setError('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (index: number) => {
    try {
      setError(null);
      await setDefaultAddress(index);
      setSuccessMessage('Default address updated!');
    } catch (error) {
      setError('Failed to update default address');
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      type: 'both',
      label: '',
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: 'US',
      postalCode: '',
    });
    setEditingAddressIndex(null);
  };

  const handleAddNewAddress = () => {
    resetAddressForm();
    setAddressDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Container maxWidth="md">
        <Box my={4} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Not Logged In
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        
        {/* Alert Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* Profile Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Personal Information</Typography>
                <IconButton
                  color="primary"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? <CancelIcon /> : <EditIcon />}
                </IconButton>
              </Box>
              
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Box position="relative">
                  <Avatar
                    src={profileForm.avatarUrl}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  >
                    {userProfile?.fullName?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  {isEditingProfile && (
                    <Fab
                      size="small"
                      color="primary"
                      sx={{ position: 'absolute', bottom: 16, right: -8 }}
                    >
                      <PhotoCameraIcon />
                    </Fab>
                  )}
                </Box>
                
                {isEditingProfile ? (
                  <TextField
                    fullWidth
                    label="Avatar URL"
                    value={profileForm.avatarUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                ) : null}
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {isEditingProfile ? (
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      required
                    />
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
                      <Typography variant="body1">{userProfile?.fullName || 'Not provided'}</Typography>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{currentUser.auth.email}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  {isEditingProfile ? (
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                      <Typography variant="body1">{userProfile?.phone || 'Not provided'}</Typography>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  {isEditingProfile ? (
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={profileForm.dateOfBirth}
                      onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Date of Birth</Typography>
                      <Typography variant="body1">
                        {userProfile?.dateOfBirth ? new Date(userProfile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Account Status</Typography>
                  <Typography variant="body1">
                    {currentUser.auth.emailVerification ? 'Verified' : 'Not Verified'}
                  </Typography>
                </Grid>
              </Grid>
              
              {isEditingProfile && (
                <Box mt={3} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    fullWidth
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Address Management */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Saved Addresses</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddNewAddress}
                  size="small"
                >
                  Add Address
                </Button>
              </Box>
              
              {userProfile?.addresses && userProfile.addresses.length > 0 ? (
                <Box>
                  {userProfile.addresses.map((address, index) => (
                    <Card key={index} sx={{ mb: 2, position: 'relative' }}>
                      <CardContent>
                        <Box display="flex" justifyContent="between" alignItems="start">
                          <Box flex={1}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              {address.label && (
                                <Chip label={address.label} size="small" color="primary" />
                              )}
                              {address.type && (
                                <Chip 
                                  label={address.type} 
                                  size="small" 
                                  variant="outlined"
                                />
                              )}
                              {address.isDefault && (
                                <Chip 
                                  label="Default" 
                                  size="small" 
                                  color="success"
                                  icon={<StarIcon />}
                                />
                              )}
                            </Box>
                            
                            <Typography variant="subtitle1" fontWeight="bold">
                              {address.fullName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {address.address}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {address.city}, {address.state} {address.postalCode}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {address.country}
                            </Typography>
                            {address.phone && (
                              <Typography variant="body2" color="textSecondary">
                                {address.phone}
                              </Typography>
                            )}
                          </Box>
                          
                          <Box display="flex" flexDirection="column" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleSetDefaultAddress(index)}
                              disabled={address.isDefault}
                              title="Set as default"
                            >
                              {address.isDefault ? <StarIcon color="primary" /> : <StarBorderIcon />}
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleEditAddress(index)}
                              title="Edit address"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteAddress(index)}
                              color="error"
                              title="Delete address"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    No addresses saved yet
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddNewAddress}
                  >
                    Add Your First Address
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Account Actions */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Actions
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/orders')}
                >
                  View Orders
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/cart')}
                >
                  View Cart
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Address Dialog */}
        <Dialog open={addressDialogOpen} onClose={() => setAddressDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Label (optional)"
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  placeholder="Home, Work, etc."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Address Type"
                  value={addressForm.type}
                  onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value as Address['type'] })}
                  SelectProps={{ native: true }}
                >
                  <option value="both">Shipping & Billing</option>
                  <option value="shipping">Shipping Only</option>
                  <option value="billing">Billing Only</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="State"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value.toUpperCase() })}
                  inputProps={{ maxLength: 2 }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Country"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddressDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddressSubmit} 
              variant="contained"
              disabled={!addressForm.fullName || !addressForm.address || !addressForm.city || !addressForm.state || !addressForm.postalCode}
            >
              {editingAddressIndex !== null ? 'Update' : 'Add'} Address
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ProfilePage;
