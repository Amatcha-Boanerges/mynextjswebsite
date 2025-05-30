import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
// import Header from "@/components/Header"; // Removed direct Header import
// import Layout from "@/components/Layout"; // Layout is now applied globally via _app.tsx
import CTAButton from "@/components/CTAButton"; // Added CTAButton import
import { getMarkdownBySlug, MarkdownDocument } from "@/lib/markdown"; // Import our markdown helper
import TestimonialSlider from "@/components/TestimonialSlider"; // Import the slider
import fs from 'fs'; // For reading JSON file
import path from 'path'; // For constructing path to JSON file

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

// Define the Testimonial type (can be moved to a shared types file later)
interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  avatarUrl?: string;
}

export const getStaticProps: GetStaticProps<{
  homeContent: MarkdownDocument<HomeFrontMatter>;
  testimonials: Testimonial[];
}> = async () => {
  const homeContent = await getMarkdownBySlug<HomeFrontMatter>('home'); // No directory needed if home.md is at src/content/home.md
  
  // Read testimonials data
  const testimonialsFilePath = path.join(process.cwd(), 'src/content/testimonials.json');
  let testimonials: Testimonial[] = [];
  try {
    const jsonText = fs.readFileSync(testimonialsFilePath, 'utf8');
    testimonials = JSON.parse(jsonText);
  } catch (error) {
    console.error("Failed to load testimonials data:", error); // Log error if file is missing or corrupt
  }

  return {
    props: {
      homeContent,
      testimonials,
    },
  };
};

export default function Home({ homeContent, testimonials }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className={`${geistSans.className} ${geistMono.className}`}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              {homeContent.frontMatter.title}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {homeContent.frontMatter.tagline}
            </p>
            <div className="flex gap-4 justify-center">
              <CTAButton
                href="/contact"
                label="Get Started"
                variant="primary"
                className="px-8 py-3 text-lg"
              />
              <CTAButton
                href="/services"
                label="Our Services"
                variant="secondary"
                className="px-8 py-3 text-lg"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: homeContent.htmlContent }} />
        </div>

        {/* Services Section */}
        <section className="my-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Personal Development</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tailored coaching programs designed to help you achieve your personal best and reach new heights.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Leadership Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive leadership development programs to cultivate strong, effective leaders.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Cultural Strategy</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Strategic approaches to building resilient and adaptive organizational cultures.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {testimonials && testimonials.length > 0 && (
          <section className="my-20 bg-gray-50 dark:bg-gray-900 py-16 rounded-2xl">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
              <TestimonialSlider testimonials={testimonials} />
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="my-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Take the first step towards your personal and organizational growth.
          </p>
          <CTAButton
            href="/contact"
            label="Contact Us Today"
            variant="primary"
            className="px-8 py-3 text-lg"
          />
        </section>
      </div>
    </div>
  );
}
