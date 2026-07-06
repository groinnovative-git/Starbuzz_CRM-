// reportService.js — Aggregates localStorage data for Reports

import { storageService } from './storageService';

export const reportService = {
  getLeadReport: (filters = {}) => {
    let data = storageService.get('leads') || [];
    if (filters.status) data = data.filter(l => l.status === filters.status);
    if (filters.source) data = data.filter(l => l.source === filters.source);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.mobile?.includes(q) ||
        l.id?.toLowerCase().includes(q)
      );
    }
    if (filters.fromDate) data = data.filter(l => l.createdDate >= filters.fromDate);
    if (filters.toDate)   data = data.filter(l => l.createdDate <= filters.toDate + 'T23:59:59');
    return data;
  },

  getCustomerReport: (filters = {}) => {
    let data = storageService.get('customers') || [];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.mobile?.includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    }
    return data;
  },

  getApplicationReport: (filters = {}) => {
    let data = storageService.get('applications') || [];
    if (filters.status) data = data.filter(a => a.status === filters.status);
    if (filters.loanType) data = data.filter(a => a.loanType === filters.loanType);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(a =>
        a.customerName?.toLowerCase().includes(q) ||
        a.id?.toLowerCase().includes(q)
      );
    }
    if (filters.fromDate) data = data.filter(a => a.createdDate >= filters.fromDate);
    if (filters.toDate)   data = data.filter(a => a.createdDate <= filters.toDate + 'T23:59:59');
    return data;
  },

  getDocumentReport: (filters = {}) => {
    let data = storageService.get('documents') || [];
    if (filters.status) data = data.filter(d => d.status === filters.status);
    if (filters.type) data = data.filter(d => d.type === filters.type);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(d =>
        d.fileName?.toLowerCase().includes(q) ||
        d.applicationId?.toLowerCase().includes(q)
      );
    }
    return data;
  },

  getTicketReport: (filters = {}) => {
    let data = storageService.get('tickets') || [];
    if (filters.status) data = data.filter(t => t.status === filters.status);
    if (filters.priority) data = data.filter(t => t.priority === filters.priority);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(t =>
        t.customerName?.toLowerCase().includes(q) ||
        t.id?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q)
      );
    }
    return data;
  },

  getCollectionReport: (filters = {}) => {
    let data = storageService.get('collections') || [];
    if (filters.status) data = data.filter(c => c.paymentStatus === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(c =>
        c.customerName?.toLowerCase().includes(q) ||
        c.applicationId?.toLowerCase().includes(q)
      );
    }
    return data;
  },

  getDashboardStats: () => {
    const leads = storageService.get('leads') || [];
    const customers = storageService.get('customers') || [];
    const apps = storageService.get('applications') || [];
    const docs = storageService.get('documents') || [];
    const tickets = storageService.get('tickets') || [];
    const collections = storageService.get('collections') || [];

    return {
      leads: {
        total: leads.length,
        new: leads.filter(l => l.status === 'New').length,
        contacted: leads.filter(l => l.status === 'Contacted').length,
        converted: leads.filter(l => l.status === 'Converted').length,
        followUp: leads.filter(l => l.status === 'Follow-up').length,
      },
      customers: { total: customers.length },
      applications: {
        total: apps.length,
        new: apps.filter(a => a.status === 'New Application').length,
        underReview: apps.filter(a => a.status === 'Under Review').length,
        docPending: apps.filter(a => a.status === 'Document Pending').length,
        docVerified: apps.filter(a => a.status === 'Document Verified').length,
        approved: apps.filter(a => a.status === 'Approved').length,
        rejected: apps.filter(a => a.status === 'Rejected').length,
        disbursed: apps.filter(a => a.status === 'Disbursed').length,
        pending: apps.filter(a => ['New Application', 'Under Review', 'Document Pending'].includes(a.status)).length,
        totalLoanValue: apps.filter(a => a.status === 'Disbursed').reduce((s, a) => s + (a.disbursedAmount || a.requestedAmount || 0), 0),
        totalApprovedValue: apps.filter(a => ['Approved', 'Disbursed'].includes(a.status)).reduce((s, a) => s + (a.approvedAmount || a.requestedAmount || 0), 0),
      },
      documents: {
        total: docs.length,
        pending: docs.filter(d => ['Uploaded', 'Pending Verification'].includes(d.status)).length,
        approved: docs.filter(d => d.status === 'Approved').length,
        rejected: docs.filter(d => d.status === 'Rejected').length,
      },
      tickets: {
        total: tickets.length,
        open: tickets.filter(t => ['Open', 'Assigned', 'In Progress'].includes(t.status)).length,
        resolved: tickets.filter(t => ['Resolved', 'Closed'].includes(t.status)).length,
      },
      collections: {
        total: collections.length,
        paid: collections.filter(c => c.paymentStatus === 'Paid').length,
        partial: collections.filter(c => c.paymentStatus === 'Partial').length,
        overdue: collections.filter(c => c.paymentStatus === 'Overdue').length,
        pending: collections.filter(c => c.paymentStatus === 'Pending').length,
        totalCollected: collections.reduce((s, c) => s + (c.paidAmount || 0), 0),
        totalDue: collections.filter(c => ['Pending', 'Overdue'].includes(c.paymentStatus)).reduce((s, c) => s + (c.emiAmount || 0), 0),
      },
    };
  },
};
