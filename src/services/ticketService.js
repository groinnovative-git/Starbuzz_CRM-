// ticketService.js — Full CRUD for Support Tickets

import { storageService } from './storageService';
import { addTimelineEntry } from './timelineService';

export const ticketService = {
  getAll: () => storageService.get('tickets') || [],

  getById: (id) => {
    const tickets = storageService.get('tickets') || [];
    return tickets.find(t => t.id === id) || null;
  },

  getByCustomerId: (customerId) => {
    const tickets = storageService.get('tickets') || [];
    return tickets.filter(t => t.customerId === customerId);
  },

  create: (data) => {
    const tickets = storageService.get('tickets') || [];
    const ticket = {
      ...data,
      id: storageService.genId('TKT'),
      createdDate: new Date().toISOString(),
      status: 'Open',
      responses: [],
    };
    tickets.unshift(ticket);
    storageService.set('tickets', tickets);
    addTimelineEntry(ticket.id, 'Ticket', 'Created',
      `Support ticket raised: ${ticket.subject || ticket.category}`);
    return ticket;
  },

  update: (id, data) => {
    let tickets = storageService.get('tickets') || [];
    const idx = tickets.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const old = tickets[idx];
    tickets[idx] = { ...old, ...data };
    storageService.set('tickets', tickets);
    if (old.status !== tickets[idx].status) {
      addTimelineEntry(id, 'Ticket', 'Status Changed',
        `Ticket status changed to ${tickets[idx].status}`);
    }
    return tickets[idx];
  },

  addResponse: (id, responseText, by = 'Admin') => {
    let tickets = storageService.get('tickets') || [];
    const idx = tickets.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const response = {
      id: storageService.genId('RESP'),
      text: responseText,
      by,
      date: new Date().toISOString(),
    };
    tickets[idx] = {
      ...tickets[idx],
      responses: [...(tickets[idx].responses || []), response],
      adminResponse: responseText,
      lastResponseDate: new Date().toISOString(),
    };
    storageService.set('tickets', tickets);
    addTimelineEntry(id, 'Ticket', 'Response Added', `Response added by ${by}`);
    return tickets[idx];
  },

  changeStatus: (id, status, by = 'Admin') => {
    let tickets = storageService.get('tickets') || [];
    const idx = tickets.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tickets[idx] = { ...tickets[idx], status, lastUpdated: new Date().toISOString() };
    storageService.set('tickets', tickets);
    addTimelineEntry(id, 'Ticket', 'Status Changed', `Ticket ${status} by ${by}`);
    return tickets[idx];
  },

  delete: (id) => {
    let tickets = storageService.get('tickets') || [];
    storageService.set('tickets', tickets.filter(t => t.id !== id));
  },
};
