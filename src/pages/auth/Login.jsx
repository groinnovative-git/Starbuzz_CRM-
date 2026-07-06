// Login.jsx — Premium fintech login page

import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Alert, InputAdornment, IconButton, Divider
} from '@mui/material';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { demoDataService } from '../../services/demoDataService';

const DEMO_LOGINS = [
  { role: 'Super Admin', email: 'admin@starbuzz.com', password: 'Admin@123', color: 'var(--error)' },
  { role: 'Loan Officer', email: 'officer@starbuzz.com', password: 'Officer@123', color: 'var(--purple)' },
  { role: 'Sales Officer', email: 'sales@starbuzz.com', password: 'Sales@123', color: 'var(--warning)' },
  { role: 'Customer', email: 'customer@starbuzz.com', password: 'Customer@123', color: 'var(--accent)' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    demoDataService.initialize();
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      navigate(user?.role === 'customer' ? '/portal' : '/dashboard', { replace: true });
    }
  }, []);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError('');
    setTimeout(() => {
      const result = authService.login(email, password);
      setLoading(false);
      if (result.success) {
        navigate(result.user.role === 'customer' ? '/portal' : '/dashboard', { replace: true });
      } else {
        setError(result.message || 'Invalid credentials. Please try again.');
      }
    }, 600);
  };

  const handleDemoLogin = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setTimeout(() => {
      const result = authService.login(demo.email, demo.password);
      if (result.success) navigate(result.user.role === 'customer' ? '/portal' : '/dashboard', { replace: true });
    }, 300);
  };

  return (
    <div className="auth-container">
      {/* Brand Side */}
      <div className="auth-brand">
        <Box position="relative" zIndex={1}>
          <Box display="flex" alignItems="center" gap={2} mb={5}>
            <Box sx={{ width: 52, height: 52, bgcolor: 'var(--accent)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: 1 }}>SB</Box>
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#fff', letterSpacing: -0.3 }}>Star Buzz Solutions</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>Loan CRM & Customer Portal</Typography>
            </Box>
          </Box>

          <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.2, mb: 2, letterSpacing: -1 }}>
            Smarter Lending,<br />
            <span style={{ color: 'var(--accent)' }}>Seamless Experience</span>
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, lineHeight: 1.7, maxWidth: 420 }}>
            Manage your entire lending lifecycle — from lead generation to loan disbursement and EMI collections, all in one premium platform.
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            {['Automated lead & customer management', 'Real-time loan application processing', 'Document verification & tracking', 'EMI collection & overdue management'].map(f => (
              <Box key={f} display="flex" alignItems="center" gap={1.5}>
                <Box sx={{ width: 20, height: 20, bgcolor: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 700, flexShrink: 0 }}>✓</Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{f}</Typography>
              </Box>
            ))}
          </Box>

          <Box mt={5} sx={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            © 2024 Star Buzz Solutions | Developed by GroInnovative
          </Box>
        </Box>
      </div>

      {/* Login Form */}
      <div className="auth-form-side">
        <Box width="100%" maxWidth={380}>
          <Box mb={4}>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: -0.5 }}>Sign In</Typography>
            <Typography variant="body2" color="text.secondary">Enter your credentials to access the platform.</Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)}
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} color="var(--text-muted)" /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock size={18} color="var(--text-muted)" /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPw(p => !p)} size="small">{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</IconButton></InputAdornment>
              }}
            />
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            <Button fullWidth type="submit" variant="contained" size="large" disabled={loading}
              sx={{ py: 1.5, bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 700, fontSize: 15, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,191,165,0.3)', '&:hover': { boxShadow: '0 6px 20px rgba(0,191,165,0.4)' } }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3, fontSize: 12, color: 'text.secondary' }}>QUICK DEMO ACCESS</Divider>

          <Box display="flex" flexDirection="column" gap={1.5}>
            {DEMO_LOGINS.map(demo => (
              <Box key={demo.role} onClick={() => handleDemoLogin(demo)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 2, border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s', '&:hover': { borderColor: demo.color, bgcolor: `${demo.color}0a`, transform: 'scale(1.01)' } }}>
                <Box>
                  <Typography variant="body2" fontWeight={700} sx={{ color: demo.color }}>{demo.role}</Typography>
                  <Typography variant="caption" color="text.secondary">{demo.email}</Typography>
                </Box>
                <Typography variant="caption" fontWeight={600} sx={{ bgcolor: `${demo.color}1a`, color: demo.color, px: 1.5, py: 0.5, borderRadius: 1.5, fontSize: 11 }}>Login</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Login;
