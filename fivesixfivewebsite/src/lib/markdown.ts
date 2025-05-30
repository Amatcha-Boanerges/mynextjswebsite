import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'src/content'); // Base directory for markdown files

// Use `unknown` for a more type-safe default if the exact shape of front-matter is not known
// Callers can provide a specific type for TFrontMatter for better type checking.
export interface MarkdownDocument<TFrontMatter = Record<string, unknown>> {
  slug: string;
  frontMatter: TFrontMatter;
  htmlContent: string;
}

export async function getMarkdownBySlug<TFrontMatter = Record<string, unknown>>(
  slug: string,
  directory: string = '' // Optional subdirectory within contentDirectory
): Promise<MarkdownDocument<TFrontMatter>> {
  const fullSlug = slug.replace(/\.md$/, ''); // remove .md extension
  const directoryPath = path.join(contentDirectory, directory);
  const fullPath = path.join(directoryPath, `${fullSlug}.md`);

  if (!fs.existsSync(directoryPath)) {
    // Create directory if it doesn't exist (e.g., for initial content creation)
    // This is more relevant for a CMS-like setup, but good for robustness.
    // For SSG, files are typically pre-existing.
    // fs.mkdirSync(directoryPath, { recursive: true });
    // For now, we'll assume the directory for content will be created manually or by another process.
  }

  let fileContents;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    // It's good practice to type the error object if you access its properties
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Markdown file not found or unreadable: ${fullPath}. Error: ${message}`);
  }

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const htmlContent = processedContent.toString();

  return {
    slug: fullSlug,
    frontMatter: matterResult.data as TFrontMatter, // Type assertion here is okay as we expect the caller to know the shape or handle `unknown`
    htmlContent,
  };
}

// Example of a function to get all slugs (might be useful later)
/*
export function getAllMarkdownSlugs(directory: string = ''): string[] {
  const directoryPath = path.join(contentDirectory, directory);
  if (!fs.existsSync(directoryPath)) {
    return [];
  }
  const fileNames = fs.readdirSync(directoryPath);
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ''));
}
*/

export function getAllMarkdownSlugs(directory: string = ''): string[] {
  const directoryPath = path.join(contentDirectory, directory);
  if (!fs.existsSync(directoryPath)) {
    console.warn(`Directory not found: ${directoryPath}`);
    return [];
  }
  try {
    const fileNames = fs.readdirSync(directoryPath);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}:`, error);
    return [];
  }
}

export interface SimpleMarkdownDocument<TFrontMatter = Record<string, unknown>> {
  slug: string;
  frontMatter: TFrontMatter;
}

export function getAllMarkdownDocumentsInDirectory<TFrontMatter = Record<string, unknown>>(
  directory: string = ''
): SimpleMarkdownDocument<TFrontMatter>[] {
  const slugs = getAllMarkdownSlugs(directory);
  return slugs
    .map((slug) => {
      const fullPath = path.join(contentDirectory, directory, `${slug}.md`);
      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        return {
          slug,
          frontMatter: data as TFrontMatter,
        };
      } catch (error) {
        // Log error for specific file and skip it
        console.error(`Error processing markdown file ${fullPath}:`, error);
        return null;
      }
    })
    .filter((doc) => doc !== null) as SimpleMarkdownDocument<TFrontMatter>[];
} 