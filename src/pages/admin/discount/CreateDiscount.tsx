import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { useDiscounts } from '../../../hooks/Discount';
import { CreateDiscount, DiscountType } from '@/lib/schema';
import AlertModal from '@/components/ui/AlertModal';

const initialForm: Omit<CreateDiscount, 'createdBy'> = {
  code: '',
  description: '',
  discountType: DiscountType.PERCENTAGE,
  value: 0,
  minOrderAmount: undefined,
  maxDiscountAmount: undefined,
  startDate: '',
  endDate: '',
  isActive: true,
  usageLimit: undefined,
  appliesTo: { allProducts: true },
};

const CreateDiscountPage: React.FC = () => {
  const { createDiscount, loading } = useDiscounts();
  const [form, setForm] = useState<Omit<CreateDiscount, 'createdBy'>>(initialForm);
  const [alert, setAlert] = useState<{ open: boolean; title: string; message: string; severity?: 'success' | 'error' }>({ open: false, title: '', message: '' });

  // For appliesTo
  const [allProducts, setAllProducts] = useState(true);
  const [productIds, setProductIds] = useState<string>('');
  const [categoryIds, setCategoryIds] = useState<string>('');

  // For required createdBy (admin user id)
  const createdBy = 'admin'; // TODO: Replace with actual user id from auth context

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<DiscountType>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name as keyof CreateDiscount]: value as DiscountType,
    }));
  };

  const handleAppliesToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllProducts(e.target.checked);
    setForm((prev) => ({
      ...prev,
      appliesTo: { ...prev.appliesTo, allProducts: e.target.checked },
    }));
  };

  const handleProductIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductIds(e.target.value);
    setForm((prev) => ({
      ...prev,
      appliesTo: {
        ...prev.appliesTo,
        productIds: e.target.value.split(',').map((id) => id.trim()).filter(Boolean),
      },
    }));
  };

  const handleCategoryIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryIds(e.target.value);
    setForm((prev) => ({
      ...prev,
      appliesTo: {
        ...prev.appliesTo,
        categoryIds: e.target.value.split(',').map((id) => id.trim()).filter(Boolean),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const discountData: CreateDiscount = {
        ...form,
        appliesTo: {
          allProducts,
          productIds: allProducts ? undefined : form.appliesTo.productIds,
          categoryIds: allProducts ? undefined : form.appliesTo.categoryIds,
        },
        createdBy,
      };
      await createDiscount(discountData);
      setAlert({ open: true, title: 'Success', message: 'Discount created successfully!', severity: 'success' });
      setForm(initialForm);
      setAllProducts(true);
      setProductIds('');
      setCategoryIds('');
    } catch (error: any) {
      setAlert({ open: true, title: 'Error', message: error.message || 'Failed to create discount', severity: 'error' });
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        Create New Discount
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Discount Code"
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Discount Type</InputLabel>
              <Select
                name="discountType"
                value={form.discountType}
                onChange={handleSelectChange}
                label="Discount Type"
              >
                <MenuItem value={DiscountType.PERCENTAGE}>Percentage (%)</MenuItem>
                <MenuItem value={DiscountType.FIXED}>Fixed Amount</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={form.discountType === DiscountType.PERCENTAGE ? 'Value (%)' : 'Value (Amount)'}
              name="value"
              type="number"
              value={form.value}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Min Order Amount"
              name="minOrderAmount"
              type="number"
              value={form.minOrderAmount ?? ''}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Max Discount Amount"
              name="maxDiscountAmount"
              type="number"
              value={form.maxDiscountAmount ?? ''}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 0 }}
              disabled={form.discountType !== DiscountType.PERCENTAGE}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              name="startDate"
              type="datetime-local"
              value={form.startDate}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="End Date"
              name="endDate"
              type="datetime-local"
              value={form.endDate}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Usage Limit"
              name="usageLimit"
              type="number"
              value={form.usageLimit ?? ''}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isActive}
                  onChange={handleChange}
                  name="isActive"
                  color="primary"
                />
              }
              label="Active"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allProducts}
                  onChange={handleAppliesToChange}
                  name="allProducts"
                  color="primary"
                />
              }
              label="Applies to All Products"
            />
          </Grid>
          {!allProducts && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Product IDs (comma separated)"
                  value={productIds}
                  onChange={handleProductIdsChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Category IDs (comma separated)"
                  value={categoryIds}
                  onChange={handleCategoryIdsChange}
                  fullWidth
                />
              </Grid>
            </>
          )}
        </Grid>
        <DialogActions sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Discount'}
          </Button>
        </DialogActions>
      </form>
      <AlertModal
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
};

export default CreateDiscountPage;
