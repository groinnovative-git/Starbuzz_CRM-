// collectionService.js — Full CRUD for Collections/EMI

import { storageService } from './storageService';
import { addTimelineEntry } from './timelineService';

export const collectionService = {
  getAll: () => storageService.get('collections') || [],

  getById: (id) => {
    const collections = storageService.get('collections') || [];
    return collections.find(c => c.id === id) || null;
  },

  getByApplicationId: (applicationId) => {
    const collections = storageService.get('collections') || [];
    return collections.filter(c => c.applicationId === applicationId);
  },

  getSummary: () => {
    const collections = storageService.get('collections') || [];
    return {
      total: collections.length,
      paid: collections.filter(c => c.paymentStatus === 'Paid').length,
      partial: collections.filter(c => c.paymentStatus === 'Partial').length,
      overdue: collections.filter(c => c.paymentStatus === 'Overdue').length,
      pending: collections.filter(c => c.paymentStatus === 'Pending').length,
      totalDue: collections.reduce((s, c) => s + (c.emiAmount || 0), 0),
      totalCollected: collections.reduce((s, c) => s + (c.paidAmount || 0), 0),
    };
  },

  markPaid: (id, paidAmount, by = 'Officer') => {
    let collections = storageService.get('collections') || [];
    const idx = collections.findIndex(c => c.id === id);
    if (idx === -1) return null;
    const amt = Number(paidAmount);
    collections[idx] = {
      ...collections[idx],
      paidAmount: amt,
      balanceAmount: (collections[idx].emiAmount || 0) - amt,
      paymentStatus: amt >= (collections[idx].emiAmount || 0) ? 'Paid' : 'Partial',
      paymentDate: new Date().toISOString().split('T')[0],
    };
    storageService.set('collections', collections);
    addTimelineEntry(collections[idx].applicationId, 'Collection', 'Payment Recorded',
      `EMI payment of ₹${amt.toLocaleString()} recorded for ${collections[idx].emiMonth} by ${by}`);
    return collections[idx];
  },

  markOverdue: (id) => {
    let collections = storageService.get('collections') || [];
    const idx = collections.findIndex(c => c.id === id);
    if (idx === -1) return null;
    collections[idx] = { ...collections[idx], paymentStatus: 'Overdue' };
    storageService.set('collections', collections);
    addTimelineEntry(collections[idx].applicationId, 'Collection', 'Overdue',
      `EMI for ${collections[idx].emiMonth} marked as overdue.`);
    return collections[idx];
  },

  update: (id, data) => {
    let collections = storageService.get('collections') || [];
    const idx = collections.findIndex(c => c.id === id);
    if (idx === -1) return null;
    collections[idx] = { ...collections[idx], ...data };
    storageService.set('collections', collections);
    return collections[idx];
  },
};
