// Collections.jsx — Full EMI Collection Management

import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, IconButton, Tooltip,
  Snackbar, Alert, Typography, Card, CardContent
} from '@mui/material';
import { IndianRupee, AlertTriangle, CheckCircle, Clock, TrendingDown } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import { collectionService } from '../../services/collectionService';
import { authService } from '../../services/authService';

const STATUSES = ['Paid', 'Partial', 'Overdue', 'Pending'];

const SummaryCard = ({ label, value, icon, color, sub }) => (
  <Card sx={{ borderRadius: 2.5, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 }}>{label}</Typography>
          <Typography variant="h4" fontWeight={800} sx={{ color, mt: 0.5, fontSize: 28 }}>{value}</Typography>
          {sub && <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>{sub}</Typography>}
        </Box>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [summary, setSummary] = useState({});
  const [payOpen, setPayOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const currentUser = authService.getCurrentUser();

  const load = () => {
    setCollections(collectionService.getAll());
    setSummary(collectionService.getSummary());
  };
  useEffect(load, []);

  const handlePayment = () => {
    const amt = Number(payAmount);
    if (!amt || amt <= 0) { setSnack({ open: true, msg: 'Enter a valid payment amount.', severity: 'error' }); return; }
    collectionService.markPaid(selected.id, amt, currentUser?.name);
    setSnack({ open: true, msg: `Payment of ₹${amt.toLocaleString('en-IN')} recorded.`, severity: 'success' });
    setPayOpen(false);
    load();
  };

  const handleMarkOverdue = (col) => {
    collectionService.markOverdue(col.id);
    setSnack({ open: true, msg: 'EMI marked as overdue.', severity: 'warning' });
    load();
  };

  const columns = [
    { field: 'applicationId', header: 'App ID', render: r => <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 600 }}>{r.applicationId}</span> },
    { field: 'customerDetails', header: 'Customer', render: r => <Box><div style={{ fontWeight: 600 }}>{r.customerName || '—'}</div><div className="cell-sub">{r.loanType || '—'}</div></Box> },
    { field: 'emiPeriod', header: 'EMI Month', render: r => <Box><div style={{ fontWeight: 500 }}>{r.emiMonth}</div><div className="cell-sub">Due: {r.dueDate}</div></Box> },
    { field: 'financials', header: 'Financials', render: r => <Box><div style={{ fontWeight: 600 }}>₹{Number(r.emiAmount).toLocaleString('en-IN')}</div><div className="cell-sub" style={{ color: r.balanceAmount > 0 ? 'var(--error)' : 'var(--success)' }}>Bal: ₹{Number(r.balanceAmount || 0).toLocaleString('en-IN')}</div></Box> },
    { field: 'paymentStatus', header: 'Status', render: r => <StatusBadge status={r.paymentStatus} /> },
    {
      field: 'actions', header: 'Actions',
      render: r => (
        <Box display="flex" gap={0.5}>
          {!['Paid'].includes(r.paymentStatus) && (
            <Tooltip title="Record Payment">
              <IconButton size="small" onClick={() => { setSelected(r); setPayAmount(r.emiAmount); setPayOpen(true); }} sx={{ color: 'var(--success)', '&:hover': { bgcolor: 'var(--success-bg)' } }}>
                <IndianRupee size={14} />
              </IconButton>
            </Tooltip>
          )}
          {r.paymentStatus === 'Pending' && (
            <Tooltip title="Mark Overdue">
              <IconButton size="small" onClick={() => handleMarkOverdue(r)} sx={{ color: 'var(--error)', '&:hover': { bgcolor: 'var(--error-bg)' } }}>
                <AlertTriangle size={14} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  return (
    <Box>
      <PageHeader title="Collections & EMI Tracking" subtitle="Track EMI payments, record collections, and manage overdue accounts." />

      {/* Summary Cards */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={6} sm={3}><SummaryCard label="Total EMIs" value={summary.total || 0} icon={<Clock size={20} />} color="var(--info)" sub={`₹${((summary.totalDue || 0) / 100000).toFixed(1)}L total due`} /></Grid>
        <Grid item xs={6} sm={3}><SummaryCard label="Paid" value={summary.paid || 0} icon={<CheckCircle size={20} />} color="var(--success)" sub={`₹${((summary.totalCollected || 0) / 100000).toFixed(1)}L collected`} /></Grid>
        <Grid item xs={6} sm={3}><SummaryCard label="Overdue" value={summary.overdue || 0} icon={<AlertTriangle size={20} />} color="var(--error)" sub="Requires immediate action" /></Grid>
        <Grid item xs={6} sm={3}><SummaryCard label="Partial / Pending" value={(summary.partial || 0) + (summary.pending || 0)} icon={<TrendingDown size={20} />} color="var(--warning)" sub={`${summary.partial || 0} partial, ${summary.pending || 0} pending`} /></Grid>
      </Grid>

      <DataTable columns={columns} data={collections} searchPlaceholder="Search by customer, app ID..."
        filters={[{ field: 'paymentStatus', label: 'Status', options: STATUSES }]}
      />

      {/* Record Payment Dialog */}
      <Dialog open={payOpen} onClose={() => setPayOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700} sx={{ color: 'var(--success)' }}>Record EMI Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 2, p: 2, mb: 2, border: '1px solid var(--border-light)' }}>
            <Typography variant="body2" color="text.secondary">EMI Month: <strong>{selected?.emiMonth}</strong></Typography>
            <Typography variant="body2" color="text.secondary">EMI Amount: <strong>₹{Number(selected?.emiAmount || 0).toLocaleString('en-IN')}</strong></Typography>
            <Typography variant="body2" color="text.secondary">Customer: <strong>{selected?.customerName}</strong></Typography>
          </Box>
          <TextField fullWidth label="Amount Received (₹)" type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)}
            helperText={Number(payAmount) < Number(selected?.emiAmount) && payAmount ? `Short by ₹${(Number(selected?.emiAmount) - Number(payAmount)).toLocaleString('en-IN')} — will be marked Partial` : ''} />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setPayOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePayment} color="success" sx={{ fontWeight: 600 }}>Confirm Payment</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Collections;
