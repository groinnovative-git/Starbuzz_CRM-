// userService.js — Full CRUD for Users

import { storageService } from './storageService';

export const userService = {
  getAll: () => storageService.get('users') || [],

  getById: (id) => {
    const users = storageService.get('users') || [];
    return users.find(u => u.id === id || u.id === Number(id)) || null;
  },

  getStaff: () => {
    const users = storageService.get('users') || [];
    return users.filter(u => ['admin', 'officer', 'sales'].includes(u.role));
  },

  create: (data) => {
    const users = storageService.get('users') || [];
    const user = {
      ...data,
      id: storageService.genId('USR'),
      createdDate: new Date().toISOString(),
      status: 'Active',
    };
    users.unshift(user);
    storageService.set('users', users);
    return user;
  },

  update: (id, data) => {
    let users = storageService.get('users') || [];
    const idx = users.findIndex(u => u.id === id || u.id === Number(id));
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data };
    storageService.set('users', users);
    return users[idx];
  },

  toggleStatus: (id) => {
    let users = storageService.get('users') || [];
    const idx = users.findIndex(u => u.id === id || u.id === Number(id));
    if (idx === -1) return null;
    users[idx].status = users[idx].status === 'Active' ? 'Inactive' : 'Active';
    storageService.set('users', users);
    return users[idx];
  },

  delete: (id) => {
    let users = storageService.get('users') || [];
    storageService.set('users', users.filter(u => u.id !== id && u.id !== Number(id)));
  },
};
