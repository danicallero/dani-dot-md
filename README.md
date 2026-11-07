# dani.md

Personal site of Daniel Callero Costales: portfolio, projects and blog.
Astro, plain CSS, no client framework.

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build
pnpm preview
```

## Where things live

| What | Where |
| --- | --- |
| Projects (and their media gallery) | `src/data/projects.ts`, media in `public/projects/<slug>/media/` |
| Blog posts | `src/content/blog/*.mdx`, media in `public/blog/<slug>/media/` |
| Name, nav, links, email | `src/data/site.ts` |
| Design tokens and all styles | `src/styles/global.css` |

Pushing to `main` deploys to GitHub Pages (`.github/workflows/deploy-pages.yml`); the domain is set by `public/CNAME`.
