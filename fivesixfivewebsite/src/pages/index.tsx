import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
// import Header from "@/components/Header"; // Removed direct Header import
// import Layout from "@/components/Layout"; // Layout is now applied globally via _app.tsx
import CTAButton from "@/components/CTAButton"; // Added CTAButton import
import { getMarkdownBySlug, MarkdownDocument } from "@/lib/markdown"; // Import our markdown helper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface HomeFrontMatter {
  title: string;
  tagline: string;
}

export const getStaticProps: GetStaticProps<{
  homeContent: MarkdownDocument<HomeFrontMatter>;
}> = async () => {
  const homeContent = await getMarkdownBySlug<HomeFrontMatter>('home'); // No directory needed if home.md is at src/content/home.md
  return {
    props: {
      homeContent,
    },
  };
};

export default function Home({ homeContent }: InferGetStaticPropsType<typeof getStaticProps>) {
  // Layout is now applied globally via _app.tsx, so we don't wrap it here again.
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} prose dark:prose-invert max-w-none p-8 sm:p-0`}
    >
      <h1 className="text-3xl font-bold mb-2">{homeContent.frontMatter.title}</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{homeContent.frontMatter.tagline}</p>
      
      {/* Render the markdown content */}
      <div dangerouslySetInnerHTML={{ __html: homeContent.htmlContent }} />

      {/* Retain CTA buttons or other static content if desired */}
      <div className="mt-8 flex gap-4 items-center flex-col sm:flex-row not-prose"> {/* Added not-prose to exclude from prose styling*/}
        <CTAButton
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          label="Deploy now"
          variant="primary"
          className="sm:w-auto"
        >
          <Image
            className="dark:invert"
            src="/vercel.svg"
            alt="Vercel logomark"
            width={20}
            height={20}
          />
        </CTAButton>
        <CTAButton
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          label="Read our docs"
          variant="secondary"
          className="w-full sm:w-auto md:w-[158px]"
        />
      </div>
      {/* Footer is now part of Layout */}
    </div>
  );
}
