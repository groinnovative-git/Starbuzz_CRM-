import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem, IconButton, Tooltip,
  Snackbar, Alert, Chip, Typography
} from '@mui/material';
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight, Megaphone } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { newsService } from '../../services/newsService';
import { authService } from '../../services/authService';

const CATEGORIES = ['Offer', 'Alert', 'General', 'Maintenance'];

const emptyNews = { title: '', category: 'General', content: '', status: 'Active' };

const Announcements = () => {
  const [news, setNews] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyNews);
  const [editId, setEditId] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const load = () => setNews(newsService.getAll());
  useEffect(load, []);

  const handleOpen = (item = null) => {
    if (item) { setForm(item); setEditId(item.id); }
    else { setForm(emptyNews); setEditId(null); }
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.content) {
      setSnack({ open: true, msg: 'Title and content are required.', severity: 'error' }); return;
    }
    
    const user = authService.getCurrentUser() || { name: 'Admin' };
    const payload = { ...form, author: user.name };

    if (editId) {
      newsService.update(editId, payload);
      setSnack({ open: true, msg: 'Announcement updated.', severity: 'success' });
    } else {
      newsService.create(payload);
      setSnack({ open: true, msg: 'Announcement posted to Customer Portal!', severity: 'success' });
    }
    setOpen(false); load();
  };

  const handleToggle = (item) => {
    newsService.update(item.id, { status: item.status === 'Active' ? 'Inactive' : 'Active' });
    setSnack({ open: true, msg: `Announcement ${item.status === 'Active' ? 'hidden' : 'published'}.`, severity: 'info' });
    load();
  };

  const f = (field) => ({ value: form[field] || '', onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value })) });

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Offer': return 'success';
      case 'Alert': return 'error';
      case 'Maintenance': return 'warning';
      default: return 'info';
    }
  };

  const columns = [
    { field: 'id', header: 'ID', render: r => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.id}</span> },
    { field: 'title', header: 'Title', render: r => <Box><div style={{ fontWeight: 600 }}>{r.title}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Posted by {r.author}</div></Box> },
    { field: 'category', header: 'Category', render: r => <Chip label={r.category} size="small" color={getCategoryColor(r.category)} sx={{ fontSize: 11, fontWeight: 700 }} /> },
    { field: 'date', header: 'Posted On', render: r => new Date(r.date).toLocaleDateString('en-IN') },
    { field: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
    {
      field: 'actions', header: 'Actions',
      render: r => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="View"><IconButton size="small" onClick={() => { setSelected(r); setViewOpen(true); }} className="table-action-btn view"><Eye size={14} /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpen(r)} className="table-action-btn edit"><Edit size={14} /></IconButton></Tooltip>
          <Tooltip title={r.status === 'Active' ? 'Hide' : 'Publish'}>
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
      <PageHeader 
        title="Announcements & Offers" 
        subtitle="Manage news, offers, and alerts displayed on the Customer Portal dashboard." 
        actionLabel="Post New" 
        onAction={() => handleOpen()} 
      />
      
      <DataTable 
        columns={columns} 
        data={news} 
        searchPlaceholder="Search announcements..."
        filters={[{ field: 'category', label: 'Category', options: CATEGORIES }, { field: 'status', label: 'Status', options: ['Active', 'Inactive'] }]}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={800} sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Megaphone size={20} color="var(--accent)" />
          {editId ? 'Edit Announcement' : 'New Announcement'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Announcement Title *" {...f('title')} /></Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Category" {...f('category')}>
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Status" {...f('status')}>
                <MenuItem value="Active">Active (Visible)</MenuItem>
                <MenuItem value="Inactive">Inactive (Hidden)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Content (Message) *" {...f('content')} placeholder="Write the offer details or newsletter content here..." />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 600 }}>
            {editId ? 'Update' : 'Post to Portal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: 'var(--shadow-xl)' } }}>
        <DialogTitle fontWeight={800} sx={{ pb: 2 }}>Preview Announcement</DialogTitle>
        <DialogContent dividers sx={{ p: 3, bgcolor: '#F8FAFC' }}>
          {selected && (
            <Box sx={{ bgcolor: '#fff', p: 3, borderRadius: 2, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="h6" fontWeight={800} color="var(--text-main)">{selected.title}</Typography>
                <Chip label={selected.category} size="small" color={getCategoryColor(selected.category)} sx={{ fontWeight: 700 }} />
              </Box>
              <Typography variant="body2" color="text.secondary" mb={3} sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {selected.content}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} borderTop="1px solid var(--border-light)">
                <Typography variant="caption" color="text.secondary" fontWeight={600}>By {selected.author}</Typography>
                <Typography variant="caption" color="text.secondary">{new Date(selected.date).toLocaleString('en-IN')}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setViewOpen(false)}>Close Preview</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => { newsService.delete(selected?.id); load(); setSnack({ open: true, msg: 'Deleted.', severity: 'info' }); }}
        title="Delete Announcement" message={`Delete "${selected?.title}"?`} confirmLabel="Delete" />

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Announcements;
