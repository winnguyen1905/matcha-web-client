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

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Out of Stock' | 'Low Stock';
}

const ProductsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const products: Product[] = [
    { id: '1', name: 'Matcha Latte', category: 'Drinks', price: 4.99, stock: 50, status: 'In Stock' },
    { id: '2', name: 'Matcha Ice Cream', category: 'Desserts', price: 3.99, stock: 25, status: 'In Stock' },
    { id: '3', name: 'Matcha Cake', category: 'Desserts', price: 5.99, stock: 3, status: 'Low Stock' },
    { id: '4', name: 'Matcha Cookies', category: 'Snacks', price: 2.99, stock: 0, status: 'Out of Stock' },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id: string) => {
    // Handle edit
    console.log('Edit product:', id);
  };

  const handleDelete = (id: string) => {
    // Handle delete
    console.log('Delete product:', id);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
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
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{product.stock}</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        p: 0.5,
                        borderRadius: 1,
                        backgroundColor:
                          product.status === 'In Stock'
                            ? 'success.light'
                            : product.status === 'Low Stock'
                            ? 'warning.light'
                            : 'error.light',
                        color: 'white',
                        fontSize: '0.75rem',
                      }}
                    >
                      {product.status}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(product.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.id)}>
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
    </Box>
  );
};

export default ProductsPage;
