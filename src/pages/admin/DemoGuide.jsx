import React from 'react';
import { Box, Typography, Button, Paper, Grid, Card, CardContent, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Common/PageHeader';
import { demoDataService } from '../../services/demoDataService';

const DemoGuide = () => {
  const navigate = useNavigate();

  const creds = [
    { role: 'Super Admin', email: 'admin@starbuzz.com', pwd: 'Admin@123', color: '#EF4444', access: 'Full system access — all modules, users, reports' },
    { role: 'Loan Officer', email: 'officer@starbuzz.com', pwd: 'Officer@123', color: '#8B5CF6', access: 'Applications, documents, collections, tickets' },
    { role: 'Sales Officer', email: 'sales@starbuzz.com', pwd: 'Sales@123', color: '#F59E0B', access: 'Leads, customers, applications, documents, tickets' },
    { role: 'Customer Portal', email: 'customer@starbuzz.com', pwd: 'Customer@123', color: '#00BFA5', access: 'Apply loans, track, upload docs, raise tickets' },
  ];

  return (
    <Box>
      <PageHeader 
        title="Demo Guide & Walkthrough" 
        subtitle="Welcome to the Star Buzz Loan CRM prototype. Follow the steps below to explore the core functionality."
      />

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, borderRadius: 3 }} className="premium-shadow">
            <Typography variant="h5" mb={3} fontWeight={700}>End-to-End Loan Flow Walkthrough</Typography>
            <Box sx={{ '& ol': { paddingLeft: 3, m: 0 }, '& li': { mb: 2, fontSize: '15px' } }}>
              <ol>
                <li><strong>Login as Sales Officer</strong> (or Admin) to add a new lead via the <strong style={{ color: 'var(--accent)' }}>Leads</strong> module. Schedule a follow-up and mark the lead as "Converted".</li>
                <li>Go to the <strong style={{ color: 'var(--accent)' }}>Applications</strong> module and create a "New Loan Application" for the converted customer. The status will be "New Application".</li>
                <li><strong>Login as Customer Portal</strong>. Navigate to the <em>Documents</em> tab and upload the required proofs (Aadhaar, PAN, Salary Slips).</li>
                <li><strong>Login as Loan Officer</strong> (or Admin). Go to the <strong style={{ color: 'var(--accent)' }}>Documents</strong> module, review the uploaded files, and mark them as "Approved". This auto-updates the application status to "Document Verified".</li>
                <li>Return to the <strong style={{ color: 'var(--accent)' }}>Applications</strong> module. Click the green checkmark icon to approve the verified application.</li>
                <li>Once approved, click the purple wallet icon to "Disburse" the loan. This automatically generates EMI schedules in the Collections module.</li>
                <li>Go to the <strong style={{ color: 'var(--accent)' }}>Collections</strong> module. You will see the generated EMIs. You can click the Rupee icon to record a payment, or mark it as Overdue.</li>
              </ol>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" mb={2} fontWeight={700}>Demo Credentials</Typography>
          <Grid container spacing={3}>
            {creds.map(c => (
              <Grid item xs={12} sm={6} md={3} key={c.role}>
                <Card sx={{ borderRadius: 3, border: '1px solid var(--border-light)', height: '100%' }} className="premium-shadow">
                  <CardContent sx={{ p: 2.5 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: c.color }}>{c.role}</Typography>
                      <Chip label="Demo" size="small" variant="outlined" sx={{ borderColor: c.color, color: c.color, fontSize: 10, height: 20 }} />
                    </Box>
                    <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 2, p: 1.5, mb: 1.5, fontFamily: 'monospace', fontSize: 11 }}>
                      <div style={{ marginBottom: 4 }}>📧 {c.email}</div>
                      <div>🔑 {c.pwd}</div>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', minHeight: 40, lineHeight: 1.3 }}>
                      {c.access}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4} mb={4} p={3} bgcolor="#F8FAFC" borderRadius={3} border="1px dashed var(--border-light)">
        <Typography variant="body2" color="text.secondary" mb={2}>
          Need to start over? You can reset all mock data to the original state.
        </Typography>
        <Button variant="outlined" color="error" onClick={() => { 
          if(window.confirm('Reset all demo data?')) { 
            demoDataService.resetData(); 
            window.location.href = '/login'; 
          } 
        }}>
          🔄 Reset Demo Data
        </Button>
      </Box>
    </Box>
  );
};

export default DemoGuide;
