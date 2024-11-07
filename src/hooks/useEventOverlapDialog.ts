import { useState } from 'react';

import { Event, EventForm } from '../types';
import { findOverlappingEvents } from '../utils/eventOverlap';

export function useOverlapDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const checkAndShowOverlapDialog = (eventData: Event | EventForm, events: Event[]) => {
    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOpen(true);
      return true;
    }
    return false;
  };

  return {
    isOpen,
    setIsOpen,
    overlappingEvents,
    checkAndShowOverlapDialog,
  };
}
