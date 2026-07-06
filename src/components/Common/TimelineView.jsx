// TimelineView.jsx — Reusable vertical timeline component

import React from 'react';
import { Box, Typography } from '@mui/material';
import { CheckCircle, FileText, User, Upload, MessageSquare, Wallet, Clock } from 'lucide-react';

const getIcon = (type, action) => {
  if (action?.toLowerCase().includes('approved') || action?.toLowerCase().includes('disbursed')) return <CheckCircle size={14} />;
  if (type === 'Document') return <Upload size={14} />;
  if (type === 'Ticket') return <MessageSquare size={14} />;
  if (type === 'Collection') return <Wallet size={14} />;
  if (type === 'Customer') return <User size={14} />;
  if (type === 'Application') return <FileText size={14} />;
  return <Clock size={14} />;
};

const TimelineView = ({ entries = [], emptyText = 'No activity yet.' }) => {
  if (!entries.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: 'var(--text-muted)' }}>
        <Clock size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
        <Typography variant="body2">{emptyText}</Typography>
      </Box>
    );
  }

  return (
    <div className="timeline">
      {entries.map((entry, i) => (
        <div key={entry.id || i} className="timeline-item">
          <div className="timeline-line">
            <div className="timeline-dot">{getIcon(entry.type, entry.action)}</div>
            {i < entries.length - 1 && <div className="timeline-connector" />}
          </div>
          <div className="timeline-content">
            <div className="timeline-action">{entry.action}</div>
            <div className="timeline-desc">{entry.description}</div>
            <div className="timeline-date">
              {entry.performedBy && <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{entry.performedBy} · </span>}
              {new Date(entry.date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineView;
