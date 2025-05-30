import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAllMarkdownSlugs } from './markdown'; // Re-use from existing markdown helper

const EVENTS_DIRECTORY = 'events'; // Relative to the main contentDirectory in markdown.ts

export interface EventFrontMatter {
  title: string;
  date: string; // Expecting YYYY-MM-DD
  location: string;
  description: string;
  category?: string;
  // Add other event-specific fields here if needed
}

export interface Event extends EventFrontMatter {
  slug: string;
  isUpcoming: boolean;
  // htmlContent?: string; // Add if full event content rendering is needed later
}

/**
 * Loads, parses, sorts, and processes all event markdown files.
 */
export async function getAllEvents(): Promise<Event[]> {
  try {
    const slugs = getAllMarkdownSlugs('events');
    const events: Event[] = [];

    for (const slug of slugs) {
      try {
        const filePath = path.join(process.cwd(), 'src', 'content', 'events', `${slug}.md`);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        
        // Convert dates to UTC midnight for comparison
        const eventDate = new Date(data.date);
        const eventDateUTC = new Date(Date.UTC(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()));
        const nowDate = new Date();
        const nowDateUTC = new Date(Date.UTC(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()));
        
        const event: Event = {
          slug,
          title: data.title,
          date: data.date,
          location: data.location,
          description: data.description,
          isUpcoming: eventDateUTC >= nowDateUTC
        };
        
        events.push(event);
      } catch (error) {
        console.error(`Error processing event file for slug ${slug}:`, error);
      }
    }

    // Sort events: upcoming first (ascending by date), then past (descending by date)
    return events.sort((a, b) => {
      if (a.isUpcoming === b.isUpcoming) {
        // For same category (upcoming/past), sort by date
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return a.isUpcoming ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      // Different categories: upcoming first
      return a.isUpcoming ? -1 : 1;
    });
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
} 