// Leads.jsx — Full Lead Management with Follow-ups and Status Workflow

import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem, IconButton, Tooltip,
  Snackbar, Alert, Typography, Divider, Tab, Tabs, Chip
} from '@mui/material';
import { Eye, Edit, Trash2, CalendarPlus, TrendingUp, User, Briefcase, FileText } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import TimelineView from '../../components/Common/TimelineView';
import DetailModal, { DetailSection, DetailField } from '../../components/Common/DetailGrid';
import { leadService } from '../../services/leadService';
import { storageService } from '../../services/storageService';
import { getTimelineFor } from '../../services/timelineService';
import { authService } from '../../services/authService';

const STATUSES = ['New', 'Contacted', 'Interested', 'Not Interested', 'Follow-up', 'Converted', 'Closed'];
const SOURCES = ['Website', 'Walk-in', 'Referral', 'WhatsApp', 'Partner', 'Call', 'Other'];
const LOAN_TYPES = ['Home Loan', 'Personal Loan', 'Business Loan', 'Car Loan', 'Education Loan', 'Gold Loan', 'Loan Against Property', 'MSME Loan'];

const emptyLead = {
  name: '', email: '', mobile: '', loanType: '', loanAmount: '',
  source: 'Website', status: 'New', assignedTo: '', followUpDate: '', notes: ''
};

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [fuOpen, setFuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyLead);
  const [fuForm, setFuForm] = useState({ date: '', notes: '' });
  const [editId, setEditId] = useState(null);
  const [viewTab, setViewTab] = useState(0);
  const [leadTimeline, setLeadTimeline] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const currentUser = authService.getCurrentUser();
  const salesReps = (storageService.get('users') || []).filter(u => ['admin', 'sales', 'officer'].includes(u.role));

  const load = () => setLeads(leadService.getAll());
  useEffect(load, []);

  const handleOpen = (lead = null) => {
    if (lead) { setForm({ ...emptyLead, ...lead }); setEditId(lead.id); }
    else { setForm({ ...emptyLead, assignedTo: currentUser?.name || '' }); setEditId(null); }
    setOpen(true);
  };

  const handleView = (lead) => {
    setSelected(lead);
    setLeadTimeline(getTimelineFor(lead.id));
    setFollowUps(leadService.getFollowUps(lead.id));
    setViewTab(0);
    setViewOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.mobile) {
      setSnack({ open: true, msg: 'Name and Mobile are required.', severity: 'error' }); return;
    }
    if (editId) {
      leadService.update(editId, form);
      setSnack({ open: true, msg: 'Lead updated.', severity: 'success' });
    } else {
      leadService.create(form);
      setSnack({ open: true, msg: 'Lead created.', severity: 'success' });
    }
    setOpen(false); load();
  };

  const handleAddFollowUp = () => {
    if (!fuForm.date) { setSnack({ open: true, msg: 'Please select a follow-up date.', severity: 'error' }); return; }
    leadService.addFollowUp(selected.id, fuForm);
    setSnack({ open: true, msg: 'Follow-up scheduled.', severity: 'success' });
    setFuOpen(false);
    setFollowUps(leadService.getFollowUps(selected.id));
    setLeadTimeline(getTimelineFor(selected.id));
    leadService.update(selected.id, { status: 'Follow-up' });
    load();
  };

  const f = (field) => ({ value: form[field] || '', onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value })) });

  const columns = [
    { field: 'id', header: 'Lead ID', render: r => <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 700 }}>{r.id}</span> },
    { field: 'name', header: 'Name', render: r => <Box><Box display="flex" alignItems="center" gap={1}><div style={{ fontWeight: 600 }}>{r.name}</div><StatusBadge status={r.source} /></Box><div className="cell-sub">{r.mobile}</div></Box> },
    { field: 'loanDetails', header: 'Loan Required', render: r => <Box><div style={{ fontWeight: 600 }}>{r.loanAmount ? `₹${Number(r.loanAmount).toLocaleString('en-IN')}` : '—'}</div><div className="cell-sub">{r.loanType || '—'}</div></Box> },
    { field: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
    { field: 'followUp', header: 'Follow-up', render: r => <Box><div style={{ fontSize: 12, color: new Date(r.followUpDate) < new Date() && r.status === 'Follow-up' ? 'var(--error)' : 'inherit', fontWeight: 500 }}>{r.followUpDate || '—'}</div><div className="cell-sub">{r.assignedTo || 'Unassigned'}</div></Box> },
    {
      field: 'actions', header: 'Actions',
      render: r => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="View"><IconButton size="small" onClick={() => handleView(r)} className="table-action-btn view"><Eye size={14} /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpen(r)} className="table-action-btn edit"><Edit size={14} /></IconButton></Tooltip>
          <Tooltip title="Add Follow-up"><IconButton size="small" onClick={() => { setSelected(r); setFuForm({ date: '', notes: '' }); setFuOpen(true); }} className="table-action-btn success"><CalendarPlus size={14} /></IconButton></Tooltip>
          {r.status !== 'Converted' && (
            <Tooltip title="Mark Converted"><IconButton size="small" onClick={() => { leadService.update(r.id, { status: 'Converted' }); load(); setSnack({ open: true, msg: 'Lead marked as Converted!', severity: 'success' }); }} sx={{ color: 'var(--accent)' }}><TrendingUp size={14} /></IconButton></Tooltip>
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
      <PageHeader title="Lead Management" subtitle="Track and nurture prospective loan customers through the sales funnel." actionLabel="Add Lead" onAction={() => handleOpen()} />
      <DataTable columns={columns} data={leads} searchPlaceholder="Search by name, mobile, loan type..."
        filters={[
          { field: 'status', label: 'Status', options: STATUSES },
          { field: 'source', label: 'Source', options: SOURCES },
          { field: 'loanType', label: 'Loan Type', options: LOAN_TYPES },
          { field: 'assignedTo', label: 'Assigned To', options: salesReps.map(s => s.name) },
        ]}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>{editId ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name *" {...f('name')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Mobile *" {...f('mobile')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email" type="email" {...f('email')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Loan Type" {...f('loanType')}>{LOAN_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Loan Amount (₹)" type="number" {...f('loanAmount')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Source" {...f('source')}>{SOURCES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth select label="Status" {...f('status')}>{STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Assigned To" {...f('assignedTo')}>
                {salesReps.map(s => <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Follow-up Date" type="date" InputLabelProps={{ shrink: true }} {...f('followUpDate')} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Notes" multiline rows={3} {...f('notes')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 600 }}>
            {editId ? 'Update Lead' : 'Create Lead'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Lead Dialog */}
      <DetailModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        name={selected?.name}
        subtitle={`${selected?.loanType || 'Lead'} · ${selected?.source || 'Direct'}`}
        pills={<StatusBadge status={selected?.status} />}
        tabs={['Details', `Follow-ups (${followUps.length})`, 'Timeline']}
        activeTab={viewTab}
        onTabChange={setViewTab}
        actions={
          <>
            <Button onClick={() => { setFuForm({ date: '', notes: '' }); setFuOpen(true); }} variant="outlined" size="small" startIcon={<CalendarPlus size={14} />}>Add Follow-up</Button>
            <Button onClick={() => { setViewOpen(false); handleOpen(selected); }} variant="outlined" size="small">Edit</Button>
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </>
        }
      >
        {viewTab === 0 && selected && (
          <Box>
            <DetailSection icon={User} title="Contact Information">
              <DetailField label="Lead ID" value={selected.id} component={<span style={{ fontSize: 14, fontWeight: 700, color: '#3B82F6' }}>{selected.id}</span>} />
              <DetailField label="Mobile" value={selected.mobile} />
              <DetailField label="Email" value={selected.email} />
            </DetailSection>

            <DetailSection icon={Briefcase} title="Loan Requirements">
              <DetailField label="Loan Type" value={selected.loanType} />
              <DetailField label="Loan Amount" value={selected.loanAmount ? `₹${Number(selected.loanAmount).toLocaleString('en-IN')}` : '—'} />
              <DetailField label="Source" value={selected.source} />
            </DetailSection>
            
            <DetailSection icon={FileText} title="Tracking & Notes">
              <DetailField label="Assigned To" value={selected.assignedTo} />
              <DetailField label="Follow-up Date" value={selected.followUpDate || '—'} component={<span style={{ color: new Date(selected.followUpDate) < new Date() && selected.status === 'Follow-up' ? 'var(--error)' : 'inherit', fontWeight: 600, fontSize: 14 }}>{selected.followUpDate || '—'}</span>} />
              <DetailField label="Created On" value={new Date(selected.createdDate).toLocaleDateString('en-IN')} />
              {selected.notes && (
                <DetailField fullWidth label="Notes" value={selected.notes} component={<Box sx={{ mt: 0.5, p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid var(--border-light)' }}><Typography variant="body2">{selected.notes}</Typography></Box>} />
              )}
            </DetailSection>
          </Box>
        )}
        {viewTab === 1 && (
          <Box>
            {followUps.length === 0 ? <Box textAlign="center" py={4} color="var(--text-muted)"><Typography>No follow-ups scheduled yet.</Typography></Box> : (
              followUps.map((fu, i) => (
                <Box key={i} sx={{ mb: 1.5, p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid var(--border-light)' }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" fontWeight={600}>{fu.date}</Typography>
                    <Chip label={fu.status} size="small" color={fu.status === 'Completed' ? 'success' : 'warning'} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">{fu.notes}</Typography>
                </Box>
              ))
            )}
          </Box>
        )}
        {viewTab === 2 && <TimelineView entries={leadTimeline} emptyText="No timeline entries yet." />}
      </DetailModal>

      {/* Follow-up Dialog */}
      <Dialog open={fuOpen} onClose={() => setFuOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Schedule Follow-up — {selected?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Follow-up Date *" type="date" InputLabelProps={{ shrink: true }} value={fuForm.date} onChange={e => setFuForm(p => ({ ...p, date: e.target.value }))} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Notes / Action to take" multiline rows={3} value={fuForm.notes} onChange={e => setFuForm(p => ({ ...p, notes: e.target.value }))} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setFuOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddFollowUp} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 600 }}>Schedule Follow-up</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => { leadService.delete(selected?.id); load(); setSnack({ open: true, msg: 'Lead deleted.', severity: 'info' }); }}
        title="Delete Lead" message={`Delete lead ${selected?.name}?`} confirmLabel="Delete" />

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Leads;
