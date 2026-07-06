// ApplicationTracking.jsx — Visual status tracking for customer

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, MenuItem, TextField } from '@mui/material';
import { CheckCircle, XCircle, Clock, FileSearch } from 'lucide-react';
import { authService } from '../../services/authService';
import { customerService } from '../../services/customerService';
import { applicationService } from '../../services/applicationService';
import { getTimelineFor } from '../../services/timelineService';
import TimelineView from '../../components/Common/TimelineView';

const APP_FLOW = ['New Application', 'Under Review', 'Document Pending', 'Document Verified', 'Approved', 'Disbursed'];

const TrackingStep = ({ step, index, currentStatus }) => {
  const currentIdx = APP_FLOW.indexOf(currentStatus);
  const isRejected = currentStatus === 'Rejected';
  const isDone = index < currentIdx;
  const isCurrent = index === currentIdx;
  const isFuture = index > currentIdx;

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3, position: 'relative' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: isRejected && isCurrent ? 'var(--error)' : isDone ? 'var(--success)' : isCurrent ? 'var(--accent)' : 'var(--border)',
          color: isDone || isCurrent ? '#fff' : 'var(--text-muted)', fontSize: 13, fontWeight: 700,
          boxShadow: isCurrent ? `0 0 0 4px ${isRejected ? 'var(--error-bg)' : 'var(--accent-light)'}` : 'none',
          transition: 'all 0.3s',
        }}>
          {isDone ? <CheckCircle size={18} /> : isRejected && isCurrent ? <XCircle size={18} /> : isCurrent ? <Clock size={18} /> : index + 1}
        </Box>
        {index < APP_FLOW.length - 1 && (
          <Box sx={{ width: 2, height: 36, bgcolor: isDone ? 'var(--success)' : 'var(--border)', mt: 1 }} />
        )}
      </Box>
      <Box sx={{ pt: 0.5 }}>
        <Typography variant="body2" fontWeight={700} sx={{ color: isDone ? 'var(--success)' : isCurrent ? (isRejected ? 'var(--error)' : 'var(--accent)') : 'var(--text-muted)' }}>
          {step}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {isDone ? '✓ Completed' : isCurrent ? (isRejected ? '✗ Rejected' : '● In Progress') : '○ Pending'}
        </Typography>
      </Box>
    </Box>
  );
};

const ApplicationTracking = () => {
  const user = authService.getCurrentUser() || {};
  const [apps, setApps] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const cust = customerService.getByUserId(user.id);
    if (cust) {
      const myApps = applicationService.getByCustomerId(cust.id);
      setApps(myApps);
      if (myApps.length > 0) {
        setSelectedAppId(myApps[0].id);
        setSelectedApp(myApps[0]);
        setTimeline(getTimelineFor(myApps[0].id));
      }
    }
  }, []);

  const handleSelect = (appId) => {
    const app = apps.find(a => a.id === appId);
    setSelectedAppId(appId);
    setSelectedApp(app);
    setTimeline(getTimelineFor(appId));
  };

  if (apps.length === 0) return (
    <Box textAlign="center" py={8}>
      <FileSearch size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
      <Typography variant="subtitle1" fontWeight={600}>No Applications to Track</Typography>
      <Typography variant="body2" color="text.secondary">Apply for a loan to start tracking your application progress.</Typography>
    </Box>
  );

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>Application Tracking</Typography>
        <Typography variant="body2" color="text.secondary">Real-time status tracking for your loan applications.</Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Select Application
        </Typography>
        <TextField 
          select 
          value={selectedAppId} 
          onChange={e => handleSelect(e.target.value)} 
          size="small" 
          sx={{ minWidth: 320, bgcolor: 'var(--surface, #fff)', borderRadius: 1 }}
        >
          {apps.map(a => <MenuItem key={a.id} value={a.id}>{a.id} — {a.loanType} (₹{Number(a.requestedAmount).toLocaleString('en-IN')})</MenuItem>)}
        </TextField>
      </Box>

      {selectedApp && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: 'var(--surface)', borderRadius: 3, border: '1px solid var(--border-light)', p: 3, boxShadow: 'var(--shadow-sm)' }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2.5}>Application Progress</Typography>
              {APP_FLOW.map((step, i) => (
                <TrackingStep key={step} step={step} index={i} currentStatus={selectedApp.status} />
              ))}
              {selectedApp.status === 'Rejected' && (
                <Box sx={{ p: 2, bgcolor: 'var(--error-bg)', borderRadius: 2, border: '1px solid rgba(239,68,68,0.2)', mt: 2 }}>
                  <Typography variant="caption" fontWeight={700} color="error.main">Reason for Rejection</Typography>
                  <Typography variant="body2" mt={0.5}>{selectedApp.rejectionReason || 'Please contact your branch for more details.'}</Typography>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{ bgcolor: 'var(--surface)', borderRadius: 3, border: '1px solid var(--border-light)', p: 3, boxShadow: 'var(--shadow-sm)', mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={3}>Application Summary</Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                {[
                  ['Application ID', selectedApp.id],
                  ['Loan Type', selectedApp.loanType],
                  ['Requested Amount', `₹${Number(selectedApp.requestedAmount).toLocaleString('en-IN')}`],
                  selectedApp.approvedAmount ? ['Approved Amount', `₹${Number(selectedApp.approvedAmount).toLocaleString('en-IN')}`] : null,
                  selectedApp.disbursedAmount ? ['Disbursed Amount', `₹${Number(selectedApp.disbursedAmount).toLocaleString('en-IN')}`] : null,
                  ['Tenure', `${selectedApp.tenure} months`],
                  ['Applied Date', new Date(selectedApp.createdDate).toLocaleDateString('en-IN')],
                  ['Officer', selectedApp.assignedOfficer || '—'],
                ].filter(Boolean).map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>{label}</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
              
            </Box>

            <Box sx={{ bgcolor: 'var(--surface)', borderRadius: 3, border: '1px solid var(--border-light)', p: 3, boxShadow: 'var(--shadow-sm)' }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>Activity Timeline</Typography>
              <TimelineView entries={timeline} emptyText="No activity recorded yet." />
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ApplicationTracking;
