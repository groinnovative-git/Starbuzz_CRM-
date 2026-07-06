// CustomerApplications.jsx — Customer's own applications list

import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { FileText } from 'lucide-react';
import { authService } from '../../services/authService';
import { customerService } from '../../services/customerService';
import { applicationService } from '../../services/applicationService';
import StatusBadge from '../../components/Common/StatusBadge';
import DataTable from '../../components/Common/DataTable';

const APP_FLOW = ['New Application', 'Under Review', 'Document Pending', 'Document Verified', 'Approved', 'Rejected', 'Disbursed'];

const getProgress = (status) => {
  if (status === 'Rejected' || status === 'Disbursed') return 100;
  const idx = APP_FLOW.indexOf(status);
  return Math.round((idx / (APP_FLOW.length - 2)) * 100);
};

const CustomerApplications = () => {
  const user = authService.getCurrentUser() || {};
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const cust = customerService.getByUserId(user.id);
    if (cust) setApps(applicationService.getByCustomerId(cust.id));
  }, []);

  const columns = [
    { 
      field: 'id', 
      header: 'App ID', 
      render: r => <span style={{ fontSize: 13, color: 'var(--info)', fontWeight: 700 }}>{r.id}</span> 
    },
    { 
      field: 'loanDetails', 
      header: 'Loan Request', 
      render: r => (
        <Box>
          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{r.loanType}</div>
          <div className="cell-sub" style={{ fontSize: 11, mt: 0.5 }}>Applied {new Date(r.createdDate).toLocaleDateString('en-IN')}</div>
        </Box>
      ) 
    },
    { 
      field: 'amount', 
      header: 'Amount Details', 
      render: r => (
        <Box>
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Req: ₹{Number(r.requestedAmount).toLocaleString('en-IN')}</div>
          {r.approvedAmount && <div className="cell-sub" style={{ color: 'var(--success)', fontWeight: 700, mt: 0.5 }}>Appr: ₹{Number(r.approvedAmount).toLocaleString('en-IN')}</div>}
        </Box>
      ) 
    },
    { 
      field: 'tenure', 
      header: 'Tenure', 
      render: r => <span style={{ fontWeight: 600 }}>{r.tenure} months</span> 
    },
    { 
      field: 'status', 
      header: 'Status & Progress', 
      render: r => {
        const progress = getProgress(r.status);
        const isRejected = r.status === 'Rejected';
        const isDisbursed = r.status === 'Disbursed';
        return (
          <Box sx={{ width: 160 }}>
            <Box display="flex" justifyContent="space-between" mb={1} alignItems="center">
              <StatusBadge status={r.status} />
              <Typography variant="caption" fontWeight={700} color={isRejected ? 'error.main' : isDisbursed ? 'success.main' : 'text.secondary'} sx={{ fontSize: 11 }}>
                {isRejected ? 'Failed' : `${progress}%`}
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{
              borderRadius: 5, height: 6,
              bgcolor: 'var(--border-light)',
              '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: isRejected ? 'var(--error)' : isDisbursed ? 'var(--success)' : 'var(--accent)' }
            }} />
            {r.rejectionReason && (
              <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 0.5, fontSize: 10, fontWeight: 600 }}>
                {r.rejectionReason}
              </Typography>
            )}
          </Box>
        );
      } 
    },
    { 
      field: 'assignedOfficer', 
      header: 'Assigned Officer', 
      render: r => <span style={{ fontWeight: 500, color: r.assignedOfficer ? 'var(--text-main)' : 'var(--text-muted)' }}>{r.assignedOfficer || 'Unassigned'}</span> 
    }
  ];

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="flex-end">
        <Box>
          <Typography variant="h5" fontWeight={800} color="var(--text-main)">My Applications</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Track all your loan applications and view their current processing status.</Typography>
        </Box>
      </Box>

      {apps.length === 0 ? (
        <Box textAlign="center" py={8} sx={{ bgcolor: 'var(--surface)', borderRadius: 3, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <FileText size={48} style={{ opacity: 0.3, marginBottom: 12, color: 'var(--accent)' }} />
          <Typography variant="subtitle1" fontWeight={700} color="var(--text-main)">No Applications Found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>You haven't applied for a loan yet. Navigate to "Apply Loan" to get started.</Typography>
        </Box>
      ) : (
        <Box sx={{ bgcolor: 'var(--surface)', borderRadius: 3, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <DataTable 
            columns={columns} 
            data={apps} 
            searchPlaceholder="Search your applications..." 
            filters={[{ field: 'status', label: 'Status', options: APP_FLOW }]}
          />
        </Box>
      )}
    </Box>
  );
};

export default CustomerApplications;
