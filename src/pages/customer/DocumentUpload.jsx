// DocumentUpload.jsx — Customer document upload interface

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, MenuItem, TextField, Button, Snackbar, Alert } from '@mui/material';
import { Upload, CheckCircle, FileText } from 'lucide-react';
import { authService } from '../../services/authService';
import { customerService } from '../../services/customerService';
import { applicationService } from '../../services/applicationService';
import { documentService } from '../../services/documentService';

const DOC_TYPES = ['Aadhaar', 'PAN Card', 'Bank Statement', 'Salary Slip', 'Address Proof', 'Photo', 'ITR', 'Property Document', 'GST Certificate'];

const UploadCard = ({ type, existingDoc, appId, customerId, customerName, onUpload }) => {
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    if (!fileName.trim()) return;
    setUploading(true);
    setTimeout(() => {
      onUpload({ type, fileName: fileName || `${type.replace(/ /g, '_')}_document.pdf`, applicationId: appId, customerId, customerName });
      setUploading(false);
      setFileName('');
    }, 800);
  };

  const isApproved = existingDoc?.status === 'Approved';
  const isRejected = existingDoc?.status === 'Rejected';

  return (
    <div className={`doc-upload-card ${isApproved ? 'uploaded' : isRejected ? 'rejected' : ''}`}>
      <Box mb={1.5}>
        {isApproved ? (
          <CheckCircle size={28} color="var(--success)" style={{ margin: '0 auto', display: 'block', marginBottom: 8 }} />
        ) : (
          <Upload size={28} color={isRejected ? 'var(--error)' : 'var(--text-muted)'} style={{ margin: '0 auto', display: 'block', marginBottom: 8 }} />
        )}
        <Typography variant="body2" fontWeight={700} textAlign="center">{type}</Typography>
        {existingDoc && (
          <Typography variant="caption" display="block" textAlign="center" color={isApproved ? 'success.main' : isRejected ? 'error.main' : 'text.secondary'} mt={0.5}>
            {isApproved ? '✓ Verified & Approved' : isRejected ? `Rejected: ${existingDoc.remarks}` : existingDoc.status}
          </Typography>
        )}
      </Box>

      {!isApproved && (
        <Box>
          <TextField
            size="small" fullWidth placeholder="Enter filename or simulate upload"
            value={fileName} onChange={e => setFileName(e.target.value)}
            sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 12 } }}
          />
          <Button fullWidth variant="contained" size="small" onClick={handleUpload} disabled={!fileName.trim() || uploading}
            sx={{ bgcolor: isRejected ? 'var(--error)' : 'var(--accent)', '&:hover': { bgcolor: isRejected ? '#DC2626' : 'var(--accent-dark)' }, fontWeight: 600, borderRadius: 2, fontSize: 12 }}>
            {uploading ? 'Uploading...' : isRejected ? 'Re-upload' : existingDoc ? 'Replace' : 'Upload'}
          </Button>
        </Box>
      )}
    </div>
  );
};

const DocumentUpload = () => {
  const user = authService.getCurrentUser() || {};
  const [customer, setCustomer] = useState(null);
  const [apps, setApps] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [docs, setDocs] = useState([]);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    const cust = customerService.getByUserId(user.id);
    setCustomer(cust);
    if (cust) {
      const myApps = applicationService.getByCustomerId(cust.id);
      setApps(myApps);
      if (myApps.length > 0) {
        setSelectedAppId(myApps[0].id);
        setDocs(documentService.getByApplicationId(myApps[0].id));
      }
    }
  }, []);

  const handleAppChange = (appId) => {
    setSelectedAppId(appId);
    setDocs(documentService.getByApplicationId(appId));
  };

  const handleUpload = (docData) => {
    documentService.create({ ...docData, customerId: customer.id, customerName: customer.name });
    setDocs(documentService.getByApplicationId(selectedAppId));
    setSnack({ open: true, msg: `${docData.type} uploaded successfully!`, severity: 'success' });
  };

  if (!customer) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="subtitle1" color="text.secondary">No customer profile linked to your account. Contact support.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>Upload Documents</Typography>
        <Typography variant="body2" color="text.secondary">Upload your documents to support your loan application. Accepted formats: PDF, JPG, PNG.</Typography>
      </Box>

      {apps.length > 0 && (
        <Box mb={3}>
          <TextField select label="Select Application" value={selectedAppId} onChange={e => handleAppChange(e.target.value)} size="small" sx={{ minWidth: 320 }}>
            {apps.map(a => <MenuItem key={a.id} value={a.id}>{a.id} — {a.loanType}</MenuItem>)}
          </TextField>
        </Box>
      )}

      <Box sx={{ bgcolor: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 2, p: 2, mb: 3 }}>
        <Typography variant="body2" fontWeight={600} mb={0.5}><FileText size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Upload Instructions</Typography>
        <Typography variant="caption" color="text.secondary" component="div">
          • Files must be clear, legible, and complete<br />
          • Accepted formats: PDF, JPG, JPEG, PNG<br />
          • Maximum file size: 5 MB per document<br />
          • Rejected documents must be re-uploaded with corrections
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {DOC_TYPES.map(type => {
          const existingDoc = docs.find(d => d.type === type);
          return (
            <Grid item xs={12} sm={6} md={4} key={type}>
              <UploadCard
                type={type}
                existingDoc={existingDoc}
                appId={selectedAppId}
                customerId={customer.id}
                customerName={customer.name}
                onUpload={handleUpload}
              />
            </Grid>
          );
        })}
      </Grid>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DocumentUpload;
