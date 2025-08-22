// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
  site: 'https://trodrigueza.github.io',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] })],
});