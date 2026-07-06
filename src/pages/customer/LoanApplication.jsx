// LoanApplication.jsx — Multi-step loan application form for customer portal

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, TextField, MenuItem, Button, Stepper,
  Step, StepLabel, Snackbar, Alert
} from '@mui/material';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { customerService } from '../../services/customerService';
import { applicationService } from '../../services/applicationService';
import { storageService } from '../../services/storageService';

const LOAN_TYPES = storageService.get('loanCategories')?.map(c => c.name) || ['Home Loan', 'Personal Loan', 'Business Loan', 'Car Loan', 'Education Loan', 'Gold Loan'];
const TENURES = [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 120, 180, 240];
const PURPOSE_MAP = {
  'Home Loan': ['Purchase of new home/flat', 'Construction of house', 'Home renovation / extension', 'Plot purchase'],
  'Personal Loan': ['Medical emergency', 'Wedding/family function', 'Travel / vacation', 'Home improvement', 'Education expenses', 'Other personal needs'],
  'Business Loan': ['Business expansion', 'Working capital', 'Equipment/machinery purchase', 'New branch setup', 'Inventory purchase'],
  'Car Loan': ['Purchase of new car', 'Purchase of used car'],
  'Education Loan': ['Undergraduate studies', 'Postgraduate / MBA', 'Professional courses', 'Study abroad'],
  'Gold Loan': ['Emergency funds', 'Business working capital', 'Other urgent needs'],
};

const steps = ['Loan Details', 'Financial Info', 'Review & Submit'];

const LoanApplication = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser() || {};
  const [customer, setCustomer] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const [form, setForm] = useState({
    loanType: '', requestedAmount: '', tenure: 12, purpose: '',
    monthlyIncome: '', existingEmi: 0, bankName: '', bankAccountNo: '',
    additionalNotes: '',
  });

  useEffect(() => {
    const cust = customerService.getByUserId(user.id);
    setCustomer(cust);
    if (cust) setForm(p => ({ ...p, monthlyIncome: cust.monthlyIncome || '', existingEmi: cust.existingEmi || 0 }));
  }, []);

  const f = (field) => ({ value: form[field] || '', onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value })) });

  const validate = () => {
    if (activeStep === 0 && (!form.loanType || !form.requestedAmount || !form.purpose)) {
      setSnack({ open: true, msg: 'Please fill all required fields.', severity: 'error' }); return false;
    }
    if (activeStep === 1 && !form.monthlyIncome) {
      setSnack({ open: true, msg: 'Monthly income is required.', severity: 'error' }); return false;
    }
    return true;
  };

  const handleNext = () => { if (validate()) setActiveStep(p => p + 1); };

  const handleSubmit = () => {
    if (!customer) {
      setSnack({ open: true, msg: 'Your profile is not linked. Please contact support.', severity: 'error' }); return;
    }
    const officers = (storageService.get('users') || []).filter(u => u.role === 'officer');
    const assignedOfficer = officers.length > 0 ? officers[Math.floor(Math.random() * officers.length)].name : '';
    applicationService.create({
      ...form,
      customerId: customer.id,
      customerName: customer.name,
      assignedOfficer,
      status: 'New Application',
    });
    setSubmitted(true);
  };

  if (submitted) return (
    <Box textAlign="center" py={8}>
      <CheckCircle size={64} color="var(--success)" style={{ marginBottom: 16 }} />
      <Typography variant="h5" fontWeight={800} mb={1}>Application Submitted!</Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Your {form.loanType} application for ₹{Number(form.requestedAmount).toLocaleString('en-IN')} has been submitted successfully.<br />
        Our loan officer will review your application within 1–2 business days.
      </Typography>
      <Box display="flex" gap={2} justifyContent="center">
        <Button variant="contained" onClick={() => navigate('/portal/applications')} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 600 }}>View My Applications</Button>
        <Button variant="outlined" onClick={() => navigate('/portal/tracking')} sx={{ fontWeight: 600 }}>Track Application</Button>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>Apply for a Loan</Typography>
        <Typography variant="body2" color="text.secondary">Complete this 3-step form to submit your loan application.</Typography>
      </Box>

      <Box sx={{ bgcolor: 'var(--surface)', borderRadius: 3, border: '1px solid var(--border-light)', p: 4, boxShadow: 'var(--shadow-sm)' }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        {/* Step 1 */}
        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Loan Type *" {...f('loanType')} onChange={e => setForm(p => ({ ...p, loanType: e.target.value, purpose: '' }))}>
                {LOAN_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Requested Amount (₹) *" type="number" {...f('requestedAmount')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Loan Tenure (months) *" value={form.tenure} onChange={e => setForm(p => ({ ...p, tenure: Number(e.target.value) }))}>
                {TENURES.map(t => <MenuItem key={t} value={t}>{t} months {t >= 12 ? `(${t / 12} year${t > 12 ? 's' : ''})` : ''}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Purpose *" value={form.purpose} onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))} disabled={!form.loanType}>
                {(PURPOSE_MAP[form.loanType] || []).map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Additional Notes (optional)" multiline rows={3} {...f('additionalNotes')} placeholder="Any additional information to support your application..." />
            </Grid>
          </Grid>
        )}

        {/* Step 2 */}
        {activeStep === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="subtitle2" color="text.secondary">Your profile details are pre-filled. Update if changed.</Typography></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Monthly Income (₹) *" type="number" {...f('monthlyIncome')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Existing Monthly EMI (₹)" type="number" {...f('existingEmi')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Bank Name" {...f('bankName')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Bank Account Number" {...f('bankAccountNo')} /></Grid>
            {form.monthlyIncome && form.requestedAmount && (
              <Grid item xs={12}>
                <Box sx={{ bgcolor: 'var(--accent-light)', border: '1px solid rgba(0,191,165,0.3)', borderRadius: 2, p: 2 }}>
                  <Typography variant="caption" fontWeight={700} color="var(--accent)" display="block" mb={0.5}>Estimated EMI (approx.)</Typography>
                  <Typography variant="h6" fontWeight={800} color="var(--text-primary)">
                    ₹{Math.round((Number(form.requestedAmount) * 0.09 / 12) / (1 - Math.pow(1 + 0.09 / 12, -form.tenure))).toLocaleString('en-IN')} / month
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Based on approx. 9% p.a. Actual rate may vary.</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        {/* Step 3 — Review */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>Review Your Application</Typography>
            <Grid container spacing={2} sx={{ bgcolor: '#F8FAFC', borderRadius: 2, p: 2, border: '1px solid var(--border-light)' }}>
              {[
                ['Applicant Name', customer?.name || user.name],
                ['Loan Type', form.loanType],
                ['Requested Amount', `₹${Number(form.requestedAmount).toLocaleString('en-IN')}`],
                ['Tenure', `${form.tenure} months`],
                ['Purpose', form.purpose],
                ['Monthly Income', `₹${Number(form.monthlyIncome || 0).toLocaleString('en-IN')}`],
                ['Existing EMI', `₹${Number(form.existingEmi || 0).toLocaleString('en-IN')}`],
              ].map(([label, value]) => (
                <Grid item xs={12} sm={6} key={label}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Typography>
                  <Typography variant="body2" fontWeight={600} mt={0.3}>{value || '—'}</Typography>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'var(--warning-bg)', borderRadius: 2, border: '1px solid rgba(245,158,11,0.3)' }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                ⓘ By submitting, you confirm that all information provided is accurate. You authorize Star Buzz Solutions to verify your details and check your CIBIL score.
              </Typography>
            </Box>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button disabled={activeStep === 0} onClick={() => setActiveStep(p => p - 1)} startIcon={<ChevronLeft size={16} />} sx={{ fontWeight: 600 }}>Back</Button>
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext} endIcon={<ChevronRight size={16} />} sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-dark)' }, fontWeight: 600 }}>Next Step</Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit} startIcon={<CheckCircle size={16} />} sx={{ bgcolor: 'var(--success)', '&:hover': { bgcolor: '#059669' }, fontWeight: 600, px: 3 }}>Submit Application</Button>
          )}
        </Box>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default LoanApplication;
