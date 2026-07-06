// DetailGrid.jsx — Reusable Detail Modal Components
// Used across: Customers, Leads, Applications, Documents, Tickets

import React from 'react';
import { Box, Typography, Grid, Dialog, DialogContent, DialogActions, Button, Tab, Tabs } from '@mui/material';
import StatusBadge from './StatusBadge';

/* ─── Avatar with Initials ─── */
const InitialsAvatar = ({ name, size = 52 }) => {
  const initials = (name || '??')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <Box sx={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #1B3A6B 0%, #0E7C7B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: size * 0.38, letterSpacing: 0.5,
      flexShrink: 0,
    }}>
      {initials}
    </Box>
  );
};

/* ─── CIBIL Score Widget ─── */
export const CibilScore = ({ score }) => {
  if (!score) return <span style={{ color: '#9CA3AF', fontWeight: 500 }}>—</span>;
  const num = Number(score);
  const pct = Math.max(0, Math.min(100, ((num - 300) / 600) * 100));
  let color, label;
  if (num >= 750) { color = '#0E7C7B'; label = 'Excellent'; }
  else if (num >= 650) { color = '#D97706'; label = 'Good'; }
  else { color = '#DC2626'; label = 'Needs Review'; }

  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color }}>{num}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: 0.3 }}>· {label}</span>
      </Box>
      <Box sx={{ width: 120, height: 5, borderRadius: 3, bgcolor: '#E5E7EB', overflow: 'hidden' }}>
        <Box sx={{ width: `${pct}%`, height: '100%', borderRadius: 3, bgcolor: color, transition: 'width 0.5s ease' }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 120 }}>
        <span style={{ fontSize: 9, color: '#9CA3AF' }}>300</span>
        <span style={{ fontSize: 9, color: '#9CA3AF' }}>900</span>
      </Box>
    </Box>
  );
};

/* ─── Detail Field (single label/value pair) ─── */
export const DetailField = ({ label, value, component, fullWidth }) => (
  <Grid item xs={12} sm={fullWidth ? 12 : 6} md={fullWidth ? 12 : 4}>
    <Typography sx={{
      fontSize: 11, fontWeight: 700, color: '#6B7280',
      textTransform: 'uppercase', letterSpacing: 0.6,
      display: 'block', mb: 0.5, lineHeight: 1,
    }}>
      {label}
    </Typography>
    {component ? (
      <Box sx={{ mt: 0.25 }}>{component}</Box>
    ) : (
      <Typography sx={{
        fontSize: 14, fontWeight: 500, color: '#111827',
        wordBreak: 'break-word', lineHeight: 1.4, mt: 0.25,
      }}>
        {value || '—'}
      </Typography>
    )}
  </Grid>
);

/* ─── Detail Section (grouped card with icon + title) ─── */
export const DetailSection = ({ icon: Icon, title, children }) => (
  <Box sx={{
    mb: 2.5, p: '20px 24px', bgcolor: '#FAFBFC',
    borderRadius: 3, border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  }}>
    {title && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        {Icon && (
          <Box sx={{
            width: 28, height: 28, borderRadius: 2,
            bgcolor: 'rgba(27,58,107,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={14} color="#1B3A6B" strokeWidth={2.2} />
          </Box>
        )}
        <Typography sx={{
          fontSize: 12, fontWeight: 800, color: '#1B3A6B',
          textTransform: 'uppercase', letterSpacing: 0.8,
        }}>
          {title}
        </Typography>
      </Box>
    )}
    <Grid container spacing={3}>
      {children}
    </Grid>
  </Box>
);

/* ─── Detail Modal Header (Identity Block) ─── */
const DetailModalHeader = ({ name, subtitle, pills, children }) => (
  <Box sx={{
    px: 3, pt: 3, pb: 2,
    background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
    borderBottom: '1px solid #E5E7EB',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
      <InitialsAvatar name={name} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
            {name}
          </Typography>
          {pills}
        </Box>
        {subtitle && (
          <Typography sx={{ fontSize: 13, color: '#6B7280', mt: 0.5, lineHeight: 1.3 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  </Box>
);

/* ─── Detail Modal (full wrapper) ─── */
export const DetailModal = ({
  open, onClose, name, subtitle, pills,
  tabs, activeTab, onTabChange,
  actions, headerActions,
  children, maxWidth = 'lg',
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth={maxWidth}
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 3,
        overflow: 'hidden',
        maxHeight: '90vh',
      },
    }}
  >
    <DetailModalHeader name={name} subtitle={subtitle} pills={pills}>
      {headerActions}
    </DetailModalHeader>

    {tabs && tabs.length > 0 && (
      <Box sx={{ px: 3, bgcolor: '#fff', borderBottom: '1px solid #E5E7EB' }}>
        <Tabs
          value={activeTab || 0}
          onChange={(_, v) => onTabChange?.(v)}
          sx={{
            minHeight: 42,
            '& .MuiTab-root': {
              fontSize: 13, fontWeight: 600, minHeight: 42,
              textTransform: 'none', py: 0,
            },
          }}
        >
          {tabs.map((t, i) => <Tab key={i} label={t} />)}
        </Tabs>
      </Box>
    )}

    <DialogContent sx={{ p: 3, bgcolor: '#fff' }}>
      {children}
    </DialogContent>

    {actions && (
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #E5E7EB', bgcolor: '#FAFBFC' }}>
        {actions}
      </DialogActions>
    )}
  </Dialog>
);

export default DetailModal;
