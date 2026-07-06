// storageService.js — Centralized localStorage operations

export const storageService = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch { return null; }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { console.error('Storage error:', e); }
  },

  remove: (key) => {
    try { localStorage.removeItem(key); } catch {}
  },

  clear: () => {
    try { localStorage.clear(); } catch {}
  },

  // Generate a unique ID with prefix
  genId: (prefix) => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`,
};
