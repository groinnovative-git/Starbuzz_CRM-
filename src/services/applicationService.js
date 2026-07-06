// applicationService.js — Full CRUD for Loan Applications

import { storageService } from './storageService';
import { addTimelineEntry } from './timelineService';

const generateCollectionSchedule = (app) => {
  const collections = storageService.get('collections') || [];
  const amount = app.approvedAmount || app.requestedAmount;
  const tenure = app.tenure || 12;
  const emiAmount = Math.round(amount / tenure);
  const customerName = app.customerName || '';

  for (let i = 1; i <= tenure; i++) {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i);
    collections.push({
      id: `COL${Date.now()}_${i}`,
      applicationId: app.id,
      customerId: app.customerId,
      customerName,
      loanType: app.loanType,
      emiMonth: dueDate.toISOString().slice(0, 7),
      emiNumber: i,
      totalEmis: tenure,
      emiAmount,
      paidAmount: 0,
      balanceAmount: emiAmount,
      dueDate: dueDate.toISOString().split('T')[0],
      paymentDate: null,
      paymentStatus: 'Pending',
    });
  }
  storageService.set('collections', collections);
};

export const applicationService = {
  getAll: () => storageService.get('applications') || [],

  getById: (id) => {
    const apps = storageService.get('applications') || [];
    return apps.find(a => a.id === id) || null;
  },

  getByCustomerId: (customerId) => {
    const apps = storageService.get('applications') || [];
    return apps.filter(a => a.customerId === customerId);
  },

  create: (data) => {
    const apps = storageService.get('applications') || [];
    const app = {
      ...data,
      id: storageService.genId('APP'),
      createdDate: new Date().toISOString(),
      status: 'New Application',
      statusHistory: [{
        status: 'New Application',
        date: new Date().toISOString(),
        remark: 'Application submitted.',
        by: data.assignedOfficer || 'System',
      }],
    };
    apps.unshift(app);
    storageService.set('applications', apps);
    addTimelineEntry(app.id, 'Application', 'Created', `Loan application submitted for ${app.customerName}`);
    return app;
  },

  update: (id, data) => {
    let apps = storageService.get('applications') || [];
    const idx = apps.findIndex(a => a.id === id);
    if (idx === -1) return null;
    apps[idx] = { ...apps[idx], ...data };
    storageService.set('applications', apps);
    addTimelineEntry(id, 'Application', 'Updated', 'Application details updated.');
    return apps[idx];
  },

  updateStatus: (id, newStatus, remark = '', by = 'System', extraData = {}) => {
    let apps = storageService.get('applications') || [];
    const idx = apps.findIndex(a => a.id === id);
    if (idx === -1) return null;

    const historyEntry = {
      status: newStatus,
      date: new Date().toISOString(),
      remark: remark || `Status updated to ${newStatus}`,
      by,
    };

    apps[idx] = {
      ...apps[idx],
      status: newStatus,
      ...extraData,
      statusHistory: [...(apps[idx].statusHistory || []), historyEntry],
    };

    storageService.set('applications', apps);
    addTimelineEntry(id, 'Application', 'Status Changed', `Status updated to ${newStatus}. ${remark}`.trim());

    if (newStatus === 'Disbursed') {
      generateCollectionSchedule(apps[idx]);
      addTimelineEntry(id, 'Application', 'Disbursed', 'EMI collection schedule generated.');
    }

    return apps[idx];
  },

  approve: (id, approvedAmount, remark = '', by = 'Loan Officer') => {
    return applicationService.updateStatus(id, 'Approved', remark, by, {
      approvedAmount: Number(approvedAmount),
      approvalDate: new Date().toISOString(),
      approvalRemark: remark,
    });
  },

  reject: (id, reason = '', by = 'Loan Officer') => {
    return applicationService.updateStatus(id, 'Rejected', reason, by, {
      rejectionReason: reason,
      rejectionDate: new Date().toISOString(),
    });
  },

  disburse: (id, disbursedAmount, by = 'Loan Officer') => {
    return applicationService.updateStatus(id, 'Disbursed', 'Loan disbursed.', by, {
      disbursedAmount: Number(disbursedAmount),
      disbursementDate: new Date().toISOString(),
    });
  },

  delete: (id) => {
    let apps = storageService.get('applications') || [];
    storageService.set('applications', apps.filter(a => a.id !== id));
  },
};

// Keep backward compatibility
export const loanService = applicationService;
