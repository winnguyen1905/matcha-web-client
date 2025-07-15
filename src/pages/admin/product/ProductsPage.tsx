import React, { useState, Fragment, useMemo } from 'react';
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
  Button,
  TextField,
  InputAdornment,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Checkbox,
  FormControlLabel,
  TableSortLabel,
  Switch,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
} from '@mui/material';
import { 
  Search, 
  Edit, 
  Delete, 
  Add, 
  ExpandMore, 
  ExpandLess, 
  FilterList,
  Clear,
  Sort,
} from '@mui/icons-material';
import { useProducts } from '../../../hooks/Product';
import type { Product, ProductCategory } from '../../../hooks/Product';
import { useNotification } from '../../../context/NotificationContext';
import ProductDialog from './ProductDialog';

type SortField = 'name' | 'category' | 'newPrice' | 'stock' | '$createdAt';
type SortOrder = 'asc' | 'desc';
type StockStatus = 'all' | 'inStock' | 'lowStock' | 'outOfStock';

interface FilterState {
  category: ProductCategory | 'all';
  stockStatus: StockStatus;
  isFeatured: string; // 'all' | 'true' | 'false'
  isPublished: string; // 'all' | 'true' | 'false'
  priceRange: [number, number];
}

const ProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { showNotification } = useNotification();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('$createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    stockStatus: 'all',
    isFeatured: 'all',
    isPublished: 'all',
    priceRange: [0, 1000000], // Default range
  });

  // Calculate price range from products
  const priceRange = useMemo((): [number, number] => {
    if (products.length === 0) return [0, 1000000];
    const prices = products.map(p => p.newPrice);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  // Update price range when products change
  React.useEffect(() => {
    const [min, max] = priceRange;
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  }, [priceRange]);

  const handleOpenDialog = (product: Product | null = null) => {
    setEditingProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleSubmitProduct = async (formData: Omit<Product, '$id'>, imageFiles: File[]) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.$id, formData, imageFiles);
        showNotification('Product updated successfully!', 'success');
      } else {
        await addProduct(formData, imageFiles);
        showNotification('Product created successfully!', 'success');
      }
    } catch (error: any) {
      showNotification(error.message || 'Failed to save product', 'error');
      throw error; // Re-throw to prevent dialog from closing
    }
  };

  const getStatus = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return 'Low Stock';
    return 'In Stock';
  };

  const getStockStatusType = (stock: number): StockStatus => {
    if (stock === 0) return 'outOfStock';
    if (stock < 5) return 'lowStock';
    return 'inStock';
  };

  // Enhanced filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Text search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || (
        product.name.toLowerCase().includes(searchLower) ||
        (product.category?.toLowerCase().includes(searchLower) ?? false) ||
        (product.description?.toLowerCase().includes(searchLower) ?? false)
      );

      // Category filter
      const matchesCategory = filters.category === 'all' || product.category === filters.category;

      // Stock status filter
      const productStockStatus = getStockStatusType(product.stock);
      const matchesStockStatus = filters.stockStatus === 'all' || productStockStatus === filters.stockStatus;

             // Featured filter
       const matchesFeatured = filters.isFeatured === 'all' || product.isFeatured === (filters.isFeatured === 'true');

       // Published filter
       const matchesPublished = filters.isPublished === 'all' || product.isPublished === (filters.isPublished === 'true');

      // Price range filter
      const matchesPriceRange = product.newPrice >= filters.priceRange[0] && product.newPrice <= filters.priceRange[1];

      return matchesSearch && matchesCategory && matchesStockStatus && matchesFeatured && matchesPublished && matchesPriceRange;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'newPrice':
          aValue = a.newPrice;
          bValue = b.newPrice;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case '$createdAt':
          aValue = new Date(a.$createdAt || 0).getTime();
          bValue = new Date(b.$createdAt || 0).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, filters, sortField, sortOrder]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleEdit = (product: Product) => {
    handleOpenDialog(product);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        showNotification('Product deleted successfully!', 'success');
      } catch (error: any) {
        showNotification(error.message || 'Failed to delete product', 'error');
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      stockStatus: 'all',
      isFeatured: 'all',
      isPublished: 'all',
      priceRange: priceRange,
    });
    setSearchTerm('');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.stockStatus !== 'all') count++;
    if (filters.isFeatured !== 'all') count++;
    if (filters.isPublished !== 'all') count++;
    if (filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1]) count++;
    if (searchTerm) count++;
    return count;
  }, [filters, searchTerm, priceRange]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products ({filteredAndSortedProducts.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>

      {/* Search and Filter Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products by name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
          >
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
          {activeFiltersCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={clearFilters}
              color="secondary"
              sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
            >
              Clear
            </Button>
          )}
        </Box>

        {/* Filter Options */}
        <Collapse in={showFilters}>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as ProductCategory | 'all' }))}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="MATCHA">Matcha</MenuItem>
                  <MenuItem value="SWEET">Sweet</MenuItem>
                  <MenuItem value="TOOL">Tool</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Stock Status</InputLabel>
                <Select
                  value={filters.stockStatus}
                  label="Stock Status"
                  onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e.target.value as StockStatus }))}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="inStock">In Stock</MenuItem>
                  <MenuItem value="lowStock">Low Stock</MenuItem>
                  <MenuItem value="outOfStock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Featured</InputLabel>
                                 <Select
                   value={filters.isFeatured}
                   label="Featured"
                   onChange={(e) => setFilters(prev => ({ ...prev, isFeatured: e.target.value as string }))}
                 >
                   <MenuItem value="all">All</MenuItem>
                   <MenuItem value="true">Featured</MenuItem>
                   <MenuItem value="false">Not Featured</MenuItem>
                 </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Published</InputLabel>
                                 <Select
                   value={filters.isPublished}
                   label="Published"
                   onChange={(e) => setFilters(prev => ({ ...prev, isPublished: e.target.value as string }))}
                 >
                   <MenuItem value="all">All</MenuItem>
                   <MenuItem value="true">Published</MenuItem>
                   <MenuItem value="false">Draft</MenuItem>
                 </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Price Range: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
              </Typography>
              <Slider
                value={filters.priceRange}
                onChange={(_, newValue) => setFilters(prev => ({ ...prev, priceRange: newValue as [number, number] }))}
                min={priceRange[0]}
                max={priceRange[1]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value.toLocaleString()}`}
              />
            </Grid>
          </Grid>
        </Collapse>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Active Filters:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => setSearchTerm('')}
                  size="small"
                  color="primary"
                />
              )}
              {filters.category !== 'all' && (
                <Chip
                  label={`Category: ${filters.category}`}
                  onDelete={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                  size="small"
                  color="primary"
                />
              )}
              {filters.stockStatus !== 'all' && (
                <Chip
                  label={`Status: ${filters.stockStatus}`}
                  onDelete={() => setFilters(prev => ({ ...prev, stockStatus: 'all' }))}
                  size="small"
                  color="primary"
                />
              )}
              {filters.isFeatured !== 'all' && (
                <Chip
                  label={`Featured: ${filters.isFeatured ? 'Yes' : 'No'}`}
                  onDelete={() => setFilters(prev => ({ ...prev, isFeatured: 'all' }))}
                  size="small"
                  color="primary"
                />
              )}
              {filters.isPublished !== 'all' && (
                <Chip
                  label={`Published: ${filters.isPublished ? 'Yes' : 'No'}`}
                  onDelete={() => setFilters(prev => ({ ...prev, isPublished: 'all' }))}
                  size="small"
                  color="primary"
                />
              )}
              {(filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1]) && (
                <Chip
                  label={`Price: $${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`}
                  onDelete={() => setFilters(prev => ({ ...prev, priceRange: priceRange }))}
                  size="small"
                  color="primary"
                />
              )}
            </Stack>
          </Box>
        )}
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Details</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'category'}
                  direction={sortField === 'category' ? sortOrder : 'asc'}
                  onClick={() => handleSort('category')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'newPrice'}
                  direction={sortField === 'newPrice' ? sortOrder : 'asc'}
                  onClick={() => handleSort('newPrice')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'stock'}
                  direction={sortField === 'stock' ? sortOrder : 'asc'}
                  onClick={() => handleSort('stock')}
                >
                  Stock
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Published</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <Fragment key={product.$id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setExpandedProduct(expandedProduct === product.$id ? null : product.$id)}
                      >
                        {expandedProduct === product.$id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">${product.newPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">{product.stock}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          p: 0.5,
                          borderRadius: 1,
                          backgroundColor: (() => {
                            const status = getStatus(product.stock);
                            return status === 'In Stock'
                              ? 'success.light'
                              : status === 'Low Stock'
                              ? 'warning.light'
                              : 'error.light';
                          })(),
                          color: 'white',
                          fontSize: '0.75rem',
                        }}
                      >
                        {getStatus(product.stock)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          p: 0.5,
                          borderRadius: 1,
                          backgroundColor: product.isFeatured ? 'success.light' : 'grey.300',
                          color: 'white',
                          fontSize: '0.75rem',
                        }}
                      >
                        {product.isFeatured ? 'Yes' : 'No'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          p: 0.5,
                          borderRadius: 1,
                          backgroundColor: product.isPublished ? 'success.light' : 'grey.300',
                          color: 'white',
                          fontSize: '0.75rem',
                        }}
                      >
                        {product.isPublished ? 'Yes' : 'No'}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(product)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product.$id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                      <Collapse in={expandedProduct === product.$id} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Product Features
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {product.features?.length ? (
                              product.features.map((feature, idx) => (
                                <Paper key={idx} sx={{ p: 2, minWidth: 250, flex: '1 1 300px' }}>
                                  <Typography variant="subtitle1">{feature.name}</Typography>
                                  <Box sx={{ mt: 1 }}>
                                    <Box><strong>Price:</strong> ${feature.price.toFixed(2)}</Box>
                                    <Box>
                                      <strong>Status:</strong> {feature.inStock ? (
                                        <Box component="span" sx={{ color: 'success.main' }}>In Stock</Box>
                                      ) : (
                                        <Box component="span" sx={{ color: 'error.main' }}>Out of Stock</Box>
                                      )}
                                    </Box>
                                    {feature.weight && <Box><strong>Weight:</strong> {feature.weight}g</Box>}
                                    {feature.dimensions && <Box><strong>Dimensions:</strong> {feature.dimensions}</Box>}
                                    {feature.origin && <Box><strong>Origin:</strong> {feature.origin}</Box>}
                                    {feature.material?.length > 0 && (
                                      <Box>
                                        <strong>Materials:</strong> {feature.material.join(', ')}
                                      </Box>
                                    )}
                                    {feature.attributes && Object.entries(feature.attributes).length > 0 && (
                                      <Box sx={{ mt: 1 }}>
                                        <strong>Attributes:</strong>
                                        <Box component="ul" sx={{ pl: 2, mt: 0.5, mb: 0 }}>
                                          {Object.entries(feature.attributes).map(([key, value]) => (
                                            <li key={key}>
                                              <strong>{key}:</strong> {String(value)}
                                            </li>
                                          ))}
                                        </Box>
                                      </Box>
                                    )}
                                  </Box>
                                </Paper>
                              ))
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No features available for this product.
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredAndSortedProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <ProductDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitProduct}
        editingProduct={editingProduct}
      />
    </Box>
  );
};

export default ProductsPage;
