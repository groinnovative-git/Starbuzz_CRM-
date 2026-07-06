// Tickets.jsx — Full Support Ticket Management

import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem, IconButton, Tooltip,
  Snackbar, Alert, Typography, Chip, Divider
} from '@mui/material';
import { Eye, MessageSquare, CheckCircle, Trash2, User, AlertCircle, MessageCircle } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import DetailModal, { DetailSection, DetailField } from '../../components/Common/DetailGrid';
import { ticketService } from '../../services/ticketService';
import { storageService } from '../../services/storageService';
import { authService } from '../../services/authService';

const TICKET_STATUSES = ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const CATEGORIES = ['General Query', 'Document Issue', 'Disbursement Delay', 'Portal Access', 'EMI Issue', 'Application Status', 'Other'];

const priorityColor = { High: 'error', Medium: 'warning', Low: 'info' };

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [responseOpen, setResponseOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const currentUser = authService.getCurrentUser();
  const staff = (storageService.get('users') || []).filter(u => ['admin', 'officer', 'sales'].includes(u.role));

  const load = () => setTickets(ticketService.getAll());
  useEffect(load, []);

  const handleView = (ticket) => { setSelected(ticket); setViewOpen(true); };

  const handleAddResponse = () => {
    if (!responseText.trim()) return;
    ticketService.addResponse(selected.id, responseText, currentUser?.name);
    setSnack({ open: true, msg: 'Response added.', severity: 'success' });
    setResponseOpen(false);
    setSelected(ticketService.getById(selected.id));
    load();
  };

  const handleChangeStatus = () => {
    ticketService.changeStatus(selected.id, newStatus, currentUser?.name);
    setSnack({ open: true, msg: `Ticket ${newStatus}.`, severity: 'success' });
    setStatusOpen(false);
    setSelected(ticketService.getById(selected.id));
    load();
  };

  const handleAssign = (ticketId, assignee) => {
    ticketService.update(ticketId, { assignedTo: assignee, status: 'Assigned' });
    setSnack({ open: true, msg: `Ticket assigned to ${assignee}.`, severity: 'success' });
    load();
  };

  const columns = [
    { field: 'id', header: 'Ticket ID', render: r => <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 700 }}>{r.id}</span> },
    { field: 'customerName', header: 'Customer', render: r => <span style={{ fontWeight: 600 }}>{r.customerName}</span> },
    { field: 'issue', header: 'Issue', render: r => <Box><Box display="flex" alignItems="center" gap={1}><div className="truncate" style={{ fontWeight: 600, maxWidth: 200 }}>{r.subject}</div><StatusBadge status={r.category} /></Box><div className="cell-sub">Raised {new Date(r.createdDate).toLocaleDateString('en-IN')}</div></Box> },
    { field: 'priority', header: 'Priority', render: r => <StatusBadge status={r.priority} /> },
    { field: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
    { field: 'assignedTo', header: 'Assigned To', render: r => r.assignedTo || <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Unassigned</span> },
    {
      field: 'actions', header: 'Actions',
      render: r => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="View Ticket"><IconButton size="small" onClick={() => handleView(r)} className="table-action-btn view"><Eye size={14} /></IconButton></Tooltip>
          <Tooltip title="Add Response"><IconButton size="small" onClick={() => { setSelected(r); setResponseText(''); setResponseOpen(true); }} className="table-action-btn success"><MessageSquare size={14} /></IconButton></Tooltip>
          {!['Resolved', 'Closed'].includes(r.status) && (
            <Tooltip title="Mark Resolved"><IconButton size="small" onClick={() => { ticketService.changeStatus(r.id, 'Resolved', currentUser?.name); load(); setSnack({ open: true, msg: 'Ticket resolved.', severity: 'success' }); }} sx={{ color: 'var(--success)', '&:hover': { bgcolor: 'var(--success-bg)' } }}><CheckCircle size={14} /></IconButton></Tooltip>
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
      <PageHeader title="Support Tickets" subtitle="Manage and respond to customer support queries." />
      <DataTable columns={columns} data={tickets} searchPlaceholder="Search by customer, ticket ID, subject..."
        filters={[
          { field: 'status', label: 'Status', options: TICKET_STATUSES },
          { field: 'priority', label: 'Priority', options: PRIORITIES },
          { field: 'category', label: 'Category', options: CATEGORIES },
        ]}
      />

      {/* View Dialog */}
      <DetailModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        name={selected?.subject || 'Ticket'}
        subtitle={`${selected?.category} · Raised by ${selected?.customerName}`}
        pills={
          <>
            <Chip label={selected?.priority} size="small" color={priorityColor[selected?.priority] || 'default'} />
            <StatusBadge status={selected?.status} />
          </>
        }
        actions={
          <>
            <Button onClick={() => { setNewStatus(selected?.status); setStatusOpen(true); }}>Change Status</Button>
            <Button variant="contained" onClick={() => { setResponseText(''); setResponseOpen(true); }} startIcon={<MessageSquare size={14} />} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' } }}>Add Response</Button>
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </>
        }
      >
        {selected && (
          <Box>
            <DetailSection icon={AlertCircle} title="Issue Details">
              <DetailField label="Ticket ID" value={selected.id} component={<span style={{ fontSize: 14, fontWeight: 700, color: '#3B82F6' }}>{selected.id}</span>} />
              <DetailField label="Category" value={selected.category} />
              <DetailField label="Created" value={new Date(selected.createdDate).toLocaleString('en-IN')} />
              <DetailField fullWidth label="Description" value={selected.description} component={<Box sx={{ mt: 0.5, p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid var(--border-light)' }}><Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{selected.description}</Typography></Box>} />
            </DetailSection>

            <DetailSection icon={User} title="Assignment">
              <DetailField label="Assigned To" value={selected.assignedTo || 'Unassigned'} component={
                <TextField select size="small" value={selected.assignedTo || ''} onChange={e => { handleAssign(selected.id, e.target.value); setSelected({ ...selected, assignedTo: e.target.value, status: 'Assigned' }); }} sx={{ minWidth: 200, '& .MuiSelect-select': { py: 0.5, fontSize: 13 } }}>
                  <MenuItem value="" sx={{ fontSize: 13 }}><em>Unassigned</em></MenuItem>
                  {staff.map(s => <MenuItem key={s.id} value={s.name} sx={{ fontSize: 13 }}>{s.name}</MenuItem>)}
                </TextField>
              } />
            </DetailSection>

            <DetailSection icon={MessageCircle} title={`Responses (${(selected.responses || []).length})`}>
              <Box width="100%">
                {(selected.responses || []).length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3, color: 'var(--text-muted)' }}>
                    <Typography variant="body2">No responses yet. Be the first to respond.</Typography>
                  </Box>
                ) : (
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {(selected.responses || []).map((resp, i) => (
                      <Box key={i} sx={{ bgcolor: 'var(--accent-light)', border: '1px solid', borderColor: 'rgba(0,191,165,0.2)', borderRadius: 2, p: 2 }}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="caption" fontWeight={700} color="var(--accent)">{resp.by}</Typography>
                          <Typography variant="caption" color="text.disabled">{new Date(resp.date).toLocaleString('en-IN')}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{resp.text}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </DetailSection>
          </Box>
        )}
      </DetailModal>

      {/* Add Response Dialog */}
      <Dialog open={responseOpen} onClose={() => setResponseOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Add Response — {selected?.id}</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline rows={5} label="Your Response *" value={responseText} onChange={e => setResponseText(e.target.value)} sx={{ mt: 1 }} placeholder="Type your response to the customer..." />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setResponseOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddResponse} disabled={!responseText.trim()} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 600 }}>Send Response</Button>
        </DialogActions>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Change Ticket Status</DialogTitle>
        <DialogContent>
          <TextField fullWidth select label="New Status" value={newStatus} onChange={e => setNewStatus(e.target.value)} sx={{ mt: 1 }}>
            {TICKET_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setStatusOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleChangeStatus} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 600 }}>Update Status</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => { ticketService.delete(selected?.id); load(); setSnack({ open: true, msg: 'Ticket deleted.', severity: 'info' }); }}
        title="Delete Ticket" message={`Delete ticket ${selected?.id}?`} confirmLabel="Delete" />

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Tickets;
