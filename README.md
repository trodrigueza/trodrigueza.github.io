# My Personal Astro Blog

This was built over the Minimal Astro site with Tailwind v4 + MDX + KaTeX, deployed to GitHub Pages.

What I really like: it's very simple to publish posts. Drop a Markdown/MDX file in `src/pages/posts/` and it just shows up on `/blog` with tags, dates, images, and math.

*Note: Blog section is currently without content but you can check out `dev` branch for examples.*

---

## Quickstart

```bash
# install
npm install

# (if you see a typography plugin error, also run:)
npm i -D @tailwindcss/typography

# dev
npm run dev

# build and preview
npm run build
npm run preview
```

Deployed via GitHub Actions to GitHub Pages (workflow already included).

---

## Project Layout

```
/
├─ public/                     # static files 
│  └─ posts/...                # images per post 
├─ src/
│  ├─ components/              # UI bits (Posts list, Header, etc.)
│  ├─ layouts/                 # site and post layouts
│  ├─ pages/
│  │  ├─ index.astro           # homepage
│  │  ├─ blog.astro            # blog index (lists posts)
│  │  └─ posts/                # posts live here (see dev branch for this examples)
│  │     ├─ trip-to-pasto.mdx
│  │     ├─ run-mmb.mdx
│  │     └─ cp-internal-marathon.mdx
│  └─ styles/global.css
├─ astro.config.mjs            # MDX + math (remark/rehype) + Tailwind (Vite)
├─ tailwind.config.mjs         # includes typography plugin
└─ .github/workflows/deploy.yml
```

---

## Writing Posts

Create a file in `src/pages/posts/` and it becomes a route at `/posts/<filename>`. The blog index at `/blog` auto-discovers posts and sorts them by `pubDate`.

### 1) Create a new post

Create `src/pages/posts/my-new-post.mdx`:

```mdx
---
title: "My New Post"
description: "One-liner for the card."
pubDate: 2025-08-20
tags: ["note", "astro"]
image:
  url: "/posts/my-new-post/cover.webp"
  alt: "Cover image"
layout: "../../layouts/PostLayout.astro"
---

# {frontmatter.title}

Some intro text.

Inline math like $e^{i\pi}+1=0$ or display:

$$
\nabla \cdot \vec{E} = \frac{\rho}{\varepsilon_0}
$$
```

Drop any images in `public/posts/my-new-post/` and reference them as `/posts/my-new-post/…`.

### 2) Fields the list page looks for

* `title` (string) — shown on the card and detail
* `description` (string, optional) — card excerpt
* `pubDate` (date) — sorting
* `tags` (string\[]) — used for the filter bar on `/blog`
* `image.url` + `image.alt` — thumbnail on the card
* `layout` — keep `../../layouts/PostLayout.astro` for KaTeX + typography

### 3) Markdown and MDX

The project is wired for MDX (I love its customization possibility). If you prefer plain `.md` posts, change one line in `src/components/Posts.astro`:

```diff
- const modules = import.meta.glob("/src/pages/posts/*.mdx", { eager: true });
+ const modules = import.meta.glob("/src/pages/posts/*.{md,mdx}", { eager: true });
```

It gives:

* **Auto-listing + Tag filtering**
  `/blog` pulls everything from `src/pages/posts/*` via `import.meta.glob`.
  Filter by tag with the UI or using query params like `/blog?tag=running`.

* **Math :)**
  `remark-math` + `rehype-katex` are enabled in `astro.config.mjs`.
  `PostLayout.astro` includes `katex/dist/katex.min.css`. Use `$...$` or `$$...$$`.

* **Simplicity.**
---

## Deploy 

This repo already has `.github/workflows/deploy.yml`.
Push to `main` and Pages will build and deploy. If you fork/rename:

1. Set `site` in `astro.config.mjs` to your Pages URL.
2. Make sure Pages is enabled for the repo (Settings -> Pages -> Build and deployment -> GitHub Actions).

---

## Tips

* Want drafts? Add `draft: true` in frontmatter and skip them in the glob mapping.

---

## Commands

| Command           | What it does                   |
| ----------------- | ------------------------------ |
| `npm install`     | install deps                   |
| `npm run dev`     | dev server at `localhost:4321` |
| `npm run build`   | static build in `dist/`        |
| `npm run preview` | preview the production build   |

---

### Credits

Built on **Astro Starter Kit: Minimal** + **Tailwind v4** + **@astrojs/mdx**.
