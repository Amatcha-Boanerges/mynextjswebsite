import { createContext, useContext, useState, ReactNode } from 'react';
import { Event } from '../lib/events'; // Adjusted path if necessary based on actual file structure

interface EventsContextType {
  events: Event[];
  upcomingEvents: Event[];
  pastEvents: Event[];
  // isLoading and error might be less relevant if data is always pre-fetched
  // For now, we'll keep them but they might be simplified or removed if pages always provide data.
  isLoading: boolean;
  error: Error | null;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

interface EventsProviderProps {
  children: ReactNode;
  initialEvents: Event[]; // Prop to pass pre-fetched events
}

export function EventsProvider({ children, initialEvents }: EventsProviderProps) {
  // Initialize state with pre-fetched initialEvents
  const [events, setEvents] = useState<Event[]>(initialEvents);
  // Data is pre-fetched, so isLoading is initially false.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // useEffect for fetching is removed as data is now passed in.

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