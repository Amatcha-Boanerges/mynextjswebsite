import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Event, getAllEvents } from '../lib/events';

interface EventsContextType {
  events: Event[];
  upcomingEvents: Event[];
  pastEvents: Event[];
  isLoading: boolean;
  error: Error | null;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

interface EventsProviderProps {
  children: ReactNode;
}

export function EventsProvider({ children }: EventsProviderProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const allEvents = await getAllEvents();
        setEvents(allEvents);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load events'));
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Compute derived state
  const upcomingEvents = events.filter(event => event.isUpcoming);
  const pastEvents = events.filter(event => !event.isUpcoming);

  const value = {
    events,
    upcomingEvents,
    pastEvents,
    isLoading,
    error
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents(): EventsContextType {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
} 