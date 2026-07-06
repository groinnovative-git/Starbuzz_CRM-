// timelineService.js — Shared timeline helper

import { storageService } from './storageService';

export const addTimelineEntry = (referenceId, type, action, description, performedBy = 'System') => {
  const timeline = storageService.get('timeline') || [];
  timeline.unshift({
    id: storageService.genId('TL'),
    referenceId,
    type,
    action,
    description,
    performedBy,
    date: new Date().toISOString(),
  });
  storageService.set('timeline', timeline);
};

export const getTimelineFor = (referenceId) => {
  const timeline = storageService.get('timeline') || [];
  return timeline.filter(t => t.referenceId === referenceId);
};
