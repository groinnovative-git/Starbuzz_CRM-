import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Divider, Switch, Grid, TextField, Button, Snackbar, Alert } from '@mui/material';
import PageHeader from '../../components/Common/PageHeader';
import { demoDataService } from '../../services/demoDataService';
import { authService } from '../../services/authService';

const Settings = () => {
  const [notifications, setNotifications] = useState({ email: true, sms: true, whatsapp: false });
  const [saved, setSaved] = useState(false);
  const user = authService.getCurrentUser() || {};

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all mock data to the original seed values?")) {
      demoDataService.resetData();
      alert("Data reset successfully! Refresh the page to see changes.");
      window.location.reload();
    }
  };

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <Box>
      <PageHeader 
        title="Settings" 
        subtitle="Manage system configurations, notifications, and your profile preferences." 
      />
      
      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid item xs={12} md={6}>
          <Card className="premium-shadow" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" mb={2}>My Profile</Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Name</Typography>
                <Typography variant="body1" fontWeight={600}>{user.name || 'Admin User'}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Email</Typography>
                <Typography variant="body1">{user.email || 'admin@starbuzz.com'}</Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Role</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{user.role || 'Super Admin'}</Typography>
              </Box>

              <Button variant="outlined" size="small" onClick={handleSave}>Change Password</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card className="premium-shadow" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" mb={2}>Notification Preferences</Typography>
              <Divider sx={{ mb: 3 }} />
              
              {[['email', 'Email Notifications'], ['sms', 'SMS Alerts'], ['whatsapp', 'WhatsApp Updates']].map(([key, label]) => (
                <Box key={key} display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Typography variant="body2" fontWeight={500}>{label}</Typography>
                  <Switch 
                    checked={notifications[key]} 
                    onChange={e => setNotifications(p => ({ ...p, [key]: e.target.checked }))} 
                    size="small" 
                    color="primary" 
                  />
                </Box>
              ))}

              {notifications.whatsapp && (
                <Box mt={2} p={2} bgcolor="#F8FAFC" borderRadius={2} border="1px solid var(--border-light)">
                  <TextField fullWidth label="WhatsApp Number" size="small" defaultValue="+91 9876543210" sx={{ mb: 2 }} />
                  <TextField fullWidth label="API Key" size="small" type="password" defaultValue="mock-api-key" />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* System Info */}
        <Grid item xs={12} md={6}>
          <Card className="premium-shadow">
            <CardContent>
              <Typography variant="h6" mb={2}>System Information</Typography>
              <Divider sx={{ mb: 2 }} />
              
              {[['Company', 'Star Buzz Solutions'], ['Version', 'v2.1.0'], ['Data Source', 'localStorage (Demo)'], ['Developed By', 'GroInnovative']].map(([label, value]) => (
                <Box key={label} display="flex" justifyContent="space-between" mb={1.5}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
                  <Typography variant="caption" fontWeight={600}>{value}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Danger Zone */}
        <Grid item xs={12} md={6}>
          <Card className="premium-shadow" sx={{ borderLeft: '4px solid var(--error)' }}>
            <CardContent>
              <Typography variant="h6" mb={2} color="error">Danger Zone</Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body2" mb={3} color="text.secondary">
                This action will clear all current <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: 4 }}>localStorage</code> data and re-seed the initial demo data. All new leads, applications, and tickets will be lost.
              </Typography>
              <Button variant="contained" color="error" onClick={handleResetData}>
                Reset Demo Data
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSave} size="large" sx={{ px: 4, fontWeight: 600 }}>
          Save Settings
        </Button>
      </Box>

      <Snackbar open={saved} autoHideDuration={3000} onClose={() => setSaved(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>Settings updated successfully.</Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
