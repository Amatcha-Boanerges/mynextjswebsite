import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
// import Header from "@/components/Header"; // Removed direct Header import
import Layout from "@/components/Layout"; // Added Layout import
import CTAButton from "@/components/CTAButton"; // Added CTAButton import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <Layout>
      {/* The main div and existing Header removed, Layout handles structure */}
      {/* The old main's className is mostly handled by Layout, specific styling might need adjustment if any */}
      <div
        className={`${geistSans.className} ${geistMono.className} flex flex-col gap-[32px] items-center sm:items-start font-[family-name:var(--font-geist-sans)] p-8 sm:p-0`}
      >
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <p className="text-red-500">This text should be red if Tailwind is working.</p>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/pages/index.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <CTAButton
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
            label="Deploy now"
            variant="primary"
            className="sm:w-auto" // Retain specific width adjustments if needed
          >
            {/* Vercel Icon as children */}
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
            className="w-full sm:w-auto md:w-[158px]" // Retain specific width adjustments
          />
        </div>
        {/* Footer is now part of Layout */}
      </div>
    </Layout>
  );
}
