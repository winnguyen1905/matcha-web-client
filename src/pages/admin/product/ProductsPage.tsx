import React, { useState, Fragment } from 'react';
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
} from '@mui/material';
import { Search, Edit, Delete, Add, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useProducts } from '../../../hooks/Product';
import type { Product } from '../../../hooks/Product';
import { useNotification } from '../../../context/NotificationContext';
import ProductDialog from './ProductDialog';

const ProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { showNotification } = useNotification();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

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

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      (product.category?.toLowerCase().includes(searchLower) ?? false) ||
      (product.description?.toLowerCase().includes(searchLower) ?? false)
    );
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatus = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return 'Low Stock';
    return 'In Stock';
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
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
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Details</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Published</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
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
