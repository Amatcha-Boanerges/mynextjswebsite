import { getMarkdownBySlug } from './markdown';
import fs from 'fs';

// Mock the fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

// Mock 'remark' module. The factory function is hoisted.
// All mock function definitions used by the factory must be within it or also be hoisted (e.g. other jest.mock calls).
jest.mock('remark', () => {
  // These mock functions are scoped to this factory
  const mockProcessImplementation = jest.fn(async (markdown: string) => ({ toString: () => `<mocked_html>${markdown}</mocked_html>` }));
  const mockUseImplementation = jest.fn().mockReturnValue({ process: mockProcessImplementation });
  const mockRemarkConstructorImplementation = jest.fn().mockReturnValue({ use: mockUseImplementation });
  
  return {
    __esModule: true, 
    remark: mockRemarkConstructorImplementation, // This is the named export `remark`
    // Expose internal mocks for clearing/assertion if needed, though direct access is tricky
    _mockProcess: mockProcessImplementation, 
    _mockUse: mockUseImplementation,
  };
});

// Mock 'remark-html' module
jest.mock('remark-html', () => {
  const pluginMock = jest.fn(() => 'mocked-html-plugin');
  return {
    __esModule: true, 
    default: pluginMock, // remark-html is used as a default import
    _pluginMock: pluginMock, // Expose for clearing/assertion
  };
});

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
${mockRawContent}`; // mockRawContent is already trimmed, no .trim() on the outer template literal here.

  beforeEach(() => {
    mockedFs.readFileSync.mockReset();
    
    // Access the mocked modules to clear their internal mocks
    const remarkMock = require('remark');
    const remarkHtmlMock = require('remark-html');

    remarkMock.remark.mockClear(); // Clears the main constructor `remark()`
    // remarkMock._mockUse.mockClear(); // If we exposed them like this.
    // remarkMock._mockProcess.mockClear();
    // remarkHtmlMock._pluginMock.mockClear();

    // For chained mocks, clearing can be tricky. A pragmatic way is to ensure they are fresh by re-requiring,
    // or by navigating the .mock property IF they have been called.
    // Since the mock functions are re-created on each jest.mock factory call (which happens once per test file run),
    // clearing the top-level function (remarkMock.remark) is often enough if the chain is always fresh from there.
    // However, if a test *changes* an implementation (e.g. mockProcessImplementation.mockImplementationOnce(...)),
    // then it needs reset. Here, we reset the default implementation for process to be safe.

    // To get the actual mock functions to clear/reset them, we can re-require the mocked module.
    // The functions like `mockProcessImplementation` are internal to the factory, so we can't access them directly here.
    // Instead, we clear the top-level exported mocks. If chained mocks' state persists, this might be an issue.
    // A common pattern for complex mocks is to ensure the mock factory itself returns fresh functions on each call
    // or structure it so that top-level clears are sufficient.

    // Let's try clearing the functions exposed via the .remark property structure, if calls were made.
    // This assumes the structure mockRemarkConstructor -> mockUse -> mockProcess
    if (remarkMock.remark.mock.results.length > 0 && remarkMock.remark.mock.results[0].value) {
      const remarkInstance = remarkMock.remark.mock.results[0].value;
      if (remarkInstance.use && remarkInstance.use.mockClear) {
        remarkInstance.use.mockClear();
        if (remarkInstance.use.mock.results.length > 0 && remarkInstance.use.mock.results[0].value) {
          const useInstance = remarkInstance.use.mock.results[0].value;
          if (useInstance.process && useInstance.process.mockClear) {
            useInstance.process.mockClear();
            // Reset the default implementation for process
            useInstance.process.mockImplementation(async (markdown: string) => ({ toString: () => `<mocked_html>${markdown}</mocked_html>` }));
          }
        }
      }
    }
    // Fallback: ensure the process mock is reset if it's directly accessible (it's not with current factory structure)
    // This reset is primarily for mockProcessImplementation if its behavior changes.
    // If remarkMock._mockProcess was exposed & cleared: 
    // remarkMock._mockProcess.mockImplementation(async (markdown: string) => ({ toString: () => `<mocked_html>${markdown}</mocked_html>` }));

    if (remarkHtmlMock.default && remarkHtmlMock.default.mockClear) {
      remarkHtmlMock.default.mockClear();
    }
  });

  it('should correctly parse front-matter and use mocked HTML conversion', async () => {
    mockedFs.readFileSync.mockReturnValue(mockMarkdownContent);

    const slug = 'test-slug';
    const result = await getMarkdownBySlug<TestFrontMatter>(slug);

    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`src[\\\\/]content[\\\\/]${slug}\.md$`)), // Path ends with src/content/slug.md
      'utf8'
    );

    expect(result.frontMatter.title).toBe('Test Title from Markdown');
    expect(result.frontMatter.tagline).toBe('This is a test tagline.');
    expect(result.frontMatter.author).toBe('Test Author');

    // Access mocks via require again, as they are module-level mocks
    const currentRemarkMock = require('remark');
    const currentHtmlMock = require('remark-html');

    expect(currentRemarkMock.remark).toHaveBeenCalledTimes(1);
    
    // To check chained calls: remark() -> .use() -> .process()
    // 1. Get the mock constructor for remark()
    const remarkConstructorMock = currentRemarkMock.remark;
    // 2. Get the instance returned by the first call to remark()
    const remarkInstance = remarkConstructorMock.mock.results[0].value; // { use: mockUseImplementation }
    // 3. Get the .use mock from that instance
    const useMock = remarkInstance.use; // mockUseImplementation
    // 4. Get the instance returned by the first call to .use()
    const useInstance = useMock.mock.results[0].value; // { process: mockProcessImplementation }
    // 5. Get the .process mock from that instance
    const processMock = useInstance.process; // mockProcessImplementation

    expect(useMock).toHaveBeenCalledTimes(1);
    expect(useMock).toHaveBeenCalledWith(currentHtmlMock.default);
    expect(processMock).toHaveBeenCalledTimes(1);
    expect(processMock).toHaveBeenCalledWith(mockRawContent);
    
    expect(result.htmlContent).toBe(`<mocked_html>${mockRawContent}</mocked_html>`);
    expect(result.slug).toBe(slug);
  });

  it('should remove .md extension from slug if provided', async () => {
    mockedFs.readFileSync.mockReturnValue(mockMarkdownContent);
    const result = await getMarkdownBySlug<TestFrontMatter>('test-slug.md');
    expect(result.slug).toBe('test-slug');
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/src[\\\\/]content[\\\\/]test-slug\.md$/), // Path ends with src/content/test-slug.md
      'utf8'
    );
    // Check that remark processing was initiated
    const currentRemarkMock = require('remark');
    expect(currentRemarkMock.remark).toHaveBeenCalledTimes(1);
  });

  it('should use the directory parameter to build the path', async () => {
    mockedFs.readFileSync.mockReturnValue(mockMarkdownContent);
    const slug = 'another-slug';
    const directory = 'posts';
    await getMarkdownBySlug<TestFrontMatter>(slug, directory);

    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`src[\\\\/]content[\\\\/]${directory}[\\\\/]${slug}\.md$`)), // Path ends with src/content/dir/slug.md
      'utf8'
    );
    const currentRemarkMock = require('remark');
    expect(currentRemarkMock.remark).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the file is not found or unreadable', async () => {
    mockedFs.readFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });
    await expect(getMarkdownBySlug('non-existent-slug')).rejects.toThrow(
      /^Markdown file not found or unreadable: .*src[\\\/]content[\\\/]non-existent-slug\.md\. Error: File not found$/
    );
  });
}); 