// CustomerTickets.jsx — Customer raises and views support tickets

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, TextField, MenuItem, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Chip, Divider
} from '@mui/material';
import { Plus, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { customerService } from '../../services/customerService';
import { ticketService } from '../../services/ticketService';
import StatusBadge from '../../components/Common/StatusBadge';

const CATEGORIES = ['General Query', 'Document Issue', 'Disbursement Delay', 'Portal Access', 'EMI Issue', 'Application Status', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const priorityColor = { High: 'error', Medium: 'warning', Low: 'info' };

const TicketCard = ({ ticket, onView }) => (
  <Box 
    sx={{ 
      bgcolor: 'var(--surface)', borderRadius: 3, border: '1px solid var(--border-light)', 
      p: 3, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
      boxShadow: 'var(--shadow-sm)',
      '&:hover': { boxShadow: 'var(--shadow-lg)', transform: 'translateY(-4px)', borderColor: 'var(--accent)' } 
    }} 
    onClick={() => onView(ticket)}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Box display="flex" gap={1.5} alignItems="center">
        <Typography variant="caption" sx={{ bgcolor: 'var(--bg-light)', color: 'var(--text-main)', px: 1.5, py: 0.5, borderRadius: 1.5, fontWeight: 800, letterSpacing: 0.5 }}>
          {ticket.id}
        </Typography>
        <Chip label={ticket.priority} size="small" color={priorityColor[ticket.priority] || 'default'} sx={{ height: 24, fontWeight: 700, fontSize: 11 }} />
      </Box>
      <StatusBadge status={ticket.status} />
    </Box>
    
    <Typography variant="h6" fontWeight={800} mb={1} sx={{ color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
      {ticket.subject}
    </Typography>
    
    <Divider sx={{ my: 2, opacity: 0.6 }} />
    
    <Box display="flex" justifyContent="space-between" alignItems="flex-end">
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
          {ticket.category}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Clock size={12} color="var(--text-muted)" />
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Raised {new Date(ticket.createdDate).toLocaleDateString('en-IN')}
          </Typography>
        </Box>
      </Box>
      
      <Box>
        {ticket.responses?.length > 0 ? (
          <Chip 
            icon={<MessageSquare size={14} />} 
            label={`${ticket.responses.length} Response(s)`} 
            size="small" 
            sx={{ bgcolor: 'var(--accent-light)', color: 'var(--accent-dark)', fontWeight: 700, height: 26, '& .MuiChip-icon': { color: 'var(--accent-dark)' } }} 
          />
        ) : (
          <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ fontStyle: 'italic' }}>Awaiting Support</Typography>
        )}
      </Box>
    </Box>
  </Box>
);

const CustomerTickets = () => {
  const user = authService.getCurrentUser() || {};
  const [tickets, setTickets] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ category: 'General Query', priority: 'Medium', subject: '', description: '' });
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const load = (cust) => {
    const c = cust || customer;
    if (c) setTickets(ticketService.getByCustomerId(c.id));
  };

  useEffect(() => {
    const cust = customerService.getByUserId(user.id);
    setCustomer(cust);
    if (cust) setTickets(ticketService.getByCustomerId(cust.id));
  }, []);

  const handleSubmit = () => {
    if (!form.subject.trim() || !form.description.trim()) {
      setSnack({ open: true, msg: 'Subject and description are required.', severity: 'error' }); return;
    }
    ticketService.create({ ...form, customerId: customer?.id || 'GUEST', customerName: user.name || 'Customer' });
    setSnack({ open: true, msg: 'Ticket raised successfully! We will respond within 24 hours.', severity: 'success' });
    setOpen(false);
    load(customer);
    setForm({ category: 'General Query', priority: 'Medium', subject: '', description: '' });
  };

  const openTickets = tickets.filter(t => ['Open', 'Assigned', 'In Progress'].includes(t.status));
  const closedTickets = tickets.filter(t => ['Resolved', 'Closed'].includes(t.status));

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="var(--text-main)">Support Tickets</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Raise and track your support requests with our team.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setOpen(true)}
          sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 700, borderRadius: 2, px: 3, py: 1, boxShadow: 'var(--shadow-md)' }}>
          Raise Ticket
        </Button>
      </Box>

      {tickets.length === 0 ? (
        <Box textAlign="center" py={10} sx={{ bgcolor: 'var(--surface)', borderRadius: 3, border: '1px dashed var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <MessageSquare size={56} style={{ opacity: 0.2, marginBottom: 16, color: 'var(--text-main)' }} />
          <Typography variant="h6" fontWeight={700} color="var(--text-main)">No Support Tickets</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>You don't have any support tickets. Raise one if you need help.</Typography>
        </Box>
      ) : (
        <>
          {openTickets.length > 0 && (
            <Box mb={5}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
                <Clock size={20} color="var(--accent)" />
                <Typography variant="subtitle1" fontWeight={800} color="var(--text-main)">Active Tickets ({openTickets.length})</Typography>
              </Box>
              <Grid container spacing={3}>
                {openTickets.map(t => <Grid item xs={12} md={6} lg={4} key={t.id}><TicketCard ticket={t} onView={t => { setSelected(t); setViewOpen(true); }} /></Grid>)}
              </Grid>
            </Box>
          )}
          {closedTickets.length > 0 && (
            <Box>
              <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
                <CheckCircle size={20} color="var(--success)" />
                <Typography variant="subtitle1" fontWeight={800} color="var(--text-main)">Resolved Tickets ({closedTickets.length})</Typography>
              </Box>
              <Grid container spacing={3}>
                {closedTickets.map(t => <Grid item xs={12} md={6} lg={4} key={t.id}><TicketCard ticket={t} onView={t => { setSelected(t); setViewOpen(true); }} /></Grid>)}
              </Grid>
            </Box>
          )}
        </>
      )}

      {/* Raise Ticket Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: 'var(--shadow-xl)' } }}>
        <DialogTitle fontWeight={800} sx={{ pb: 1 }}>Raise Support Ticket</DialogTitle>
        <DialogContent dividers sx={{ borderBottom: 'none' }}>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Category" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Priority" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                {PRIORITIES.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Subject *" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description *" multiline rows={5} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Please describe your issue in detail..." />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 700, borderRadius: 2, px: 3 }}>
            Submit Ticket
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Ticket Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: 'var(--shadow-xl)' } }}>
        <DialogTitle fontWeight={800} sx={{ pb: 2 }}>Ticket Details</DialogTitle>
        <DialogContent dividers>
          {selected && (
            <>
              <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>
                <Box>
                  <Box display="flex" gap={1.5} alignItems="center" mb={1}>
                    <Typography variant="caption" sx={{ bgcolor: 'var(--bg-light)', color: 'var(--text-main)', px: 1.5, py: 0.5, borderRadius: 1.5, fontWeight: 800 }}>{selected.id}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{selected.category}</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={800}>{selected.subject}</Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Clock size={14} color="var(--text-muted)" />
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>Raised {new Date(selected.createdDate).toLocaleString('en-IN')}</Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={1.5} alignItems="flex-start">
                  <Chip label={selected.priority} size="small" color={priorityColor[selected.priority] || 'default'} sx={{ fontWeight: 700 }} />
                  <StatusBadge status={selected.status} />
                </Box>
              </Box>
              
              <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 3, p: 3, mb: 4, border: '1px solid var(--border-light)' }}>
                <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.description}</Typography>
              </Box>

              <Typography variant="subtitle1" fontWeight={800} mb={2.5}>Support Responses</Typography>
              {(selected.responses || []).length === 0 ? (
                <Box textAlign="center" py={5} sx={{ bgcolor: 'var(--surface)', borderRadius: 3, border: '1px dashed var(--border-light)' }}>
                  <MessageSquare size={32} style={{ opacity: 0.2, marginBottom: 12, color: 'var(--text-main)' }} />
                  <Typography variant="body2" color="var(--text-muted)" fontWeight={500}>Our team will respond shortly. You will receive a notification.</Typography>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" gap={2.5}>
                  {(selected.responses || []).map((resp, i) => (
                    <Box key={i} sx={{ bgcolor: 'var(--accent-light)', border: '1px solid rgba(0,191,165,0.3)', borderRadius: 3, p: 2.5, boxShadow: 'var(--shadow-sm)' }}>
                      <Box display="flex" justifyContent="space-between" mb={1.5} alignItems="center">
                        <Typography variant="caption" fontWeight={800} color="var(--accent-dark)" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MessageSquare size={14} /> Star Buzz Support ({resp.by})
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{new Date(resp.date).toLocaleString('en-IN')}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'var(--text-main)' }}>{resp.text}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button onClick={() => setViewOpen(false)} variant="outlined" sx={{ fontWeight: 700, borderRadius: 2 }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2, fontWeight: 600 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerTickets;
