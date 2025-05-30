import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
// import Header from '@/components/Header'; // REMOVED: Header is now handled by the global Layout component

interface AboutPageProps {
  contentHtml: string;
  title: string;
}

const AboutPage: NextPage<AboutPageProps> = ({ contentHtml, title }) => {
  return (
    <>
      <Head>
        <title>{title} - My Company</title>
      </Head>
      {/* <Header /> REMOVED: Header is now handled by the global Layout component */}
      <main className="container mx-auto px-4 py-8">
        <article className="prose lg:prose-xl">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const markdownFilePath = path.join(process.cwd(), 'src/content/about.md');
  const fileContents = fs.readFileSync(markdownFilePath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // For now, let's use the H1 from the markdown as the title, or a default.
  // A more robust solution might parse the first H1 or use frontmatter.
  const firstH1Match = matterResult.content.match(/^#\s+(.*)/m);
  const title = firstH1Match ? firstH1Match[1] : 'About Us';

  return {
    props: {
      contentHtml,
      title,
    },
  };
};

export default AboutPage; 