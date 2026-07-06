// demoDataService.js — Initialize and reset demo data

import { storageService } from './storageService';
import {
  usersData, loanCategoriesData, leadsData, customersData,
  applicationsData, documentsData, followUpsData, ticketsData,
  collectionsData, timelineData
} from '../data/seedData';

export const demoDataService = {
  initialize: () => {
    if (!storageService.get('users')) {
      demoDataService.resetData();
    }
  },

  resetData: () => {
    storageService.clear();
    storageService.set('users', usersData);
    storageService.set('loanCategories', loanCategoriesData);
    storageService.set('leads', leadsData);
    storageService.set('customers', customersData);
    storageService.set('applications', applicationsData);
    storageService.set('documents', documentsData);
    storageService.set('followUps', followUpsData);
    storageService.set('tickets', ticketsData);
    storageService.set('collections', collectionsData);
    storageService.set('timeline', timelineData);
    console.log('[StarBuzz CRM] Demo data reset successfully.');
  },
};
