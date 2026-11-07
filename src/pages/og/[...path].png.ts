import type { APIRoute, GetStaticPaths } from 'astro';
import { publishedPosts } from '../../lib/posts';
import { shortDate } from '../../lib/dates';
import { projects, coverOf } from '../../data/projects';
import { site } from '../../data/site';
import { renderOg, type OgCard } from '../../lib/og';

// One share image per page, generated at build time and served from /og/<page>.png.
// BaseLayout points each page at its own; add a page here and it gets a card.
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await publishedPosts();
  const day = shortDate;
  const at = (path: string) => `${site.domain}${path}`;
  // "Title: subtitle" reads better as a big title with the second half underneath.
  const split = (title: string, fallback?: string) => {
    const i = title.indexOf(': ');
    if (title.length <= 56 || i < 0) return { title, subtitle: fallback };
    const tail = title.slice(i + 2);
    return { title: title.slice(0, i), subtitle: tail.charAt(0).toUpperCase() + tail.slice(1) };
  };
  const firstStill = (gallery?: { type: string; src: string; caption?: string }[]) => gallery?.find((g) => g.type === 'image');

  const cards: Record<string, OgCard> = {
    index: { kicker: site.location, title: site.name, subtitle: site.description, url: site.domain },
    about: { kicker: 'About', title: site.name, subtitle: `${site.role} in ${site.location}.`, url: at('/about') },
    projects: { kicker: 'Projects', title: 'Projects', subtitle: "Software I've written, mostly for HackUDC.", url: at('/projects') },
    blog: { kicker: 'Blog', title: 'Blog', subtitle: 'Notes on events and software.', url: at('/blog') },
  };

  for (const p of projects) {
    cards[`projects/${p.slug}`] = {
      kicker: 'Project',
      meta: String(p.year),
      title: p.title,
      subtitle: p.description,
      image: coverOf(p),
      tags: p.tags,
      url: at(`/projects/${p.slug}`),
    };
  }

  for (const post of posts) {
    const still = firstStill(post.data.gallery);
    cards[`blog/${post.id}`] = {
      kicker: 'Blog',
      meta: day(post.data.date),
      ...split(post.data.title, post.data.description),
      image: still?.src,
      tags: post.data.tags,
      url: at(`/blog/${post.id}`),
    };
  }

  return Object.entries(cards).map(([path, card]) => ({ params: { path }, props: { card } }));
};

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderOg(props.card as OgCard), {
    headers: { 'Content-Type': 'image/png' },
  });
