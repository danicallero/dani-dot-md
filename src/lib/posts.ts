import { getCollection } from 'astro:content';

/**
 * Published posts. A post with `draft: true` shows up under `astro dev` so it can be
 * previewed, and is left out of every build: the pages, the list, the RSS feed and
 * the share image.
 */
export const publishedPosts = () => getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
