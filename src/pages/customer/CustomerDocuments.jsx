// CustomerDocuments.jsx — Customer document list with status

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Chip } from '@mui/material';
import { CheckCircle, XCircle, Clock, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { customerService } from '../../services/customerService';
import { documentService } from '../../services/documentService';
import StatusBadge from '../../components/Common/StatusBadge';

const DocCard = ({ doc }) => {
  const statusIcons = {
    'Approved': <CheckCircle size={16} color="var(--success)" />,
    'Rejected': <XCircle size={16} color="var(--error)" />,
    'Uploaded': <Clock size={16} color="var(--info)" />,
    'Pending Verification': <Clock size={16} color="var(--warning)" />,
  };
  return (
    <Box sx={{ bgcolor: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 2.5, p: 2.5, boxShadow: 'var(--shadow-xs)', transition: 'all 0.2s', '&:hover': { boxShadow: 'var(--shadow-md)' } }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
        <Box display="flex" alignItems="center" gap={1}>
          {statusIcons[doc.status] || <Clock size={16} />}
          <Typography variant="body2" fontWeight={700}>{doc.type}</Typography>
        </Box>
        <StatusBadge status={doc.status} />
      </Box>
      <Typography variant="caption" color="text.secondary" display="block">{doc.fileName}</Typography>
      <Typography variant="caption" color="text.disabled" display="block" mt={0.5}>Uploaded: {new Date(doc.uploadDate).toLocaleDateString('en-IN')}</Typography>
      {doc.applicationId && <Typography variant="caption" color="var(--info)" display="block" mt={0.5} fontWeight={600}>App: {doc.applicationId}</Typography>}
      {doc.remarks && (
        <Box sx={{ mt: 1, p: 1.2, bgcolor: 'var(--error-bg)', borderRadius: 1.5, border: '1px solid rgba(239,68,68,0.2)' }}>
          <Typography variant="caption" color="error.main" fontWeight={600}>Rejected: </Typography>
          <Typography variant="caption" color="text.secondary">{doc.remarks}</Typography>
        </Box>
      )}
    </Box>
  );
};

const CustomerDocuments = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser() || {};
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const cust = customerService.getByUserId(user.id);
    if (cust) setDocs(documentService.getByCustomerId(cust.id));
  }, []);

  const approved = docs.filter(d => d.status === 'Approved');
  const rejected = docs.filter(d => d.status === 'Rejected');
  const pending = docs.filter(d => ['Uploaded', 'Pending Verification'].includes(d.status));

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>My Documents</Typography>
          <Typography variant="body2" color="text.secondary">View all uploaded documents and their verification status.</Typography>
        </Box>
        <button onClick={() => navigate('/portal/upload')} style={{ padding: '8px 18px', background: 'var(--accent)', color: '#fff', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <Upload size={15} /> Upload More
        </button>
      </Box>

      {/* Summary */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={4}><Box sx={{ bgcolor: 'var(--success-bg)', borderRadius: 2.5, p: 2, textAlign: 'center', border: '1px solid rgba(16,185,129,0.2)' }}><Typography variant="h4" fontWeight={800} color="var(--success)">{approved.length}</Typography><Typography variant="caption" fontWeight={600} color="text.secondary">Approved</Typography></Box></Grid>
        <Grid item xs={4}><Box sx={{ bgcolor: 'var(--warning-bg)', borderRadius: 2.5, p: 2, textAlign: 'center', border: '1px solid rgba(245,158,11,0.2)' }}><Typography variant="h4" fontWeight={800} color="var(--warning)">{pending.length}</Typography><Typography variant="caption" fontWeight={600} color="text.secondary">Pending</Typography></Box></Grid>
        <Grid item xs={4}><Box sx={{ bgcolor: 'var(--error-bg)', borderRadius: 2.5, p: 2, textAlign: 'center', border: '1px solid rgba(239,68,68,0.2)' }}><Typography variant="h4" fontWeight={800} color="var(--error)">{rejected.length}</Typography><Typography variant="caption" fontWeight={600} color="text.secondary">Rejected</Typography></Box></Grid>
      </Grid>

      {rejected.length > 0 && (
        <Box sx={{ bgcolor: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 2, p: 2, mb: 3 }}>
          <Typography variant="body2" fontWeight={700} color="error.main">⚠ Action Required</Typography>
          <Typography variant="caption" color="text.secondary">{rejected.length} document(s) were rejected. Please re-upload them with correct information.</Typography>
        </Box>
      )}

      {docs.length === 0 ? (
        <Box textAlign="center" py={6} sx={{ bgcolor: 'var(--surface)', borderRadius: 3, border: '1px solid var(--border-light)' }}>
          <Upload size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
          <Typography variant="subtitle1" fontWeight={600}>No Documents Uploaded</Typography>
          <Typography variant="body2" color="text.secondary">Upload your documents to complete your loan application process.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {docs.map(doc => <Grid item xs={12} sm={6} md={4} key={doc.id}><DocCard doc={doc} /></Grid>)}
        </Grid>
      )}
    </Box>
  );
};

export default CustomerDocuments;
