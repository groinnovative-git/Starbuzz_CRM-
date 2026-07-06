import { storageService } from './storageService';

const NEWS_KEY = 'starbuzz_news';

const defaultNews = [
  {
    id: 'NEWS-1001',
    title: 'Welcome to the Star Buzz Portal',
    category: 'General', // Offer, Alert, General
    content: 'We are thrilled to launch our new and improved customer portal. Track your loans, upload documents securely, and manage your account seamlessly.',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    status: 'Active',
    author: 'Admin'
  },
  {
    id: 'NEWS-1002',
    title: 'Zero Processing Fee on Personal Loans!',
    category: 'Offer',
    content: 'Festive season offer! Enjoy absolute ZERO processing fees on all Personal Loans approved this month. Apply quickly through the portal to avail the benefit.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'Active',
    author: 'Admin'
  }
];

export const newsService = {
  getAll: () => {
    let items = storageService.get(NEWS_KEY);
    if (!items || items.length === 0) {
      storageService.set(NEWS_KEY, defaultNews);
      items = defaultNews;
    }
    // Sort descending by date
    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  
  getActive: () => {
    const all = newsService.getAll();
    return all.filter(item => item.status === 'Active');
  },

  create: (data) => {
    const items = newsService.getAll();
    const newId = `NEWS-${1000 + items.length + 1}`;
    const newItem = {
      ...data,
      id: newId,
      date: new Date().toISOString()
    };
    storageService.set(NEWS_KEY, [newItem, ...items]);
    return newItem;
  },

  update: (id, data) => {
    const items = newsService.getAll();
    const index = items.findIndex(n => n.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data };
      storageService.set(NEWS_KEY, items);
      return items[index];
    }
    return null;
  },

  delete: (id) => {
    const items = newsService.getAll();
    storageService.set(NEWS_KEY, items.filter(n => n.id !== id));
  }
};
