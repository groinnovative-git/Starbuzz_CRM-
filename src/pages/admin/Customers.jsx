// Customers.jsx — Full CRUD Customer Management

import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem, IconButton, Tooltip,
  Snackbar, Alert, Typography, Divider, Chip, Tab, Tabs
} from '@mui/material';
import { Eye, Edit, Trash2, Plus, User, Briefcase, MapPin } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import DetailModal, { DetailSection, DetailField, CibilScore } from '../../components/Common/DetailGrid';
import { customerService } from '../../services/customerService';
import { applicationService } from '../../services/applicationService';
import { authService } from '../../services/authService';

const genders = ['Male', 'Female', 'Other'];
const employmentTypes = ['Salaried', 'Self-Employed', 'Business', 'Govt Service', 'PSU', 'Student', 'Retired'];
const indianStates = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

const emptyCustomer = {
  name: '', dob: '', gender: '', email: '', mobile: '',
  panNumber: '', aadhaarNumber: '', employer: '', designation: '',
  employmentType: 'Salaried', monthlyIncome: '', existingEmi: '',
  currentAddress: '', permanentAddress: '', city: '', state: '', pincode: '',
  cibil: '',
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyCustomer);
  const [editId, setEditId] = useState(null);
  const [viewTab, setViewTab] = useState(0);
  const [custApps, setCustApps] = useState([]);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const currentUser = authService.getCurrentUser();

  const load = () => setCustomers(customerService.getAll());
  useEffect(load, []);

  const handleOpen = (cust = null) => {
    if (cust) { setForm({ ...emptyCustomer, ...cust }); setEditId(cust.id); }
    else { setForm(emptyCustomer); setEditId(null); }
    setOpen(true);
  };

  const handleView = (cust) => {
    setSelected(cust);
    setCustApps(applicationService.getByCustomerId(cust.id));
    setViewTab(0);
    setViewOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.mobile) {
      setSnack({ open: true, msg: 'Name and Mobile are required.', severity: 'error' }); return;
    }
    if (editId) {
      customerService.update(editId, form);
      setSnack({ open: true, msg: 'Customer updated successfully.', severity: 'success' });
    } else {
      customerService.create(form);
      setSnack({ open: true, msg: 'Customer added successfully.', severity: 'success' });
    }
    setOpen(false); load();
  };

  const handleDelete = () => {
    customerService.delete(selected.id);
    setSnack({ open: true, msg: 'Customer deleted.', severity: 'info' });
    load();
  };

  const f = (field) => ({
    value: form[field] || '',
    onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value }))
  });

  const columns = [
    { field: 'id', header: 'ID', render: r => <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 600 }}>{r.id}</span> },
    { field: 'name', header: 'Name', render: r => <Box><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.email}</div></Box> },
    { field: 'mobile', header: 'Mobile', render: r => <div style={{ fontWeight: 500 }}>{r.mobile}</div> },
    { field: 'financials', header: 'Financials', render: r => <Box><div style={{ fontWeight: 600 }}>₹{Number(r.monthlyIncome || 0).toLocaleString('en-IN')}/mo</div><div className="cell-sub">{r.employmentType || '—'}</div></Box> },
    { field: 'cibil', header: 'CIBIL', render: r => r.cibil ? <StatusBadge status={Number(r.cibil)} /> : '—' },
    {
      field: 'actions', header: 'Actions',
      render: r => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="View Profile"><IconButton size="small" onClick={() => handleView(r)} className="table-action-btn view"><Eye size={15} /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpen(r)} className="table-action-btn edit"><Edit size={15} /></IconButton></Tooltip>
          {currentUser?.role === 'admin' && (
            <Tooltip title="Delete"><IconButton size="small" onClick={() => { setSelected(r); setDeleteOpen(true); }} className="table-action-btn delete"><Trash2 size={15} /></IconButton></Tooltip>
          )}
        </Box>
      )
    }
  ];

  return (
    <Box>
      <PageHeader title="Customer Management" subtitle="Manage registered customers and view their complete profiles." actionLabel="Add Customer" onAction={() => handleOpen()} />
      <DataTable columns={columns} data={customers} searchPlaceholder="Search by name, mobile, city..." filters={[{ field: 'employmentType', label: 'Employment', options: employmentTypes }, { field: 'state', label: 'State', options: indianStates }]} />

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{editId ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        <DialogContent dividers>
          <Box mb={2}><div className="form-section-title"><Plus size={14} /> Personal Information</div></Box>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name *" {...f('name')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Mobile Number *" {...f('mobile')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email Address" {...f('email')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} {...f('dob')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Gender" {...f('gender')}>{genders.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="PAN Number" {...f('panNumber')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Aadhaar Number" {...f('aadhaarNumber')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="CIBIL Score" type="number" {...f('cibil')} /></Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Box mb={2}><div className="form-section-title">Employment Details</div></Box>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Employment Type" {...f('employmentType')}>{employmentTypes.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Employer / Company" {...f('employer')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Designation" {...f('designation')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Monthly Income (₹)" type="number" {...f('monthlyIncome')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Existing EMI (₹)" type="number" {...f('existingEmi')} /></Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Box mb={2}><div className="form-section-title">Address Details</div></Box>
          <Grid container spacing={2.5}>
            <Grid item xs={12}><TextField fullWidth label="Current Address" multiline rows={2} {...f('currentAddress')} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Permanent Address" multiline rows={2} {...f('permanentAddress')} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="City" {...f('city')} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth select label="State" {...f('state')}>{indianStates.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="PIN Code" {...f('pincode')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 600 }}>
            {editId ? 'Update Customer' : 'Add Customer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog — uses reusable DetailModal system */}
      <DetailModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        name={selected?.name}
        subtitle={`${selected?.city || ''}${selected?.city && selected?.state ? ', ' : ''}${selected?.state || ''} · ${selected?.employmentType || 'Customer'}`}
        pills={<StatusBadge status="Active" />}
        tabs={['Profile', `Applications (${custApps.length})`]}
        activeTab={viewTab}
        onTabChange={setViewTab}
        actions={
          <>
            <Button onClick={() => { setViewOpen(false); handleOpen(selected); }} variant="outlined" size="small">Edit</Button>
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </>
        }
      >
        {viewTab === 0 && selected && (
          <Box>
            <DetailSection icon={User} title="Personal Information">
              <DetailField label="Customer ID" value={selected.id} component={<span style={{ fontSize: 14, fontWeight: 700, color: '#3B82F6' }}>{selected.id}</span>} />
              <DetailField label="Date of Birth" value={selected.dob} />
              <DetailField label="Gender" value={selected.gender} />
              <DetailField label="Mobile" value={selected.mobile} />
              <DetailField label="Email" value={selected.email} />
              <DetailField label="PAN" value={selected.panNumber} />
              <DetailField label="Aadhaar" value={selected.aadhaarNumber} />
              <DetailField label="CIBIL Score" component={<CibilScore score={selected.cibil} />} />
            </DetailSection>

            <DetailSection icon={Briefcase} title="Employment Details">
              <DetailField label="Employment Type" value={selected.employmentType} />
              <DetailField label="Employer" value={selected.employer} />
              <DetailField label="Designation" value={selected.designation} />
              <DetailField label="Monthly Income" value={`₹${Number(selected.monthlyIncome || 0).toLocaleString('en-IN')}`} />
              <DetailField label="Existing EMI" value={`₹${Number(selected.existingEmi || 0).toLocaleString('en-IN')}`} />
            </DetailSection>

            <DetailSection icon={MapPin} title="Address Information">
              <DetailField label="Current Address" value={selected.currentAddress} />
              <DetailField label="City" value={selected.city} />
              <DetailField label="State" value={selected.state} />
              <DetailField label="PIN Code" value={selected.pincode} />
            </DetailSection>
          </Box>
        )}
        {viewTab === 1 && (
          <Box>
            {custApps.length === 0 ? (
              <Box textAlign="center" py={4} color="var(--text-muted)"><Typography>No applications found for this customer.</Typography></Box>
            ) : (
              <table className="premium-table">
                <thead><tr><th>App ID</th><th>Loan Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {custApps.map(app => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 600, color: 'var(--info)', fontSize: 12 }}>{app.id}</td>
                      <td>{app.loanType}</td>
                      <td>₹{Number(app.requestedAmount).toLocaleString('en-IN')}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td style={{ fontSize: 12 }}>{new Date(app.createdDate).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Box>
        )}
      </DetailModal>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete}
        title="Delete Customer" message={`Delete ${selected?.name}? This action cannot be undone.`} confirmLabel="Delete" />

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Customers;
