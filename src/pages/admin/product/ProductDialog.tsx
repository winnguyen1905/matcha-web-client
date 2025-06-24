import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Grid,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Chip,
  Avatar,
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import { CloudUpload, Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import type { Product, ProductFeatures, ProductCategory } from '../../../hooks/Product';

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<Product, '$id'>, imageFiles: File[]) => Promise<void>;
  editingProduct: Product | null;
}

const initialFormState: Omit<Product, '$id'> = {
  name: '',
  description: '',
  oldPrice: 0,
  newPrice: 0,
  category: 'MATCHA',
  stock: 0,
  isFeatured: false,
  isPublished: false,
  imageUrls: [],
  attributes: {},
};

interface CustomAttribute {
  key: string;
  value: string;
}

type FeatureFormState = Omit<ProductFeatures, 'attributes'> & { attributes: CustomAttribute[] };

const initialFeatureState: FeatureFormState = {
  name: '',
  price: 0,
  inStock: false,
  weight: 0 as number,
  dimensions: '',
  material: [] as string[],
  origin: '',
  attributes: []
};

// Utility to normalize attributes to CustomAttribute[]
function normalizeAttributes(attr: any): CustomAttribute[] {
  if (Array.isArray(attr)) return attr;
  if (attr && typeof attr === 'object') {
    return Object.entries(attr).map(([key, value]) => ({ key, value: String(value) }));
  }
  return [];
}

const categoryOptions: ProductCategory[] = ['MATCHA', 'SWEET', 'TOOL'];

const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editingProduct,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [materialInput, setMaterialInput] = useState('');
  const [newAttribute, setNewAttribute] = useState({ key: '', value: '' });
  const [newProductAttribute, setNewProductAttribute] = useState({ key: '', value: '' });
  const [productAttributes, setProductAttributes] = useState<CustomAttribute[]>([]);
  const [features, setFeatures] = useState<FeatureFormState[]>([{ ...initialFeatureState }]);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        oldPrice: editingProduct.oldPrice || 0,
        newPrice: editingProduct.newPrice || 0,
        category: editingProduct.category,
        stock: editingProduct.stock,
        isFeatured: editingProduct.isFeatured,
        isPublished: editingProduct.isPublished,
        imageUrls: editingProduct.imageUrls || [],
        attributes: editingProduct.attributes || {},
        features: editingProduct.features || [],
      });

      // Initialize product attributes
      if (editingProduct.attributes) {
        const attrs = Object.entries(editingProduct.attributes).map(([key, value]) => ({
          key,
          value: String(value)
        }));
        setProductAttributes(attrs);
      } else {
        setProductAttributes([]);
      }

      if (editingProduct.features) {
        if (Array.isArray(editingProduct.features)) {
          setFeatures((editingProduct.features as any[]).map((feature: any) => ({
            ...feature,
            attributes: normalizeAttributes(feature.attributes)
          })) as FeatureFormState[]);
        } else {
          // Convert single feature to array for backward compatibility
          const singleFeature: FeatureFormState = {
            ...initialFeatureState,
            ...(editingProduct.features as any),
            attributes: normalizeAttributes((editingProduct.features as any).attributes)
          };
          setFeatures([singleFeature]);
        }
      } else {
        setFeatures([{ ...initialFeatureState }]);
      }
    } else {
      setFormData(initialFormState);
      setFeatures([{ ...initialFeatureState }]);
    }
    setImageFiles([]);
    setMaterialInput('');
    setCurrentFeatureIndex(0);
  }, [editingProduct, open]);

  const handleClose = () => {
    setFormData(initialFormState);
    setImageFiles([]);
    setFeatures([{ ...initialFeatureState }]);
    setMaterialInput('');
    setNewAttribute({ key: '', value: '' });
    setNewProductAttribute({ key: '', value: '' });
    setProductAttributes([]);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  // handleMaterialAdd and handleMaterialDelete are now defined below with feature index support

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeImage = (index: number, isNewImage: boolean) => {
    if (isNewImage) {
      setImageFiles(prevFiles => prevFiles.filter((_file: File, i: number) => i !== index));
    } else {
      setFormData(prev => ({
        ...prev,
        imageUrls: prev.imageUrls?.filter((_item: string, i: number) => i !== index) || []
      }));
    }
  };

  const addProductAttribute = () => {
    if (newProductAttribute.key.trim() && newProductAttribute.value.trim()) {
      setProductAttributes([...productAttributes, { ...newProductAttribute }]);
      setNewProductAttribute({ key: '', value: '' });
    }
  };

  const removeProductAttribute = (index: number) => {
    const newAttributes = [...productAttributes];
    newAttributes.splice(index, 1);
    setProductAttributes(newAttributes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Filter out empty features and prepare the data
      const nonEmptyFeatures: FeatureFormState[] = features.filter(f =>
        f.name.trim() !== '' ||
        f.weight >= 0 ||
        f.dimensions.trim() !== '' ||
        f.origin.trim() !== '' ||
        (f.material && f.material.length > 0)
      );

      // Convert product attributes to object
      const attributesObj = productAttributes.reduce((acc, attr) => {
        acc[attr.key] = attr.value;
        return acc;
      }, {} as Record<string, string>);

      // Convert feature attributes array to object for each feature
      const featuresForSubmit: ProductFeatures[] | undefined = nonEmptyFeatures.length > 0 ? nonEmptyFeatures.map((f: FeatureFormState) => {
        const attrObj = (f.attributes || []).reduce((acc, attr) => {
          acc[attr.key] = attr.value;
          return acc;
        }, {} as Record<string, string>);
        const base = {
          name: f.name || '',
          price: f.price ?? 0,
          inStock: f.inStock ?? false,
          weight: f.weight ?? 0,
          dimensions: f.dimensions || '',
          material: f.material || [],
          origin: f.origin || '',
        };
        return Object.keys(attrObj).length > 0 ? { ...base, attributes: attrObj } : base;
      }) : undefined;

      const productData = {
        name: formData.name || '',
        description: formData.description || '',
        oldPrice: formData.oldPrice ?? 0,
        newPrice: formData.newPrice ?? 0,
        category: (formData.category as ProductCategory) || 'MATCHA',
        stock: formData.stock ?? 0,
        isFeatured: formData.isFeatured ?? false,
        isPublished: formData.isPublished ?? false,
        imageUrls: formData.imageUrls || [],
        features: featuresForSubmit,
        attributes: attributesObj
      };

      await onSubmit(productData, imageFiles);
      handleClose();
    } catch (error) {
      // Error handling is done in the parent component
      throw error;
    }
  };

  const addFeature = () => {
    setFeatures([...features, { ...initialFeatureState }]);
    setCurrentFeatureIndex(features.length);
  };

  const addCustomAttribute = (featureIndex: number) => {
    if (newAttribute.key.trim() && newAttribute.value.trim()) {
      const newFeatures = [...features];
      newFeatures[featureIndex] = {
        ...newFeatures[featureIndex],
        attributes: [
          ...(newFeatures[featureIndex].attributes || []),
          { ...newAttribute }
        ]
      };
      setFeatures(newFeatures);
      setNewAttribute({ key: '', value: '' });
    }
  };

  const removeCustomAttribute = (featureIndex: number, attrIndex: number) => {
    const newFeatures = [...features];
    newFeatures[featureIndex] = {
      ...newFeatures[featureIndex],
      attributes: newFeatures[featureIndex].attributes?.filter((_, i) => i !== attrIndex) || []
    };
    setFeatures(newFeatures);
  };

  const updateCustomAttribute = (featureIndex: number, attrIndex: number, field: 'key' | 'value', value: string) => {
    const newFeatures = [...features];
    const updatedAttributes = [...(newFeatures[featureIndex].attributes || [])];
    updatedAttributes[attrIndex] = { ...updatedAttributes[attrIndex], [field]: value };
    newFeatures[featureIndex] = {
      ...newFeatures[featureIndex],
      attributes: updatedAttributes 
    };
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      const newFeatures = features.filter((_, i) => i !== index);
      setFeatures(newFeatures);
      setCurrentFeatureIndex(Math.min(currentFeatureIndex, newFeatures.length - 1));
    }
  };

  const updateFeature = (index: number, field: string, value: any) => {
    const newFeatures = [...features];
    if (field === 'material') {
      if (!newFeatures[index].material) {
        newFeatures[index].material = [];
      }
    }
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFeatures(newFeatures);
  };

  const handleMaterialAdd = (featureIndex: number) => {
    if (materialInput.trim() && !features[featureIndex].material?.includes(materialInput.trim())) {
      const newFeatures = [...features];
      newFeatures[featureIndex] = {
        ...newFeatures[featureIndex],
        material: [...(newFeatures[featureIndex].material || []), materialInput.trim()]
      };
      setFeatures(newFeatures);
      setMaterialInput('');
    }
  };

  const handleMaterialDelete = (featureIndex: number, materialToDelete: string) => {
    const newFeatures = [...features];
    newFeatures[featureIndex] = {
      ...newFeatures[featureIndex],
      material: (newFeatures[featureIndex].material || []).filter(m => m !== materialToDelete)
    };
    setFeatures(newFeatures);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleInputChange}
                >
                  {categoryOptions.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Old Price"
                    name="oldPrice"
                    type="number"
                    value={formData.oldPrice}
                    onChange={handleInputChange}
                    margin="normal"
                    // inputProps={{ min: 0, step: 1000 }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="New Price"
                    name="newPrice"
                    type="number"
                    value={formData.newPrice}
                    onChange={handleInputChange}
                    margin="normal"
                    // inputProps={{ min: 0, step: 1000 }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    margin="normal"
                    inputProps={{ min: 0 }}
                    required
                  />
                </Grid>
              </Grid>
              <FormGroup>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="isFeatured"
                          checked={formData.isFeatured || false}
                          onChange={(e) =>
                            setFormData({ ...formData, isFeatured: e.target.checked })
                          }
                        />
                      }
                      label="Featured Product"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="isPublished"
                          checked={formData.isPublished || false}
                          onChange={(e) =>
                            setFormData({ ...formData, isPublished: e.target.checked })
                          }
                        />
                      }
                      label="Published"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, p: 2, border: '1px dashed #eee', borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 163, 14, 0.1)' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Additional Attributes
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      size="small"
                      label="Attribute Name"
                      value={newProductAttribute.key}
                      onChange={(e) => setNewProductAttribute({ ...newProductAttribute, key: e.target.value })}
                      placeholder="e.g., Brand, Color"
                    />
                    <TextField
                      size="small"
                      label="Value"
                      value={newProductAttribute.value}
                      onChange={(e) => setNewProductAttribute({ ...newProductAttribute, value: e.target.value })}
                      placeholder="e.g., Matcha House, Green"
                    />
                    <Button
                      variant="outlined"
                      onClick={addProductAttribute}
                      disabled={!newProductAttribute.key.trim() || !newProductAttribute.value.trim()}
                      size="small"
                    >
                      Add
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {productAttributes.map((attr, index) => (
                      <Chip
                        key={index}
                        label={`${attr.key}: ${attr.value}`}
                        onDelete={() => removeProductAttribute(index)}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              </FormGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Product Images
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="product-images"
                  multiple
                  type="file"
                  onChange={handleImageChange}
                />
                <Box sx={{ mt: 1 }}>
                  <Grid container spacing={1}>
                    {formData.imageUrls?.map((url: string, index: number) => (
                      <Grid item key={`existing-${index}`}>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            variant="rounded"
                            src={url}
                            sx={{ width: 80, height: 80 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index, false)}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              },
                              width: 24,
                              height: 24,
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                    {imageFiles.map((file, index) => (
                      <Grid item key={`new-${index}`}>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            variant="rounded"
                            src={URL.createObjectURL(file)}
                            sx={{ width: 80, height: 80 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index, true)}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              },
                              width: 24,
                              height: 24,
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                    <Grid item>
                      <label htmlFor="product-images">
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 80,
                            height: 80,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '1px dashed #ccc',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <CloudUpload fontSize="small" sx={{ mb: 0.5 }} />
                          <Typography variant="caption" align="center" sx={{ fontSize: 10, lineHeight: 1.2 }}>
                            Add Image
                          </Typography>
                        </Avatar>
                      </label>
                    </Grid>
                  </Grid>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                    {formData.imageUrls?.length || 0 + imageFiles.length} image(s) selected
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Product Features</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={addFeature}
                    startIcon={<AddIcon />}
                  >
                    Add Feature (Variations)
                  </Button>
                </Box>

                {features.length > 0 && (
                  <Tabs
                    value={currentFeatureIndex}
                    onChange={(_, newValue) => setCurrentFeatureIndex(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ mb: 2 }}
                  >
                    {features.map((_, index) => (
                      <Tab
                        key={index}
                        label={`Feature ${index + 1}`}
                        iconPosition="end"
                        icon={
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFeature(index);
                            }}
                            sx={{
                              ml: 1,
                              visibility: features.length > 1 ? 'visible' : 'hidden'
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        }
                      />
                    ))}
                  </Tabs>
                )}

                {features.length > 0 && features.map((feature, index) => (
                  <Box key={index} sx={{ display: index === currentFeatureIndex ? 'block' : 'none' }}>
                    <TextField
                      fullWidth
                      label="Feature Name"
                      value={feature.name || ''}
                      onChange={(e) => updateFeature(index, 'name', e.target.value)}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Feature Price"
                      type="number"
                      value={feature.price || ''}
                      onChange={(e) => updateFeature(index, 'price', parseFloat(e.target.value) || 0)}
                      margin="normal"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                    <TextField
                      fullWidth
                      label="Weight"
                      value={feature.weight || 0}
                      onChange={(e) => updateFeature(index, 'weight', parseFloat(e.target.value) || 0)}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Dimensions"
                      value={feature.dimensions || ''}
                      onChange={(e) => updateFeature(index, 'dimensions', e.target.value)}
                      margin="normal"
                    />
                    <Box sx={{ my: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Materials
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField
                          size="small"
                          value={materialInput}
                          onChange={(e) => setMaterialInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleMaterialAdd(currentFeatureIndex);
                            }
                          }}
                          placeholder="Add material"
                        />
                        <Button
                          variant="outlined"
                          onClick={() => handleMaterialAdd(currentFeatureIndex)}
                          disabled={!materialInput.trim()}
                        >
                          Add
                        </Button>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {feature.material?.map((material, matIndex) => (
                          <Chip
                            key={matIndex}
                            label={material}
                            onDelete={() => handleMaterialDelete(currentFeatureIndex, material)}
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                    <TextField
                      fullWidth
                      label="Origin"
                      value={feature.origin || ''}
                      onChange={(e) => updateFeature(index, 'origin', e.target.value)}
                      margin="normal"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={feature.inStock ?? false}
                          onChange={(e) => updateFeature(index, 'inStock', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="In Stock"
                      sx={{ mt: 1, mb: 2 }}
                    />

                    <Box sx={{ mt: 3, mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Custom Attributes
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                          size="small"
                          label="Attribute Name"
                          value={newAttribute.key}
                          onChange={(e) => setNewAttribute({ ...newAttribute, key: e.target.value })}
                          placeholder="e.g., Color, Size"
                        />
                        <TextField
                          size="small"
                          label="Value"
                          value={newAttribute.value}
                          onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
                          placeholder="e.g., Red, Large"
                        />
                        <Button
                          variant="outlined"
                          onClick={() => addCustomAttribute(index)}
                          disabled={!newAttribute.key.trim() || !newAttribute.value.trim()}
                        >
                          Add
                        </Button>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {feature.attributes?.map((attr, attrIndex) => (
                          <Box key={attrIndex} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              label={`${attr.key}: ${attr.value}`}
                              onDelete={() => removeCustomAttribute(index, attrIndex)}
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {editingProduct ? 'Update' : 'Create'} Product
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductDialog;
