// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { rehypeCodeBlock } from './rehype-code-block.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://trodrigueza.github.io',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx({ 
    remarkPlugins: [remarkMath], 
    rehypePlugins: [rehypeKatex, rehypeCodeBlock],
    shikiConfig: {
      themes: {
        light: 'catppuccin-latte',
        dark: 'github-dark-dimmed',
      },
      wrap: true,
    },
  })],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
    rehypePlugins: [rehypeCodeBlock],
  },
});