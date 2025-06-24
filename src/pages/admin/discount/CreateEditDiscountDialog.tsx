import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import {
  AppliesTo,
  CreateDiscount,
  Discount,
  DiscountType,
  UpdateDiscount,
} from "@/lib/schema";
import { useDiscounts } from "@/hooks/Discount";
import { useProducts } from "@/hooks/Product";

/* ------------------------------------------------------------------ */
/*  helpers                                                           */
/* ------------------------------------------------------------------ */
const stringify = (v: unknown) =>
  typeof v === "object" ? JSON.stringify(v) : String(v);

const buildUpdatePayload = (
  original: Discount,
  next: CreateDiscount,
): UpdateDiscount => {
  const updates: Partial<UpdateDiscount> = {};
  (Object.keys(next) as (keyof CreateDiscount)[]).forEach((k) => {
    const newVal = next[k];
    const oldVal = (original as any)[k];
    const equal = stringify(newVal) === stringify(oldVal);
    if (!equal && newVal !== undefined && newVal !== "") {
      (updates as any)[k] = newVal;
    }
  });
  return updates as UpdateDiscount;
};

/* ------------------------------------------------------------------ */
/*  initial template                                                  */
/* ------------------------------------------------------------------ */
const emptyForm: Omit<CreateDiscount, "createdBy"> = {
  code: "",
  description: "",
  discountType: DiscountType.PERCENTAGE,
  value: 0,
  minOrderAmount: undefined,
  maxDiscountAmount: undefined,
  startDate: "",
  endDate: "",
  isActive: true,
  usageLimit: undefined,
  appliesTo: { allProducts: true },
};

/* ------------------------------------------------------------------ */
/*  component                                                         */
/* ------------------------------------------------------------------ */
interface Props {
  open: boolean;
  discount: Discount | null; // null → create
  onClose: () => void;
}

const CreateEditDiscountDialog: React.FC<Props> = ({ open, discount, onClose }) => {
  const isEdit = Boolean(discount);

  const { createDiscount, updateDiscount, loading } = useDiscounts();
  const { products, loading: productsLoading } = useProducts();

  const [form, setForm] = useState<Omit<CreateDiscount, "createdBy">>(emptyForm);
  const [allProducts, setAllProducts] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  /* populate */
  useEffect(() => {
    if (discount) {
      const applies: AppliesTo =
        typeof discount.appliesTo === "string"
          ? JSON.parse(discount.appliesTo)
          : discount.appliesTo;
      setForm({ ...discount, appliesTo: applies });
      setAllProducts(applies.allProducts);
      setSelectedProducts(applies.productIds ?? []);
      setSelectedCategories(applies.categoryIds ?? []);
    } else {
      setForm(emptyForm);
      setAllProducts(true);
      setSelectedProducts([]);
      setSelectedCategories([]);
    }
  }, [discount]);

  /* handlers */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload: CreateDiscount = {
      ...form,
      appliesTo: allProducts
        ? { allProducts: true }
        : {
            allProducts: false,
            productIds: selectedProducts.length ? selectedProducts : undefined,
            categoryIds: selectedCategories.length ? selectedCategories : undefined,
          },
      createdBy: "admin", // TODO auth
    };

    if (isEdit && discount) {
      const updates = buildUpdatePayload(discount, payload);
      if (Object.keys(updates).length) {
        await updateDiscount(discount.$id, updates);
      }
    } else {
      await createDiscount(payload);
    }
    onClose();
  };

  /* derived */
  const categoryOptions = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);

  /* UI */
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Discount" : "Create Discount"}</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {/* Code + Type */}
            <Grid item xs={12} sm={6}>
              <TextField label="Code" name="code" value={form.code} onChange={handleChange} required fullWidth disabled={isEdit} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select name="discountType" value={form.discountType} onChange={handleSelectChange} label="Type">
                  <MenuItem value={DiscountType.PERCENTAGE}>Percentage (%)</MenuItem>
                  <MenuItem value={DiscountType.FIXED}>Fixed amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Description */}
            <Grid item xs={12}>
              <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline />
            </Grid>
            {/* Value & Max */}
            <Grid item xs={12} sm={6}>
              <TextField
                label={form.discountType === DiscountType.PERCENTAGE ? "Value (%)" : "Value (amount)"}
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
                value={form.maxDiscountAmount ?? ""}
                onChange={handleChange}
                fullWidth
                disabled={form.discountType !== DiscountType.PERCENTAGE}
              />
            </Grid>
            {/* Dates */}
            <Grid item xs={12} sm={6}>
              <TextField label="Start date" name="startDate" type="datetime-local" value={form.startDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="End date" name="endDate" type="datetime-local" value={form.endDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            {/* Usage & Active */}
            <Grid item xs={12} sm={6}>
              <TextField label="Usage limit" name="usageLimit" type="number" value={form.usageLimit ?? ""} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Checkbox checked={form.isActive} onChange={handleChange} name="isActive" />} label="Active" />
            </Grid>
            {/* AppliesTo */}
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox checked={allProducts} onChange={(e) => setAllProducts(e.target.checked)} />} label="Applies to all products" />
            </Grid>
            {!allProducts && (
              <>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    loading={productsLoading}
                    options={products}
                    getOptionLabel={(o) => o.name}
                    value={products.filter((p) => selectedProducts.includes(p.$id))}
                    onChange={(_, v) => setSelectedProducts(v.map((p) => p.$id))}
                    renderInput={(params) => <TextField {...params} label="Select products" placeholder="Search products…" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={categoryOptions}
                    value={selectedCategories}
                    onChange={(_, v) => setSelectedCategories(v)}
                    renderInput={(params) => <TextField {...params} label="Select categories" placeholder="Search categories…" />}
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
        <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={loading && <CircularProgress size={18} />}>
          {isEdit ? "Save changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEditDiscountDialog;
