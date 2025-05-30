import { render, screen, waitFor } from '@testing-library/react';
import { EventsProvider, useEvents } from './EventsContext';
import { Event } from '../lib/events';

// Mock the events module
jest.mock('../lib/events', () => ({
  getAllEvents: jest.fn()
}));

// Get the mocked function
const mockGetAllEvents = jest.requireMock('../lib/events').getAllEvents;

// Test component that uses the events context
function TestComponent() {
  const { events, upcomingEvents, pastEvents, isLoading, error } = useEvents();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <div>Total events: {events.length}</div>
      <div>Upcoming events: {upcomingEvents.length}</div>
      <div>Past events: {pastEvents.length}</div>
    </div>
  );
}

describe('EventsContext', () => {
  beforeEach(() => {
    mockGetAllEvents.mockReset();
  });

  it('should provide loading state initially', async () => {
    // Make the mock function return a promise that resolves after a delay
    mockGetAllEvents.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 100)));
    
    render(
      <EventsProvider>
        <TestComponent />
      </EventsProvider>
    );
    
    // Loading state should be shown initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Total events: 0')).toBeInTheDocument();
    });
  });

  it('should provide events after loading', async () => {
    const mockEvents: Event[] = [
      {
        slug: 'future-event',
        title: 'Future Event',
        date: '2025-01-01',
        location: 'Online',
        description: 'A future event',
        isUpcoming: true
      },
      {
        slug: 'past-event',
        title: 'Past Event',
        date: '2020-01-01',
        location: 'Online',
        description: 'A past event',
        isUpcoming: false
      }
    ];
    
    mockGetAllEvents.mockReturnValue(mockEvents);
    
    render(
      <EventsProvider>
        <TestComponent />
      </EventsProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Total events: 2')).toBeInTheDocument();
      expect(screen.getByText('Upcoming events: 1')).toBeInTheDocument();
      expect(screen.getByText('Past events: 1')).toBeInTheDocument();
    });
  });

  it('should handle errors', async () => {
    mockGetAllEvents.mockImplementation(() => {
      throw new Error('Failed to load events');
    });
    
    render(
      <EventsProvider>
        <TestComponent />
      </EventsProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to load events')).toBeInTheDocument();
    });
  });
}); 