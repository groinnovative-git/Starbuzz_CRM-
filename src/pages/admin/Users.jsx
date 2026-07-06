// Users.jsx — Full User Management

import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem, IconButton, Tooltip,
  Snackbar, Alert, Chip, Table, TableBody, TableRow, TableCell
} from '@mui/material';
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { userService } from '../../services/userService';

const ROLES = [
  { value: 'admin', label: 'Super Admin' },
  { value: 'officer', label: 'Loan Officer' },
  { value: 'sales', label: 'Sales Officer' },
  { value: 'customer', label: 'Customer' },
];

const emptyUser = { name: '', email: '', password: '', role: 'sales', mobile: '', department: '', status: 'Active' };

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyUser);
  const [editId, setEditId] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const load = () => setUsers(userService.getAll());
  useEffect(load, []);

  const handleOpen = (user = null) => {
    if (user) { setForm({ ...emptyUser, ...user, password: '' }); setEditId(user.id); }
    else { setForm(emptyUser); setEditId(null); }
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email || (!editId && !form.password)) {
      setSnack({ open: true, msg: 'Name, email, and password are required.', severity: 'error' }); return;
    }
    if (editId) {
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password;
      userService.update(editId, updateData);
      setSnack({ open: true, msg: 'User updated.', severity: 'success' });
    } else {
      userService.create(form);
      setSnack({ open: true, msg: 'User created.', severity: 'success' });
    }
    setOpen(false); load();
  };

  const handleToggle = (user) => {
    userService.toggleStatus(user.id);
    setSnack({ open: true, msg: `User ${user.status === 'Active' ? 'deactivated' : 'activated'}.`, severity: 'info' });
    load();
  };

  const f = (field) => ({ value: form[field] || '', onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value })) });

  const getRoleLabel = (role) => ROLES.find(r => r.value === role)?.label || role;

  const columns = [
    { field: 'id', header: 'ID', render: r => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.id}</span> },
    { field: 'name', header: 'Name', render: r => <Box><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.email}</div></Box> },
    { field: 'mobile', header: 'Mobile' },
    { field: 'role', header: 'Role', render: r => <Chip label={getRoleLabel(r.role)} size="small" variant="outlined" sx={{ fontSize: 11, fontWeight: 600, borderColor: 'var(--accent)', color: 'var(--accent)' }} /> },
    { field: 'department', header: 'Department', render: r => r.department || '—' },
    { field: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
    { field: 'joinDate', header: 'Joined', render: r => r.joinDate || '—' },
    {
      field: 'actions', header: 'Actions',
      render: r => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="View"><IconButton size="small" onClick={() => { setSelected(r); setViewOpen(true); }} className="table-action-btn view"><Eye size={14} /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpen(r)} className="table-action-btn edit"><Edit size={14} /></IconButton></Tooltip>
          <Tooltip title={r.status === 'Active' ? 'Deactivate' : 'Activate'}>
            <IconButton size="small" onClick={() => handleToggle(r)} sx={{ color: r.status === 'Active' ? 'var(--success)' : 'var(--text-muted)' }}>
              {r.status === 'Active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete"><IconButton size="small" onClick={() => { setSelected(r); setDeleteOpen(true); }} className="table-action-btn delete"><Trash2 size={14} /></IconButton></Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <PageHeader title="User Management" subtitle="Manage system users, roles, and access permissions." actionLabel="Add User" onAction={() => handleOpen()} />
      <DataTable columns={columns} data={users} searchPlaceholder="Search by name, email, role..."
        filters={[{ field: 'role', label: 'Role', options: ROLES.map(r => r.value) }, { field: 'status', label: 'Status', options: ['Active', 'Inactive'] }]}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>{editId ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name *" {...f('name')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email *" type="email" {...f('email')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label={editId ? "New Password (optional)" : "Password *"} type="password" {...f('password')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Mobile" {...f('mobile')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Role" {...f('role')}>{ROLES.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Department" {...f('department')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 600 }}>
            {editId ? 'Update User' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: 'var(--shadow-xl)' } }}>
        <DialogTitle fontWeight={800} sx={{ pb: 2 }}>User Profile</DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {selected && (
            <Table size="small">
              <TableBody>
                {[
                  ['Name', selected.name], 
                  ['Email', selected.email], 
                  ['Mobile', selected.mobile], 
                  ['Role', getRoleLabel(selected.role)], 
                  ['Department', selected.department || '—'], 
                  ['Status', selected.status === 'Active' ? <Chip label="Active" size="small" color="success" sx={{ height: 22 }} /> : <Chip label="Inactive" size="small" sx={{ height: 22 }} />], 
                  ['Joined', selected.joinDate || '—']
                ].map(([label, value]) => (
                  <TableRow key={label}>
                    <TableCell sx={{ width: '35%', fontWeight: 700, color: 'text.secondary', bgcolor: '#F8FAFC', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 }}>
                      {label}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 14 }}>
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => { setViewOpen(false); handleOpen(selected); }} variant="outlined" size="small">Edit</Button>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => { userService.delete(selected?.id); load(); setSnack({ open: true, msg: 'User deleted.', severity: 'info' }); }}
        title="Delete User" message={`Delete ${selected?.name}?`} confirmLabel="Delete" />

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;
