// DiscountAdminPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/system';

import { Discount, DiscountType } from '@/lib/schema';
import { useDiscounts } from '@/hooks/Discount';
import ConfirmDialog from './ConfirmDialog';
import CreateEditDiscountDialog from './CreateEditDiscountDialog';

/* ───────────────────────── styled helpers ─────────────────────────────── */
const StickyHeadCell = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  background: theme.palette.background.paper,
  zIndex: 1,
  fontWeight: 600,
}));

const StripedRow = styled(TableRow)(({ theme }) => ({
  [`&:nth-of-type(odd)`]: {
    backgroundColor: alpha(theme.palette.action.hover, 0.04),
  },
  [`&:hover`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  [`& .${tableCellClasses.body}`]: { borderBottom: 'unset' },
}));

/* ───────────────────────── component ───────────────────────────────────── */
const DiscountAdminPage: React.FC = () => {
  const { discounts, loading, error, init, updateDiscount, deleteDiscount } = useDiscounts();

  /* local state */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterType, setFilterType] = useState<'all' | DiscountType>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; target?: Discount }>({
    open: false,
  });
  const [workingId, setWorkingId] = useState<string | null>(null); // row with async op

  /* initial load */
  useEffect(() => {
    init().catch(console.error);
  }, []);

  /* derived data */
  const filtered = useMemo(() => {
    return discounts
      .filter(d => {
        if (filterActive === 'active' && !d.isActive) return false;
        if (filterActive === 'inactive' && d.isActive) return false;
        if (filterType !== 'all' && d.discountType !== filterType) return false;
        const kw = search.toLowerCase();
        return d.code.toLowerCase().includes(kw) || (d.description ?? '').toLowerCase().includes(kw);
      })
      .sort((a, b) => b.$createdAt!.localeCompare(a.$createdAt!));
  }, [discounts, search, filterActive, filterType]);

  const paged = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage],
  );

  /* handlers */
  const handleToggleActive = async (discount: Discount) => {
    setWorkingId(discount.$id!);
    await updateDiscount(discount.$id!, { isActive: !discount.isActive });
    setWorkingId(null);
  };

  const handleDelete = async () => {
    if (!confirmDelete.target) return;
    setWorkingId(confirmDelete.target.$id!);
    await deleteDiscount(confirmDelete.target.$id!);
    setWorkingId(null);
    setConfirmDelete({ open: false });
  };

  /* render */
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Discount Management
      </Typography>

      {/* Toolbar */}
      <Toolbar disableGutters sx={{ mb: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          flexWrap="wrap"
          alignItems="center"
          width="100%"
        >
          <LoadingButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingDiscount(null);
              setDialogOpen(true);
            }}
          >
            New Discount
          </LoadingButton>

          <Tooltip title="Refresh">
            <IconButton onClick={() => init()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <TextField
            size="small"
            label="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 240 }, ml: 'auto' }}
          />

          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={filterActive}
              onChange={e => setFilterActive(e.target.value as any)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value={DiscountType.PERCENTAGE}>Percentage</MenuItem>
              <MenuItem value={DiscountType.FIXED}>Fixed</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Toolbar>

      {/* Table */}
      <Paper elevation={1} sx={{ position: 'relative' }}>
        {loading && <LinearProgress sx={{ position: 'absolute', inset: 0, height: 3 }} />}

        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', minWidth: 920 }}>
            {/* fixed widths keep layout steady */}
            <colgroup>
              <col style={{ width: 120 }} /> {/* Code */}
              <col style={{ width: 200 }} /> {/* Description (flex) */}
              <col style={{ width: 110 }} /> {/* Type */}
              <col style={{ width: 90 }} />  {/* Value */}
              <col style={{ width: 110 }} /> {/* Usage */}
              <col style={{ width: 80 }} />  {/* Active */}
              <col style={{ width: 120 }} /> {/* Actions */}
            </colgroup>

            <TableHead>
              <TableRow>
                <StickyHeadCell>Code</StickyHeadCell>
                <StickyHeadCell>Description</StickyHeadCell>
                <StickyHeadCell>Type</StickyHeadCell>
                <StickyHeadCell align="right">Value</StickyHeadCell>
                <StickyHeadCell align="right">Usage</StickyHeadCell>
                <StickyHeadCell align="center" sx={{ width: 80 }}>
                  Active
                </StickyHeadCell>
                <StickyHeadCell align="center" sx={{ width: 120 }}>
                  Actions
                </StickyHeadCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paged.map(discount => (
                <StripedRow key={discount.$id}>
                  <TableCell>{discount.code}</TableCell>

                  <TableCell sx={{ maxWidth: 100 }} title={discount.description}>
                    {discount.description}
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={discount.discountType}
                      color={discount.discountType === DiscountType.PERCENTAGE ? 'primary' : 'secondary'}
                    />
                  </TableCell>

                  <TableCell align="right">
                    {discount.discountType === DiscountType.PERCENTAGE
                      ? `${discount.value}%`
                      : `$${discount.value}`}
                  </TableCell>

                  <TableCell align="right">
                    {discount.usageLimit ? (
                      `${discount.usageCount} / ${discount.usageLimit}`
                    ) : (
                      <em>unlimited</em>
                    )}
                  </TableCell>

                  {/* Active (fixed width, no resize) */}
                  <TableCell align="center" sx={{ width: 80 }}>
                    <Switch
                      checked={discount.isActive}
                      onChange={() => handleToggleActive(discount)}
                      size="small"
                      disabled={workingId === discount.$id}
                    />
                  </TableCell>

                  {/* Actions (icon slots stay 32 px wide) */}
                  <TableCell align="center" sx={{ width: 120 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                        position: 'relative',
                        width: 1,
                        minHeight: 32,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingDiscount(discount);
                          setDialogOpen(true);
                        }}
                        disabled={workingId === discount.$id}
                        sx={{ width: 32, height: 32 }}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => setConfirmDelete({ open: true, target: discount })}
                        disabled={workingId === discount.$id}
                        sx={{ width: 32, height: 32 }}
                      >
                        <DeleteIcon fontSize="inherit" color="error" />
                      </IconButton>

                      {workingId === discount.$id && (
                        <CircularProgress
                          size={24}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            mt: '-12px',
                            ml: '-12px',
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                </StripedRow>
              ))}

              {paged.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    {error ?? 'No discounts found.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25, 50]}
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: 1, borderColor: 'divider' }}
        />
      </Paper>

      {/* Dialogs */}
      <CreateEditDiscountDialog
        open={dialogOpen}
        discount={editingDiscount}
        onClose={() => setDialogOpen(false)}
      />

      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Discount"
        description={`Delete discount “${confirmDelete.target?.code}”?`}
        onCancel={() => setConfirmDelete({ open: false })}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default DiscountAdminPage;
