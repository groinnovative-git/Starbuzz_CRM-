// documentService.js — Full CRUD for Documents

import { storageService } from './storageService';
import { addTimelineEntry } from './timelineService';

export const documentService = {
  getAll: () => storageService.get('documents') || [],

  getById: (id) => {
    const docs = storageService.get('documents') || [];
    return docs.find(d => d.id === id) || null;
  },

  getByApplicationId: (applicationId) => {
    const docs = storageService.get('documents') || [];
    return docs.filter(d => d.applicationId === applicationId);
  },

  getByCustomerId: (customerId) => {
    const docs = storageService.get('documents') || [];
    return docs.filter(d => d.customerId === customerId);
  },

  create: (data) => {
    const docs = storageService.get('documents') || [];
    // Remove old doc of same type for same application if re-uploading
    const filtered = docs.filter(d =>
      !(d.applicationId === data.applicationId && d.customerId === data.customerId && d.type === data.type)
    );
    const doc = {
      ...data,
      id: storageService.genId('DOC'),
      uploadDate: new Date().toISOString(),
      status: 'Uploaded',
      remarks: '',
    };
    filtered.unshift(doc);
    storageService.set('documents', filtered);
    addTimelineEntry(doc.applicationId || doc.customerId, 'Document', 'Uploaded',
      `${doc.type} uploaded by customer.`);
    return doc;
  },

  update: (id, data) => {
    let docs = storageService.get('documents') || [];
    const idx = docs.findIndex(d => d.id === id);
    if (idx === -1) return null;
    docs[idx] = { ...docs[idx], ...data };
    storageService.set('documents', docs);
    return docs[idx];
  },

  approve: (id, by = 'Officer') => {
    let docs = storageService.get('documents') || [];
    const idx = docs.findIndex(d => d.id === id);
    if (idx === -1) return null;
    docs[idx] = { ...docs[idx], status: 'Approved', approvedBy: by, approvedDate: new Date().toISOString(), remarks: '' };
    storageService.set('documents', docs);
    addTimelineEntry(docs[idx].applicationId, 'Document', 'Approved',
      `${docs[idx].type} approved by ${by}.`);
    return docs[idx];
  },

  reject: (id, remarks = '', by = 'Officer') => {
    let docs = storageService.get('documents') || [];
    const idx = docs.findIndex(d => d.id === id);
    if (idx === -1) return null;
    docs[idx] = { ...docs[idx], status: 'Rejected', remarks, rejectedBy: by, rejectedDate: new Date().toISOString() };
    storageService.set('documents', docs);
    addTimelineEntry(docs[idx].applicationId, 'Document', 'Rejected',
      `${docs[idx].type} rejected. Reason: ${remarks}`);
    return docs[idx];
  },

  delete: (id) => {
    let docs = storageService.get('documents') || [];
    storageService.set('documents', docs.filter(d => d.id !== id));
  },
};
