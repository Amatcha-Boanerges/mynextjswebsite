import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'src/content'); // Base directory for markdown files

export interface MarkdownDocument<TFrontMatter extends Record<string, any> = Record<string, any>> {
  slug: string;
  frontMatter: TFrontMatter;
  htmlContent: string;
}

export async function getMarkdownBySlug<TFrontMatter extends Record<string, any>>(
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
    // console.error(`Error reading markdown file: ${fullPath}`, err);
    throw new Error(`Markdown file not found or unreadable: ${fullPath}. Error: ${(err as Error).message}`);
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
    frontMatter: matterResult.data as TFrontMatter,
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