import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { Discount, DiscountType, CreateDiscount, AppliesTo } from '@/lib/schema';
import { useDiscounts } from '@/hooks/Discount';

const emptyForm: Omit<CreateDiscount, 'createdBy'> = {
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

interface Props {
  open: boolean;
  discount: Discount | null;   // null = create, otherwise edit
  onClose: () => void;
}

const CreateEditDiscountDialog: React.FC<Props> = ({ open, discount, onClose }) => {
  const isEdit = Boolean(discount);

  const { createDiscount, updateDiscount, loading } = useDiscounts();

  const [form, setForm] = useState<Omit<CreateDiscount, 'createdBy'>>(emptyForm);

  // Applies-to helpers
  const [allProducts, setAllProducts] = useState(true);
  const [productIds, setProductIds] = useState('');
  const [categoryIds, setCategoryIds] = useState('');

  useEffect(() => {
    if (discount) {
      const applies: AppliesTo =
        typeof discount.appliesTo === 'string'
          ? JSON.parse(discount.appliesTo)
          : discount.appliesTo;

      setForm({
        ...discount,
        appliesTo: applies,
      });
      setAllProducts(applies.allProducts);
      setProductIds((applies.productIds ?? []).join(','));
      setCategoryIds((applies.categoryIds ?? []).join(','));
    } else {
      setForm(emptyForm);
      setAllProducts(true);
      setProductIds('');
      setCategoryIds('');
    }
  }, [discount]);

  // ───────────────────────── handlers ─────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload: CreateDiscount = {
      ...form,
      appliesTo: {
        allProducts,
        productIds: allProducts ? undefined : productIds.split(',').map(s => s.trim()).filter(Boolean),
        categoryIds: allProducts ? undefined : categoryIds.split(',').map(s => s.trim()).filter(Boolean),
      },
      createdBy: 'admin', // TODO: replace with auth
    };

    if (isEdit && discount) {
      await updateDiscount(discount.$id!, payload);
    } else {
      await createDiscount(payload);
    }
    onClose();
  };

  // ───────────────────────── UI ─────────────────────────
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Discount' : 'Create Discount'}</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Code"
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                fullWidth
                disabled={isEdit} // Code should remain immutable
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="discountType"
                  value={form.discountType}
                  onChange={handleSelectChange}
                  label="Type"
                >
                  <MenuItem value={DiscountType.PERCENTAGE}>Percentage (%)</MenuItem>
                  <MenuItem value={DiscountType.FIXED}>Fixed amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={form.discountType === DiscountType.PERCENTAGE ? 'Value (%)' : 'Value (amount)'}
                name="value"
                type="number"
                value={form.value}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Max discount amount"
                name="maxDiscountAmount"
                type="number"
                value={form.maxDiscountAmount ?? ''}
                onChange={handleChange}
                fullWidth
                disabled={form.discountType !== DiscountType.PERCENTAGE}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Start date"
                name="startDate"
                type="datetime-local"
                value={form.startDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End date"
                name="endDate"
                type="datetime-local"
                value={form.endDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Usage limit"
                name="usageLimit"
                type="number"
                value={form.usageLimit ?? ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isActive}
                    onChange={handleChange}
                    name="isActive"
                  />
                }
                label="Active"
              />
            </Grid>

            {/* Applies-to */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allProducts}
                    onChange={e => setAllProducts(e.target.checked)}
                  />
                }
                label="Applies to all products"
              />
            </Grid>
            {!allProducts && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Product IDs (comma separated)"
                    value={productIds}
                    onChange={e => setProductIds(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Category IDs (comma separated)"
                    value={categoryIds}
                    onChange={e => setCategoryIds(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={18} />}
        >
          {isEdit ? 'Save changes' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEditDiscountDialog;
