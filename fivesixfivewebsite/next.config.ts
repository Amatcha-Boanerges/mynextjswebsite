import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: [
    'remark',
    'remark-parse',
    'remark-html',
    'unified',
    'unist-util-visit',
    'vfile',
    'micromark',
    'micromark-util-chunked',
    'micromark-util-combine-extensions',
    'character-entities',
    'decode-named-character-reference',
    'mdast-util-from-markdown',
    'mdast-util-to-string',
    // Add other problematic ESM packages here if needed
  ],
};

export default nextConfig;
