// ConfirmDialog.jsx — Reusable confirm dialog

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  confirmColor = 'error',
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <AlertTriangle size={20} color={confirmColor === 'error' ? 'var(--error)' : 'var(--warning)'} />
      {title}
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
      <Button onClick={onClose} variant="outlined" size="small">Cancel</Button>
      <Button
        onClick={() => { onConfirm(); onClose(); }}
        variant="contained"
        size="small"
        color={confirmColor}
        sx={{ fontWeight: 600 }}
      >
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
