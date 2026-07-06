import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { demoDataService } from './services/demoDataService';
import { authService } from './services/authService';

// Layout
import AdminLayout from './components/Layout/AdminLayout';
import CustomerLayout from './components/Layout/CustomerLayout';
import RoleBasedRoute from './components/Layout/RoleBasedRoute';

// Auth
import Login from './pages/auth/Login';

// Admin / CRM Pages
import Dashboard from './pages/admin/Dashboard';
import Leads from './pages/admin/Leads';
import Customers from './pages/admin/Customers';
import Applications from './pages/admin/Applications';
import Documents from './pages/admin/Documents';
import Reports from './pages/admin/Reports';
import Tickets from './pages/admin/Tickets';
import Users from './pages/admin/Users';
import Collections from './pages/admin/Collections';
import Roles from './pages/admin/Roles';
import Announcements from './pages/admin/Announcements';

// Customer Portal Pages
import CustomerPortal from './pages/customer/CustomerPortal';
import CustomerApplications from './pages/customer/CustomerApplications';
import ApplicationTracking from './pages/customer/ApplicationTracking';
import CustomerDocuments from './pages/customer/CustomerDocuments';
import DocumentUpload from './pages/customer/DocumentUpload';
import CustomerTickets from './pages/customer/CustomerTickets';
import LoanApplication from './pages/customer/LoanApplication';

// Stub pages (Profile, etc.)
import Settings from './pages/admin/Settings';
import DemoGuide from './pages/admin/DemoGuide';

const CustomerProfile = () => {
  const { Typography, Box, Grid, TextField, Button, Snackbar, Alert, Card, CardContent, Divider } = require('@mui/material');
  const { authService: auth } = require('./services/authService');
  const { customerService: cs } = require('./services/customerService');
  const user = auth.getCurrentUser() || {};
  const [customer, setCustomer] = React.useState(cs.getByUserId(user.id));
  const [snack, setSnack] = React.useState({ open: false, msg: '', severity: 'success' });

  if (!customer) return (
    <Box textAlign="center" py={8} color="var(--text-muted)">
      <Typography>Customer profile not linked to your account. Contact support.</Typography>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={0.5}>My Profile</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>View your registered profile details. Contact support to update information.</Typography>
      <Card sx={{ borderRadius: 3, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {[
              ['Name', customer.name], ['Mobile', customer.mobile], ['Email', customer.email],
              ['Date of Birth', customer.dob], ['Gender', customer.gender], ['PAN', customer.panNumber],
              ['Aadhaar', customer.aadhaarNumber], ['CIBIL Score', customer.cibil],
              ['Employment', customer.employmentType], ['Employer', customer.employer],
              ['Designation', customer.designation], ['Monthly Income', `₹${Number(customer.monthlyIncome || 0).toLocaleString('en-IN')}`],
              ['Current Address', customer.currentAddress], ['City', customer.city], ['State', customer.state],
            ].map(([label, value]) => (
              <Grid item xs={12} sm={6} key={label}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>{label}</Typography>
                <Typography variant="body2" fontWeight={500} mt={0.3}>{value || '—'}</Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

const NotFound = () => {
  const { Typography, Box, Button } = require('@mui/material');
  const { useNavigate } = require('react-router-dom');
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <Typography variant="h1" fontWeight={900} sx={{ fontSize: 96, color: 'var(--border)', lineHeight: 1 }}>404</Typography>
      <Typography variant="h5" fontWeight={700} mb={1}>Page Not Found</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>The page you're looking for doesn't exist.</Typography>
      <Button variant="contained" onClick={() => navigate(-1)} sx={{ bgcolor: 'var(--accent)', fontWeight: 600 }}>Go Back</Button>
    </Box>
  );
};

// Premium Corporate MUI Theme — Paisabazaar-inspired
const theme = createTheme({
  palette: {
    primary: { main: '#0A192F', light: '#1B2A4A', dark: '#060F1E' },
    secondary: { main: '#00BFA5', light: '#4DD0C0', dark: '#009688' },
    background: { default: '#F0F4F8', paper: '#ffffff' },
    text: { primary: '#1A202C', secondary: '#4A5568' },
    success: { main: '#10B981', light: '#D1FAE5' },
    warning: { main: '#F59E0B', light: '#FEF3C7' },
    error: { main: '#EF4444', light: '#FEE2E2' },
    info: { main: '#3B82F6', light: '#DBEAFE' },
    divider: '#EDF2F7',
  },
  typography: {
    fontFamily: '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: -0.5 },
    h2: { fontWeight: 700, letterSpacing: -0.3 },
    h3: { fontWeight: 700, letterSpacing: -0.2 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0.3 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.6 },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
    '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
    '0 4px 6px rgba(0,0,0,0.04), 0 10px 24px rgba(0,0,0,0.06)',
    ...Array(21).fill('0 4px 6px rgba(0,0,0,0.04), 0 10px 24px rgba(0,0,0,0.06)')
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: 'none',
          padding: '8px 20px',
          transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': { boxShadow: '0 4px 14px rgba(0,0,0,0.08)', transform: 'translateY(-1px)' },
        },
        containedPrimary: {
          background: '#0A192F',
          '&:hover': { background: '#1B2A4A' },
        },
        containedSecondary: {
          background: '#00BFA5',
          '&:hover': { background: '#009688' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'box-shadow 0.2s',
            '&.Mui-focused fieldset': { borderColor: '#00BFA5', borderWidth: 1.5 },
            '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(0, 191, 165, 0.1)' },
          },
          '& label.Mui-focused': { color: '#00BFA5' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #EDF2F7',
          transition: 'box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': { boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 10px 24px rgba(0,0,0,0.06)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontSize: 14 },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: '#00BFA5', height: 3, borderRadius: '3px 3px 0 0' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: '#EDF2F7' },
      },
    },
  },
});

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    demoDataService.initialize();
    setInitialized(true);
  }, []);

  if (!initialized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F7FE' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', color: '#64748B', fontSize: 16 }}>Initializing Star Buzz CRM...</div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/demo-guide" element={
          <RoleBasedRoute allowedRoles={['admin', 'officer', 'sales']}>
            <AdminLayout />
          </RoleBasedRoute>
        }>
          <Route index element={<DemoGuide />} />
        </Route>

        {/* CRM / Admin Layout */}
        <Route element={
          <RoleBasedRoute allowedRoles={['admin', 'officer', 'sales']}>
            <AdminLayout />
          </RoleBasedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/users" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Users />
            </RoleBasedRoute>
          } />
          <Route path="/roles" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Roles />
            </RoleBasedRoute>
          } />
          <Route path="/announcements" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Announcements />
            </RoleBasedRoute>
          } />
          <Route path="/settings" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Settings />
            </RoleBasedRoute>
          } />
          <Route path="/demo-guide" element={<DemoGuide />} />
        </Route>

        {/* Customer Portal Layout */}
        <Route element={
          <RoleBasedRoute allowedRoles={['customer']}>
            <CustomerLayout />
          </RoleBasedRoute>
        }>
          <Route path="/portal" element={<CustomerPortal />} />
          <Route path="/portal/profile" element={<CustomerProfile />} />
          <Route path="/portal/apply" element={<LoanApplication />} />
          <Route path="/portal/applications" element={<CustomerApplications />} />
          <Route path="/portal/tracking" element={<ApplicationTracking />} />
          <Route path="/portal/documents" element={<CustomerDocuments />} />
          <Route path="/portal/upload" element={<DocumentUpload />} />
          <Route path="/portal/tickets" element={<CustomerTickets />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
