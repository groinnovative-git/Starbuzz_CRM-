import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { loanService } from '../../services/loanService';
import { customerService } from '../../services/customerService';
import StatusBadge from '../../components/Common/StatusBadge';
import { IndianRupee, FileText, CheckCircle2 } from 'lucide-react';

const CustomerHome = () => {
  const user = authService.getCurrentUser() || {};
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Find customer profile by user ID
    const c = customerService.getByUserId(user.id);
    if (c) {
      setCustomer(c);
      const apps = loanService.getByCustomerId(c.id);
      setApplications(apps);
    }
  }, [user.id]);

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" color="primary" fontWeight="bold">Welcome back, {user.name}!</Typography>
        <Typography variant="body1" color="textSecondary">Here is an overview of your loan journey.</Typography>
      </Box>

      {!customer ? (
        <Card className="premium-shadow" sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>Complete your profile to apply for a loan</Typography>
            <Button variant="contained" color="primary" size="large">Complete Profile</Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" mb={2} fontWeight="bold">Active Applications</Typography>
            {applications.length === 0 ? (
              <Card className="premium-shadow">
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary" mb={3}>You haven't applied for any loans yet.</Typography>
                  <Button variant="contained" color="primary" startIcon={<FileText size={18} />}>
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              applications.map(app => (
                <Card key={app.id} className="premium-shadow" sx={{ mb: 3 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" color="primary">{app.loanType}</Typography>
                        <Typography variant="body2" color="textSecondary">App ID: {app.id}</Typography>
                      </Box>
                      <StatusBadge status={app.status} />
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="textSecondary">Requested Amount</Typography>
                        <Typography variant="body1" fontWeight="bold">₹{app.requestedAmount.toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="textSecondary">Tenure</Typography>
                        <Typography variant="body1" fontWeight="bold">{app.tenure} Months</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="textSecondary">Applied On</Typography>
                        <Typography variant="body1" fontWeight="bold">{new Date(app.createdDate).toLocaleDateString()}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3} display="flex" alignItems="center" justifyContent="flex-end">
                        <Button variant="outlined" size="small">Track Status</Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" mb={2} fontWeight="bold">Quick Actions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card className="hover-lift" sx={{ cursor: 'pointer', bgcolor: 'primary.main', color: 'white' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IndianRupee size={24} color="var(--accent-green)" />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">Apply for Loan</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Get instant approvals</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card className="hover-lift" sx={{ cursor: 'pointer' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircle2 size={24} color="var(--accent-green-dark)" />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary">Upload Documents</Typography>
                      <Typography variant="caption" color="textSecondary">Complete your verification</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default CustomerHome;
