// leadService.js — Full CRUD for Leads

import { storageService } from './storageService';
import { addTimelineEntry } from './timelineService';

export const leadService = {
  getAll: () => storageService.get('leads') || [],

  getById: (id) => {
    const leads = storageService.get('leads') || [];
    return leads.find(l => l.id === id) || null;
  },

  create: (data) => {
    const leads = storageService.get('leads') || [];
    const lead = {
      ...data,
      id: storageService.genId('LD'),
      createdDate: new Date().toISOString(),
      status: data.status || 'New',
    };
    leads.unshift(lead);
    storageService.set('leads', leads);
    addTimelineEntry(lead.id, 'Lead', 'Created', `New lead created: ${lead.name}`);
    return lead;
  },

  update: (id, data) => {
    let leads = storageService.get('leads') || [];
    const idx = leads.findIndex(l => l.id === id);
    if (idx === -1) return null;
    const old = leads[idx];
    leads[idx] = { ...old, ...data };
    storageService.set('leads', leads);
    if (old.status !== leads[idx].status) {
      addTimelineEntry(id, 'Lead', 'Status Changed', `Status changed to ${leads[idx].status}`);
    } else {
      addTimelineEntry(id, 'Lead', 'Updated', 'Lead details updated.');
    }
    return leads[idx];
  },

  delete: (id) => {
    let leads = storageService.get('leads') || [];
    storageService.set('leads', leads.filter(l => l.id !== id));
  },

  addFollowUp: (leadId, followUpData) => {
    const followUps = storageService.get('followUps') || [];
    const fu = {
      ...followUpData,
      id: storageService.genId('FU'),
      leadId,
      createdDate: new Date().toISOString(),
      status: 'Pending',
    };
    followUps.unshift(fu);
    storageService.set('followUps', followUps);
    addTimelineEntry(leadId, 'Lead', 'Follow-Up Added', `Follow-up scheduled for ${followUpData.date}`);
    return fu;
  },

  getFollowUps: (leadId) => {
    const followUps = storageService.get('followUps') || [];
    return followUps.filter(f => f.leadId === leadId);
  },
};
