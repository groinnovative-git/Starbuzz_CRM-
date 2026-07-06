// Applications.jsx — Full Application Management with Approve/Reject/Disburse

import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem, IconButton, Tooltip,
  Snackbar, Alert, Typography, Divider, Chip, Tab, Tabs, LinearProgress
} from '@mui/material';
import { Eye, Edit, Trash2, CheckCircle, XCircle, Wallet, Plus, ChevronRight, User, Briefcase, Activity } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import TimelineView from '../../components/Common/TimelineView';
import DetailModal, { DetailSection, DetailField } from '../../components/Common/DetailGrid';
import { applicationService } from '../../services/applicationService';
import { customerService } from '../../services/customerService';
import { documentService } from '../../services/documentService';
import { storageService } from '../../services/storageService';
import { getTimelineFor } from '../../services/timelineService';
import { authService } from '../../services/authService';

const APP_STATUSES = ['New Application', 'Under Review', 'Document Pending', 'Document Verified', 'Approved', 'Rejected', 'Disbursed'];
const SALES_STATUSES = ['New Application', 'Under Review', 'Document Pending'];
const OFFICER_STATUSES = ['Under Review', 'Document Pending', 'Document Verified', 'Approved', 'Rejected', 'Disbursed'];

const emptyApp = {
  customerId: '', customerName: '', loanType: '', requestedAmount: '',
  tenure: 12, purpose: '', monthlyIncome: '', existingEmi: 0, assignedOfficer: '',
};

const StatusStep = ({ statuses, current }) => {
  const idx = statuses.indexOf(current);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', py: 1 }}>
      {statuses.map((s, i) => (
        <Box key={s} sx={{ display: 'flex', alignItems: 'center', flex: i < statuses.length - 1 ? 1 : 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
            <Box sx={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: i < idx ? 'var(--success)' : i === idx ? 'var(--accent)' : 'var(--border)',
              color: i <= idx ? '#fff' : 'var(--text-muted)', fontSize: 11, fontWeight: 700, mb: 0.5,
            }}>{i < idx ? '✓' : i + 1}</Box>
            <Typography variant="caption" sx={{ fontSize: 9.5, textAlign: 'center', fontWeight: i === idx ? 700 : 400, color: i === idx ? 'var(--accent)' : i < idx ? 'var(--success)' : 'var(--text-muted)', lineHeight: 1.2 }}>{s.replace('Application', 'App')}</Typography>
          </Box>
          {i < statuses.length - 1 && <Box sx={{ flex: 1, height: 2, bgcolor: i < idx ? 'var(--success)' : 'var(--border)', minWidth: 12, mx: 0.3, mt: -2 }} />}
        </Box>
      ))}
    </Box>
  );
};

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [disburseOpen, setDisburseOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyApp);
  const [editId, setEditId] = useState(null);
  const [viewTab, setViewTab] = useState(0);
  const [statusForm, setStatusForm] = useState({ status: '', remark: '' });
  const [approveAmt, setApproveAmt] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [disburseAmt, setDisburseAmt] = useState('');
  const [appDocs, setAppDocs] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const currentUser = authService.getCurrentUser();
  const isOfficer = currentUser?.role === 'officer';
  const isAdmin = currentUser?.role === 'admin';
  const canApprove = isOfficer || isAdmin;

  const customers = customerService.getAll();
  const loanCategories = storageService.get('loanCategories') || [];
  const officers = (storageService.get('users') || []).filter(u => u.role === 'officer');

  const load = () => setApps(applicationService.getAll());
  useEffect(load, []);

  const getAllowedStatuses = () => isOfficer ? OFFICER_STATUSES : isAdmin ? APP_STATUSES : SALES_STATUSES;

  const handleView = (app) => {
    setSelected(app);
    setAppDocs(documentService.getByApplicationId(app.id));
    setTimeline(getTimelineFor(app.id));
    setViewTab(0);
    setViewOpen(true);
  };

  const handleOpen = (app = null) => {
    if (app) { setForm({ ...emptyApp, ...app }); setEditId(app.id); }
    else { setForm(emptyApp); setEditId(null); }
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.customerId || !form.loanType || !form.requestedAmount) {
      setSnack({ open: true, msg: 'Customer, Loan Type, and Amount are required.', severity: 'error' }); return;
    }
    const cust = customers.find(c => c.id === form.customerId);
    if (editId) {
      applicationService.update(editId, form);
      setSnack({ open: true, msg: 'Application updated.', severity: 'success' });
    } else {
      applicationService.create({ ...form, customerName: cust?.name || form.customerName, monthlyIncome: cust?.monthlyIncome || form.monthlyIncome });
      setSnack({ open: true, msg: 'Application created.', severity: 'success' });
    }
    setOpen(false); load();
  };

  const handleStatusUpdate = () => {
    applicationService.updateStatus(selected.id, statusForm.status, statusForm.remark, currentUser?.name);
    setSnack({ open: true, msg: `Status updated to ${statusForm.status}`, severity: 'success' });
    setStatusOpen(false); load();
    if (viewOpen) { setSelected(applicationService.getById(selected.id)); setTimeline(getTimelineFor(selected.id)); }
  };

  const handleApprove = () => {
    applicationService.approve(selected.id, approveAmt || selected.requestedAmount, 'Loan approved.', currentUser?.name);
    setSnack({ open: true, msg: 'Loan application approved!', severity: 'success' });
    setApproveOpen(false); load();
  };

  const handleReject = () => {
    applicationService.reject(selected.id, rejectReason, currentUser?.name);
    setSnack({ open: true, msg: 'Application rejected.', severity: 'info' });
    setRejectOpen(false); load();
  };

  const handleDisburse = () => {
    applicationService.disburse(selected.id, disburseAmt || selected?.approvedAmount || selected?.requestedAmount, currentUser?.name);
    setSnack({ open: true, msg: 'Loan disbursed! EMI schedule generated.', severity: 'success' });
    setDisburseOpen(false); load();
  };

  const f = (field) => ({ value: form[field] || '', onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value })) });

  const columns = [
    { field: 'id', header: 'App ID', render: r => <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 700 }}>{r.id}</span> },
    { field: 'customerName', header: 'Customer', render: r => <span style={{ fontWeight: 600 }}>{r.customerName}</span> },
    { field: 'loanDetails', header: 'Loan Request', render: r => <Box><div style={{ fontWeight: 600 }}>₹{Number(r.requestedAmount).toLocaleString('en-IN')} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ {r.tenure}mo</span></div><div className="cell-sub">{r.loanType}</div></Box> },
    { field: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
    { field: 'assignedOfficer', header: 'Officer', render: r => <Box><div style={{ fontSize: 12 }}>{r.assignedOfficer || 'Unassigned'}</div><div className="cell-sub">{new Date(r.createdDate).toLocaleDateString('en-IN')}</div></Box> },
    {
      field: 'actions', header: 'Actions',
      render: r => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="View Details"><IconButton size="small" onClick={() => handleView(r)} className="table-action-btn view"><Eye size={14} /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpen(r)} className="table-action-btn edit"><Edit size={14} /></IconButton></Tooltip>
          {canApprove && r.status === 'Document Verified' && (
            <Tooltip title="Approve"><IconButton size="small" onClick={() => { setSelected(r); setApproveAmt(r.requestedAmount); setApproveOpen(true); }} sx={{ color: 'var(--success)' }}><CheckCircle size={14} /></IconButton></Tooltip>
          )}
          {canApprove && !['Rejected', 'Disbursed', 'Closed'].includes(r.status) && (
            <Tooltip title="Reject"><IconButton size="small" onClick={() => { setSelected(r); setRejectReason(''); setRejectOpen(true); }} sx={{ color: 'var(--error)' }}><XCircle size={14} /></IconButton></Tooltip>
          )}
          {canApprove && r.status === 'Approved' && (
            <Tooltip title="Disburse"><IconButton size="small" onClick={() => { setSelected(r); setDisburseAmt(r.approvedAmount || r.requestedAmount); setDisburseOpen(true); }} sx={{ color: 'var(--purple)' }}><Wallet size={14} /></IconButton></Tooltip>
          )}
          {isAdmin && (
            <Tooltip title="Delete"><IconButton size="small" onClick={() => { setSelected(r); setDeleteOpen(true); }} className="table-action-btn delete"><Trash2 size={14} /></IconButton></Tooltip>
          )}
        </Box>
      )
    }
  ];

  return (
    <Box>
      <PageHeader title="Loan Applications" subtitle="Process, verify, approve, and disburse loan applications." actionLabel="New Application" onAction={() => handleOpen()} />
      <DataTable columns={columns} data={apps} searchPlaceholder="Search by customer, app ID, loan type..."
        filters={[
          { field: 'status', label: 'Status', options: APP_STATUSES },
          { field: 'loanType', label: 'Loan Type', options: loanCategories.map(c => c.name) },
          { field: 'assignedOfficer', label: 'Officer', options: officers.map(o => o.name) },
        ]}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editId ? 'Edit Application' : 'New Loan Application'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Customer *" value={form.customerId} onChange={e => {
                const c = customers.find(x => x.id === e.target.value);
                setForm(p => ({ ...p, customerId: e.target.value, customerName: c?.name || '', monthlyIncome: c?.monthlyIncome || '' }));
              }}>
                {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.name} — {c.mobile}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Loan Type *" {...f('loanType')}>{loanCategories.map(c => <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Requested Amount (₹) *" type="number" {...f('requestedAmount')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Tenure (months)" type="number" {...f('tenure')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Monthly Income (₹)" type="number" {...f('monthlyIncome')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Existing EMI (₹)" type="number" {...f('existingEmi')} /></Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Assigned Officer" {...f('assignedOfficer')}>
                {officers.map(o => <MenuItem key={o.id} value={o.name}>{o.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth select label="Status" 
                value={form.status || 'New Application'} 
                onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              >
                {getAllowedStatuses().map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="Purpose / Description" multiline rows={3} {...f('purpose')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 600 }}>
            {editId ? 'Update Application' : 'Create Application'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <DetailModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        name={selected?.customerName}
        subtitle={`${selected?.loanType} Application`}
        pills={<StatusBadge status={selected?.status} />}
        tabs={['Details', `Documents (${appDocs.length})`, 'Timeline']}
        activeTab={viewTab}
        onTabChange={setViewTab}
        headerActions={
          <Box display="flex" gap={1} flexWrap="wrap">
            {canApprove && selected?.status === 'Document Verified' && (
              <Button size="small" variant="contained" color="success" startIcon={<CheckCircle size={14} />} onClick={() => { setApproveAmt(selected.requestedAmount); setApproveOpen(true); }}>Approve</Button>
            )}
            {canApprove && selected?.status === 'Approved' && (
              <Button size="small" variant="contained" startIcon={<Wallet size={14} />} onClick={() => { setDisburseAmt(selected.approvedAmount || selected.requestedAmount); setDisburseOpen(true); }} sx={{ bgcolor: 'var(--purple)' }}>Disburse</Button>
            )}
            {canApprove && !['Rejected', 'Disbursed'].includes(selected?.status) && (
              <Button size="small" variant="outlined" color="error" startIcon={<XCircle size={14} />} onClick={() => { setRejectReason(''); setRejectOpen(true); }}>Reject</Button>
            )}
            {!['Rejected', 'Disbursed', 'Approved'].includes(selected?.status) && (
              <Button size="small" variant="outlined" onClick={() => { setStatusForm({ status: selected?.status, remark: '' }); setStatusOpen(true); }}>Update Status</Button>
            )}
          </Box>
        }
      >
        {selected && viewTab === 0 && (
          <Box>
            <Box mb={3} px={1}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>Application Progress</Typography>
              <Box mt={1.5}><StatusStep statuses={APP_STATUSES} current={selected.status} /></Box>
            </Box>
            
            <DetailSection icon={User} title="Customer Overview">
              <DetailField label="App ID" value={selected.id} component={<span style={{ fontSize: 14, fontWeight: 700, color: '#3B82F6' }}>{selected.id}</span>} />
              <DetailField label="Customer" value={selected.customerName} />
              <DetailField label="Applied Date" value={new Date(selected.createdDate).toLocaleDateString('en-IN')} />
            </DetailSection>

            <DetailSection icon={Briefcase} title="Loan Details">
              <DetailField label="Loan Type" value={selected.loanType} />
              <DetailField label="Requested Amount" value={`₹${Number(selected.requestedAmount).toLocaleString('en-IN')}`} />
              <DetailField label="Tenure" value={`${selected.tenure} months`} />
              <DetailField label="Approved Amount" value={selected.approvedAmount ? `₹${Number(selected.approvedAmount).toLocaleString('en-IN')}` : '—'} component={selected.approvedAmount ? <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{Number(selected.approvedAmount).toLocaleString('en-IN')}</span> : null} />
              <DetailField label="Disbursed Amount" value={selected.disbursedAmount ? `₹${Number(selected.disbursedAmount).toLocaleString('en-IN')}` : '—'} component={selected.disbursedAmount ? <span style={{ fontWeight: 700, color: 'var(--purple)' }}>₹{Number(selected.disbursedAmount).toLocaleString('en-IN')}</span> : null} />
              <DetailField label="Purpose" value={selected.purpose} />
            </DetailSection>

            <DetailSection icon={Activity} title="Financials & Tracking">
              <DetailField label="Monthly Income" value={`₹${Number(selected.monthlyIncome || 0).toLocaleString('en-IN')}`} />
              <DetailField label="Existing EMI" value={`₹${Number(selected.existingEmi || 0).toLocaleString('en-IN')}`} />
              <DetailField label="Assigned Officer" value={selected.assignedOfficer || 'Unassigned'} />
            </DetailSection>

            {selected.rejectionReason && (
              <Box sx={{ bgcolor: 'var(--error-bg)', border: '1px solid', borderColor: 'var(--error)', borderRadius: 2, p: 2, mb: 3 }}>
                <Typography variant="caption" fontWeight={700} color="error">Rejection Reason</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>{selected.rejectionReason}</Typography>
              </Box>
            )}

            {selected.statusHistory?.length > 0 && (
              <DetailSection title="Status History">
                <Box display="flex" flexDirection="column" gap={1} width="100%">
                  {selected.statusHistory.map((h, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 2, p: 1.5, borderRadius: 2, bgcolor: '#fff', border: '1px solid var(--border-light)' }}>
                      <StatusBadge status={h.status} />
                      <Box flex={1}>
                        <Typography variant="caption" color="text.secondary">{h.remark}</Typography>
                        <Typography variant="caption" display="block" color="text.disabled" sx={{ mt: 0.3 }}>By {h.by} · {new Date(h.date).toLocaleString('en-IN')}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </DetailSection>
            )}
          </Box>
        )}
          {viewTab === 1 && (
            <Box>
              {appDocs.length === 0 ? <Box textAlign="center" py={4} color="var(--text-muted)"><Typography>No documents uploaded yet.</Typography></Box> : (
                <table className="premium-table">
                  <thead><tr><th>Type</th><th>File</th><th>Uploaded</th><th>Status</th><th>Remarks</th></tr></thead>
                  <tbody>
                    {appDocs.map(doc => (
                      <tr key={doc.id}>
                        <td style={{ fontWeight: 600 }}>{doc.type}</td>
                        <td style={{ fontSize: 12 }}>{doc.fileName}</td>
                        <td style={{ fontSize: 12 }}>{new Date(doc.uploadDate).toLocaleDateString('en-IN')}</td>
                        <td><StatusBadge status={doc.status} /></td>
                        <td style={{ fontSize: 12, color: 'var(--error)' }}>{doc.remarks || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Box>
          )}
          {viewTab === 2 && <TimelineView entries={timeline} emptyText="No timeline entries yet." />}
      </DetailModal>

      {/* Update Status Dialog */}
      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Update Application Status</DialogTitle>
        <DialogContent>
          <TextField fullWidth select label="New Status" value={statusForm.status} onChange={e => setStatusForm(p => ({ ...p, status: e.target.value }))} sx={{ mt: 1, mb: 2 }}>
            {getAllowedStatuses().map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField fullWidth label="Remark / Notes" multiline rows={3} value={statusForm.remark} onChange={e => setStatusForm(p => ({ ...p, remark: e.target.value }))} />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setStatusOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusUpdate} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 600 }}>Update Status</Button>
        </DialogActions>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveOpen} onClose={() => setApproveOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700} sx={{ color: 'var(--success)' }}>Approve Loan Application</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>Enter the approved loan amount for {selected?.customerName}.</Typography>
          <TextField fullWidth label="Approved Amount (₹)" type="number" value={approveAmt} onChange={e => setApproveAmt(e.target.value)} sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setApproveOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApprove} color="success" sx={{ fontWeight: 600 }}>Approve Loan</Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700} sx={{ color: 'var(--error)' }}>Reject Loan Application</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>Please provide a reason for rejection.</Typography>
          <TextField fullWidth label="Rejection Reason *" multiline rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setRejectOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleReject} disabled={!rejectReason.trim()} sx={{ fontWeight: 600 }}>Confirm Reject</Button>
        </DialogActions>
      </Dialog>

      {/* Disburse Dialog */}
      <Dialog open={disburseOpen} onClose={() => setDisburseOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700} sx={{ color: 'var(--purple)' }}>Disburse Loan</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>Confirm disbursement amount. EMI schedule will be auto-generated.</Typography>
          <TextField fullWidth label="Disbursed Amount (₹)" type="number" value={disburseAmt} onChange={e => setDisburseAmt(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDisburseOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDisburse} sx={{ bgcolor: 'var(--purple)', '&:hover': { bgcolor: '#7C3AED' }, fontWeight: 600 }}>Disburse Loan</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => { applicationService.delete(selected?.id); load(); setSnack({ open: true, msg: 'Application deleted.', severity: 'info' }); }}
        title="Delete Application" message={`Delete application ${selected?.id}? This action cannot be undone.`} confirmLabel="Delete" />

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Applications;
