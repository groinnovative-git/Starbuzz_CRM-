// customerService.js — Full CRUD for Customers

import { storageService } from './storageService';
import { addTimelineEntry } from './timelineService';

export const customerService = {
  getAll: () => storageService.get('customers') || [],

  getById: (id) => {
    const customers = storageService.get('customers') || [];
    return customers.find(c => c.id === id) || null;
  },

  getByUserId: (userId) => {
    const customers = storageService.get('customers') || [];
    return customers.find(c => c.userId === userId || c.userId === String(userId)) || null;
  },

  getByMobile: (mobile) => {
    const customers = storageService.get('customers') || [];
    return customers.find(c => c.mobile === mobile) || null;
  },

  create: (data) => {
    const customers = storageService.get('customers') || [];
    const customer = {
      ...data,
      id: storageService.genId('CUST'),
      createdDate: new Date().toISOString(),
    };
    customers.unshift(customer);
    storageService.set('customers', customers);
    addTimelineEntry(customer.id, 'Customer', 'Created', `Customer profile created: ${customer.name}`);
    return customer;
  },

  update: (id, data) => {
    let customers = storageService.get('customers') || [];
    const idx = customers.findIndex(c => c.id === id);
    if (idx === -1) return null;
    customers[idx] = { ...customers[idx], ...data };
    storageService.set('customers', customers);
    addTimelineEntry(id, 'Customer', 'Updated', 'Customer details updated.');
    return customers[idx];
  },

  delete: (id) => {
    let customers = storageService.get('customers') || [];
    storageService.set('customers', customers.filter(c => c.id !== id));
  },
};
