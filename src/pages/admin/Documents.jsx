// Documents.jsx — Full Document Verification Module

import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem, IconButton, Tooltip,
  Snackbar, Alert, Typography, Chip
} from '@mui/material';
import { Eye, CheckCircle, XCircle, Upload, Trash2, FileText, User, FileCheck } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import DetailModal, { DetailSection, DetailField } from '../../components/Common/DetailGrid';
import { documentService } from '../../services/documentService';
import { storageService } from '../../services/storageService';
import { authService } from '../../services/authService';

const DOC_TYPES = ['Aadhaar', 'PAN Card', 'Bank Statement', 'Salary Slip', 'Address Proof', 'Photo', 'ITR', 'Property Document', 'GST Certificate'];
const DOC_STATUSES = ['Uploaded', 'Pending Verification', 'Approved', 'Rejected'];

const emptyDoc = { applicationId: '', customerId: '', customerName: '', type: '', fileName: '', fileSize: '1.2 MB' };

const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyDoc);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const currentUser = authService.getCurrentUser();
  const canVerify = ['admin', 'officer', 'sales'].includes(currentUser?.role);

  const customers = storageService.get('customers') || [];
  const applications = storageService.get('applications') || [];

  const load = () => setDocs(documentService.getAll());
  useEffect(load, []);

  const handleUpload = () => {
    if (!form.type || !form.fileName) {
      setSnack({ open: true, msg: 'Document type and file name are required.', severity: 'error' }); return;
    }
    documentService.create(form);
    setSnack({ open: true, msg: 'Document uploaded successfully.', severity: 'success' });
    setOpen(false); load();
  };

  const handleApprove = (doc) => {
    documentService.approve(doc.id, currentUser?.name);
    setSnack({ open: true, msg: `${doc.type} approved.`, severity: 'success' });
    load();
  };

  const handleReject = () => {
    documentService.reject(selected.id, rejectRemarks, currentUser?.name);
    setSnack({ open: true, msg: 'Document rejected with remarks.', severity: 'info' });
    setRejectOpen(false); load();
  };

  const columns = [
    { field: 'id', header: 'Doc ID', render: r => <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 600 }}>{r.id}</span> },
    { field: 'customerDetails', header: 'Customer', render: r => <Box><div style={{ fontWeight: 600 }}>{r.customerName || '—'}</div><div className="cell-sub" style={{ color: 'var(--purple)', fontWeight: 500 }}>{r.applicationId}</div></Box> },
    { field: 'type', header: 'Document', render: r => <Box><StatusBadge status={r.type} /><div className="cell-sub">{new Date(r.uploadDate).toLocaleDateString('en-IN')}</div></Box> },
    { field: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
    {
      field: 'actions', header: 'Actions',
      render: r => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="View"><IconButton size="small" onClick={() => { setSelected(r); setViewOpen(true); }} className="table-action-btn view"><Eye size={14} /></IconButton></Tooltip>
          {canVerify && r.status !== 'Approved' && (
            <Tooltip title="Approve"><IconButton size="small" onClick={() => handleApprove(r)} sx={{ color: 'var(--success)', '&:hover': { bgcolor: 'var(--success-bg)' } }}><CheckCircle size={14} /></IconButton></Tooltip>
          )}
          {canVerify && r.status !== 'Rejected' && (
            <Tooltip title="Reject"><IconButton size="small" onClick={() => { setSelected(r); setRejectRemarks(''); setRejectOpen(true); }} sx={{ color: 'var(--error)', '&:hover': { bgcolor: 'var(--error-bg)' } }}><XCircle size={14} /></IconButton></Tooltip>
          )}
          {currentUser?.role === 'admin' && (
            <Tooltip title="Delete"><IconButton size="small" onClick={() => { setSelected(r); setDeleteOpen(true); }} className="table-action-btn delete"><Trash2 size={14} /></IconButton></Tooltip>
          )}
        </Box>
      )
    }
  ];

  return (
    <Box>
      <PageHeader title="Document Verification" subtitle="Review, approve, or reject customer documents." actionLabel="Upload Document" onAction={() => { setForm(emptyDoc); setOpen(true); }} />
      <DataTable columns={columns} data={docs} searchPlaceholder="Search by customer, App ID, doc type..."
        filters={[
          { field: 'status', label: 'Status', options: DOC_STATUSES },
          { field: 'type', label: 'Doc Type', options: DOC_TYPES },
        ]}
      />

      {/* Upload Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Upload Document</DialogTitle>
        <DialogContent>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth select label="Customer" value={form.customerId} onChange={e => {
                const cust = customers.find(c => c.id === e.target.value);
                setForm(p => ({ ...p, customerId: e.target.value, customerName: cust?.name || '' }));
              }}>
                {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.name} — {c.mobile}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth select label="Application" value={form.applicationId} onChange={e => setForm(p => ({ ...p, applicationId: e.target.value }))}>
                {applications.filter(a => !form.customerId || a.customerId === form.customerId).map(a => <MenuItem key={a.id} value={a.id}>{a.id} — {a.loanType}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth select label="Document Type *" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value, fileName: `${e.target.value.replace(/ /g,'_')}_${form.customerId || 'doc'}.pdf` }))}>
                {DOC_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="File Name *" value={form.fileName} onChange={e => setForm(p => ({ ...p, fileName: e.target.value }))} helperText="Enter filename or simulate upload (e.g. Aadhaar_rahul.pdf)" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpload} startIcon={<Upload size={15} />} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 600 }}>Upload Document</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <DetailModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        name={selected?.type || 'Document'}
        subtitle={`Application ID: ${selected?.applicationId || '—'}`}
        pills={<StatusBadge status={selected?.status} />}
        actions={
          <>
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </>
        }
      >
        {selected && (
          <Box>
            <DetailSection icon={FileText} title="Document Details">
              <DetailField label="Document ID" value={selected.id} component={<span style={{ fontSize: 14, fontWeight: 700, color: '#3B82F6' }}>{selected.id}</span>} />
              <DetailField label="Document Type" value={selected.type} />
              <DetailField label="File Name" value={selected.fileName} />
              <DetailField label="File Size" value={selected.fileSize || 'Unknown'} />
              <DetailField label="Upload Date" value={new Date(selected.uploadDate).toLocaleDateString('en-IN')} />
            </DetailSection>

            <DetailSection icon={User} title="Customer Information">
              <DetailField label="Customer Name" value={selected.customerName} />
              <DetailField label="Application ID" value={selected.applicationId} />
            </DetailSection>

            {selected.remarks && (
              <Box sx={{ bgcolor: 'var(--error-bg)', border: '1px solid var(--error)', borderRadius: 2, p: 2, mb: 2 }}>
                <Typography variant="caption" fontWeight={700} color="error">Rejection Remarks</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>{selected.remarks}</Typography>
              </Box>
            )}
          </Box>
        )}
      </DetailModal>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700} sx={{ color: 'var(--error)' }}>Reject Document</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>Provide rejection reason — this will be visible to the customer.</Typography>
          <TextField fullWidth label="Rejection Remarks *" multiline rows={3} value={rejectRemarks} onChange={e => setRejectRemarks(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setRejectOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleReject} disabled={!rejectRemarks.trim()} sx={{ fontWeight: 600 }}>Reject Document</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => { documentService.delete(selected?.id); load(); setSnack({ open: true, msg: 'Document deleted.', severity: 'info' }); }}
        title="Delete Document" message={`Delete document ${selected?.id}?`} confirmLabel="Delete" />

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Documents;
