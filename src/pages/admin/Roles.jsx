import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Switch, Paper, Chip
} from '@mui/material';
import { ShieldCheck, Save, Info } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';

const ROLES = [
  { id: 'admin', label: 'Super Admin', color: 'error' },
  { id: 'officer', label: 'Loan Officer', color: 'info' },
  { id: 'sales', label: 'Sales Officer', color: 'warning' },
];

const FEATURES = [
  { id: 'dashboard', label: 'Dashboard', desc: 'Overview metrics and statistics' },
  { id: 'leads', label: 'Leads Management', desc: 'View, add, and convert prospective leads' },
  { id: 'customers', label: 'Customers', desc: 'Access complete customer database' },
  { id: 'applications', label: 'Loan Applications', desc: 'Process and manage loan applications' },
  { id: 'documents', label: 'Document Verification', desc: 'Verify customer uploaded documents' },
  { id: 'collections', label: 'Collections / EMI', desc: 'Manage loan collections and tracking' },
  { id: 'tickets', label: 'Support Tickets', desc: 'Handle customer support requests' },
  { id: 'reports', label: 'Reports & Analytics', desc: 'Generate system-wide reports' },
  { id: 'users', label: 'User Management', desc: 'Manage system users and staff (Super Admin only)' },
];

const DEFAULT_PERMISSIONS = {
  admin: ['dashboard', 'leads', 'customers', 'applications', 'documents', 'collections', 'tickets', 'reports', 'users'],
  officer: ['dashboard', 'leads', 'customers', 'applications', 'documents', 'collections', 'tickets'],
  sales: ['dashboard', 'leads', 'customers', 'applications', 'documents', 'tickets'],
};

const Roles = () => {
  const [permissions, setPermissions] = useState({});
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Load from local storage or use defaults
    const saved = localStorage.getItem('starbuzz_permissions');
    if (saved) {
      try {
        setPermissions(JSON.parse(saved));
      } catch (e) {
        setPermissions(DEFAULT_PERMISSIONS);
      }
    } else {
      setPermissions(DEFAULT_PERMISSIONS);
    }
  }, []);

  const handleToggle = (roleId, featureId) => {
    // Prevent removing permissions from Super Admin for core features (for safety in demo)
    if (roleId === 'admin' && ['dashboard', 'users'].includes(featureId)) {
      setSnack({ open: true, msg: 'Cannot remove core permissions from Super Admin.', severity: 'warning' });
      return;
    }

    setPermissions(prev => {
      const rolePerms = prev[roleId] || [];
      const hasPerm = rolePerms.includes(featureId);
      
      const newRolePerms = hasPerm 
        ? rolePerms.filter(p => p !== featureId)
        : [...rolePerms, featureId];

      setIsDirty(true);
      return { ...prev, [roleId]: newRolePerms };
    });
  };

  const handleSave = () => {
    localStorage.setItem('starbuzz_permissions', JSON.stringify(permissions));
    setIsDirty(false);
    setSnack({ open: true, msg: 'Role permissions saved successfully!', severity: 'success' });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4}>
        <PageHeader 
          title="Roles & Responsibilities" 
          subtitle="Configure page access and feature permissions across different staff roles." 
        />
        <Button 
          variant="contained" 
          startIcon={<Save size={18} />} 
          onClick={handleSave}
          disabled={!isDirty}
          sx={{ 
            bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, 
            fontWeight: 700, borderRadius: 2, px: 3, py: 1, 
            boxShadow: isDirty ? 'var(--shadow-md)' : 'none',
            opacity: isDirty ? 1 : 0.7
          }}
        >
          Save Changes
        </Button>
      </Box>

      <Box sx={{ bgcolor: 'var(--info-bg)', p: 2, borderRadius: 3, display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 4, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <Info size={20} color="var(--info)" style={{ marginTop: 2 }} />
        <Typography variant="body2" color="var(--text-main)" sx={{ lineHeight: 1.6 }}>
          <strong>Note:</strong> Changes made here will affect which pages are visible in the sidebar and accessible via URL for the respective roles. Super Admin always retains access to User Management. Customers have their own dedicated portal which is managed separately.
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: 'var(--text-main)', py: 2.5, width: '35%' }}>Feature / Module</TableCell>
              {ROLES.map(role => (
                <TableCell key={role.id} align="center" sx={{ fontWeight: 800, color: 'var(--text-main)', py: 2.5 }}>
                  <Chip label={role.label} color={role.color} variant="outlined" sx={{ fontWeight: 700, borderWidth: 2 }} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {FEATURES.map((feature) => (
              <TableRow key={feature.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background-color 0.2s' }}>
                <TableCell component="th" scope="row" sx={{ py: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="var(--text-main)">
                    {feature.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {feature.desc}
                  </Typography>
                </TableCell>
                
                {ROLES.map(role => {
                  const hasAccess = (permissions[role.id] || []).includes(feature.id);
                  const isLocked = role.id === 'admin' && (feature.id === 'users' || feature.id === 'dashboard');
                  
                  return (
                    <TableCell key={`${role.id}-${feature.id}`} align="center" sx={{ py: 2 }}>
                      <Switch 
                        checked={hasAccess} 
                        onChange={() => handleToggle(role.id, feature.id)}
                        disabled={isLocked}
                        color="success"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: 'var(--success)',
                            '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.08)' },
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: 'var(--success)',
                          },
                        }}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2, fontWeight: 600 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Roles;
