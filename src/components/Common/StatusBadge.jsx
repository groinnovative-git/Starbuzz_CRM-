// StatusBadge.jsx — Premium color-coded status chip

import React from 'react';

const statusConfig = {
  // Lead statuses
  'New':                  { cls: 'new',          label: 'New' },
  'Contacted':            { cls: 'contacted',     label: 'Contacted' },
  'Interested':           { cls: 'active',        label: 'Interested' },
  'Not Interested':       { cls: 'closed',        label: 'Not Interested' },
  'Follow-up':            { cls: 'pending',       label: 'Follow-up' },
  'Converted':            { cls: 'converted',     label: 'Converted' },
  'Closed':               { cls: 'closed',        label: 'Closed' },

  // Application statuses
  'New Application':      { cls: 'new',           label: 'New Application' },
  'Under Review':         { cls: 'under-review',  label: 'Under Review' },
  'Document Pending':     { cls: 'pending',       label: 'Doc Pending' },
  'Document Verified':    { cls: 'verified',      label: 'Doc Verified' },
  'Approved':             { cls: 'approved',      label: 'Approved' },
  'Rejected':             { cls: 'rejected',      label: 'Rejected' },
  'Disbursed':            { cls: 'disbursed',     label: 'Disbursed' },

  // Document statuses
  'Uploaded':             { cls: 'new',           label: 'Uploaded' },
  'Pending Verification': { cls: 'pending',       label: 'Pending Review' },

  // Ticket statuses
  'Open':                 { cls: 'open',          label: 'Open' },
  'Assigned':             { cls: 'assigned',      label: 'Assigned' },
  'In Progress':          { cls: 'in-progress',   label: 'In Progress' },
  'Resolved':             { cls: 'resolved',      label: 'Resolved' },

  // Collection/payment statuses
  'Paid':                 { cls: 'paid',          label: 'Paid' },
  'Partial':              { cls: 'partial',       label: 'Partial' },
  'Overdue':              { cls: 'overdue',       label: 'Overdue' },
  'Pending':              { cls: 'pending',       label: 'Pending' },

  // User
  'Active':               { cls: 'approved',      label: 'Active' },
  'Inactive':             { cls: 'rejected',      label: 'Inactive' },
  // Priorities
  'High':                 { cls: 'rejected',      label: 'High' },
  'Critical':             { cls: 'rejected',      label: 'Critical' },
  'Medium':               { cls: 'pending',       label: 'Medium' },
  'Low':                  { cls: 'new',           label: 'Low' },
  'Urgent':               { cls: 'rejected',      label: 'Urgent' },
};

const StatusBadge = ({ status }) => {
  let config = statusConfig[status];
  
  if (!config) {
    if (typeof status === 'number') {
      // CIBIL logic
      if (status >= 750) config = { cls: 'approved', label: status };
      else if (status >= 650) config = { cls: 'pending', label: status };
      else config = { cls: 'rejected', label: status };
    } else {
      // Generic fallback for sources/doc types
      config = { cls: 'neutral', label: status || 'Unknown' };
    }
  }

  return (
    <span className={`status-badge ${config.cls}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
