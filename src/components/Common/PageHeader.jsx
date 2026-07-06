// PageHeader.jsx — Consistent page header

import React from 'react';
import { Button } from '@mui/material';
import { Plus } from 'lucide-react';

const PageHeader = ({ title, subtitle, actionLabel, onAction, actionIcon }) => (
  <div className="page-header">
    <div className="page-header-left">
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
    {actionLabel && (
      <Button
        variant="contained"
        startIcon={actionIcon || <Plus size={16} />}
        onClick={onAction}
        sx={{
          bgcolor: 'var(--accent)',
          color: '#fff',
          fontWeight: 600,
          px: 2.5,
          py: 1,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,191,165,0.3)',
          '&:hover': { bgcolor: 'var(--accent-dark)', boxShadow: '0 6px 16px rgba(0,191,165,0.4)' },
        }}
      >
        {actionLabel}
      </Button>
    )}
  </div>
);

export default PageHeader;
