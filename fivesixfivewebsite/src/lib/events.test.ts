import { getAllEvents, Event } from './events';
import fs from 'fs';
import path from 'path';

// Mock fs and markdown
jest.mock('fs');
jest.mock('./markdown', () => ({
  getAllMarkdownSlugs: jest.fn()
}));

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedMarkdown = jest.requireMock('./markdown');

// Helper to generate a date string for today + offset days
const getDateString = (offsetDays: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

describe('getAllEvents', () => {
  beforeEach(() => {
    // Reset fs mock before each test
    mockedFs.readFileSync.mockReset();
    // Reset markdown mock before each test
    (mockedMarkdown.getAllMarkdownSlugs as jest.Mock).mockReset();
  });

  const mockEventFileContent = (title: string, date: string, otherFrontMatter: any = {}): string => {
    const frontMatter = {
      title,
      date,
      location: otherFrontMatter.location || 'Default Location',
      description: otherFrontMatter.description || 'Default Description',
      ...otherFrontMatter
    };
    const yamlPart = Object.entries(frontMatter)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    return `---\n${yamlPart}\n---\nSome markdown content`;
  };

  test('should correctly identify upcoming and past events and sort them', async () => {
    const todayStr = getDateString();
    const futureDateStr = getDateString(5);
    const pastDateStr = getDateString(-5);
    const anotherFutureDateStr = getDateString(10);
    const anotherPastDateStr = getDateString(-10);

    // Mock markdown helper
    (mockedMarkdown.getAllMarkdownSlugs as jest.Mock).mockReturnValue([
      'event-today',
      'event-future',
      'event-past',
      'event-another-future',
      'event-another-past'
    ]);

    // Mock fs.readFileSync to return content based on the file path
    mockedFs.readFileSync.mockImplementation((filePath: fs.PathOrFileDescriptor, options?: any): string => {
      if (typeof filePath !== 'string') {
        throw new Error('File descriptor not supported in mock');
      }
      const fileName = path.basename(filePath, '.md');
      switch (fileName) {
        case 'event-today':
          return mockEventFileContent('Event Today', todayStr, { location: 'Here', description: 'Desc'});
        case 'event-future':
          return mockEventFileContent('Event Future', futureDateStr, { location: 'There', description: 'Desc'});
        case 'event-past':
          return mockEventFileContent('Event Past', pastDateStr, { location: 'Elsewhere', description: 'Desc'});
        case 'event-another-future':
          return mockEventFileContent('Event Another Future', anotherFutureDateStr, { location: 'Online', description: 'Desc'});
        case 'event-another-past':
          return mockEventFileContent('Event Another Past', anotherPastDateStr, { location: 'Venue', description: 'Desc'});
        default:
          throw new Error(`No mock content for ${filePath}`);
      }
    });

    const events = await getAllEvents();

    expect(events).toHaveLength(5);

    // Check isUpcoming flag
    expect(events.find(e => e.slug === 'event-today')?.isUpcoming).toBe(true);
    expect(events.find(e => e.slug === 'event-future')?.isUpcoming).toBe(true);
    expect(events.find(e => e.slug === 'event-another-future')?.isUpcoming).toBe(true);
    expect(events.find(e => e.slug === 'event-past')?.isUpcoming).toBe(false);
    expect(events.find(e => e.slug === 'event-another-past')?.isUpcoming).toBe(false);

    // Check sorting: upcoming (sorted by date asc), then past (sorted by date desc)
    const expectedSlugOrder = ['event-today', 'event-future', 'event-another-future', 'event-past', 'event-another-past'];
    events.forEach((event, index) => {
      expect(event.slug).toBe(expectedSlugOrder[index]);
    });
  });

  test('should handle an empty list of events', async () => {
    // Mock markdown helper
    (mockedMarkdown.getAllMarkdownSlugs as jest.Mock).mockReturnValue([]);
    const events = await getAllEvents();
    expect(events).toEqual([]);
  });

  test('should handle files that fail to parse by skipping them', async () => {
    // Mock markdown helper
    (mockedMarkdown.getAllMarkdownSlugs as jest.Mock).mockReturnValue(['good-event', 'bad-event']);
    
    // Mock fs.readFileSync to return content for good-event and throw for bad-event
    mockedFs.readFileSync.mockImplementation((filePath: fs.PathOrFileDescriptor, options?: any): string => {
      if (typeof filePath !== 'string') {
        throw new Error('File descriptor not supported in mock');
      }
      const fileName = path.basename(filePath, '.md');
      if (fileName === 'good-event') {
        return mockEventFileContent('Good Event', getDateString(), { location: 'Venue', description: 'Desc'});
      }
      throw new Error('File read error');
    });
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const events = await getAllEvents();
    expect(events).toHaveLength(1);
    expect(events[0].slug).toBe('good-event');
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    
    consoleErrorSpy.mockRestore();
  });
}); 