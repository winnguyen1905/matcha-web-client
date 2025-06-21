import React, { useState } from 'react';
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
} from '@mui/material';
import { Search, Edit, Delete, Add } from '@mui/icons-material';
import { useProducts } from '../../../context/Product';
import type { Product } from '../../../context/Product';
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
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.$id}>
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
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(product)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.$id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
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
