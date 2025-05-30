import { getMarkdownBySlug } from './markdown';
import fs from 'fs';
// import { remark } from 'remark'; // Import the actual 'remark' - Removed as unused
// import remarkHtml from 'remark-html'; // Import the actual 'remark-html' - Removed as unused

// Mock the fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

// Mock 'remark' and 'remark-html'
// These will be type-cast to Jest's mock types later where needed.
const mockProcess = jest.fn(async (markdown: string) => ({ toString: () => `<mocked_html>${markdown}</mocked_html>` }));
const mockUse = jest.fn().mockReturnValue({ process: mockProcess });
const mockRemarkConstructor = jest.fn().mockReturnValue({ use: mockUse });

jest.mock('remark', () => ({
  __esModule: true,
  remark: mockRemarkConstructor,
}));

const mockRemarkHtmlPlugin = jest.fn(() => 'mocked-html-plugin');
jest.mock('remark-html', () => ({
  __esModule: true,
  default: mockRemarkHtmlPlugin,
}));


interface TestFrontMatter {
  title: string;
  tagline: string;
  author?: string;
}

describe('getMarkdownBySlug', () => {
  const mockRawContent = `
# Main Heading

Some *italic* and **bold** text.

A list:
- Item 1
- Item 2
  `.trim();

  const mockMarkdownContent = `---
title: "Test Title from Markdown"
tagline: "This is a test tagline."
author: "Test Author"
---
${mockRawContent}`;

  beforeEach(() => {
    mockedFs.readFileSync.mockReset();
    
    // Clear all mocks
    mockRemarkConstructor.mockClear();
    mockUse.mockClear();
    mockProcess.mockClear();
    mockRemarkHtmlPlugin.mockClear();

    // Reset default implementations if they were changed in a test (optional here as we re-declare them above)
    // mockProcess.mockImplementation(async (markdown: string) => ({ toString: () => `<mocked_html>${markdown}</mocked_html>` }));
  });

  it('should correctly parse front-matter and use mocked HTML conversion', async () => {
    mockedFs.readFileSync.mockReturnValue(mockMarkdownContent);

    const slug = 'test-slug';
    const result = await getMarkdownBySlug<TestFrontMatter>(slug);

    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`src[\\\\/]content[\\\\/]${slug}\\.md$`)), 
      'utf8'
    );

    expect(result.frontMatter.title).toBe('Test Title from Markdown');
    expect(result.frontMatter.tagline).toBe('This is a test tagline.');
    expect(result.frontMatter.author).toBe('Test Author');

    // Assert that the mock constructor for remark was called
    expect(mockRemarkConstructor).toHaveBeenCalledTimes(1);
    
    // Assert that .use() was called on the remark instance
    expect(mockUse).toHaveBeenCalledTimes(1);
    // Assert that .use() was called with the remark-html plugin mock
    expect(mockUse).toHaveBeenCalledWith(mockRemarkHtmlPlugin);
    
    // Assert that .process() was called on the use instance
    expect(mockProcess).toHaveBeenCalledTimes(1);
    expect(mockProcess).toHaveBeenCalledWith(mockRawContent);
    
    expect(result.htmlContent).toBe(`<mocked_html>${mockRawContent}</mocked_html>`);
    expect(result.slug).toBe(slug);
  });

  it('should remove .md extension from slug if provided', async () => {
    mockedFs.readFileSync.mockReturnValue(mockMarkdownContent);
    const result = await getMarkdownBySlug<TestFrontMatter>('test-slug.md');
    expect(result.slug).toBe('test-slug');
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/src[\\\\/]content[\\\\/]test-slug\\.md$/),
      'utf8'
    );
    // Check that remark processing was initiated
    expect(mockRemarkConstructor).toHaveBeenCalledTimes(1);
  });

  it('should use the directory parameter to build the path', async () => {
    mockedFs.readFileSync.mockReturnValue(mockMarkdownContent);
    const slug = 'another-slug';
    const directory = 'posts';
    await getMarkdownBySlug<TestFrontMatter>(slug, directory);

    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`src[\\\\/]content[\\\\/]${directory}[\\\\/]${slug}\\.md$`)),
      'utf8'
    );
    expect(mockRemarkConstructor).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the file is not found or unreadable', async () => {
    mockedFs.readFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });
    await expect(getMarkdownBySlug('non-existent-slug')).rejects.toThrow(
      /^Markdown file not found or unreadable: .*src[\\\/]content[\\\/]non-existent-slug\\.md\\. Error: File not found$/
    );
  });
}); 