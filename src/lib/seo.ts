import { site } from '../data/site';

/** Trims a description to a length search engines and chat apps show, ending on a word. */
export const clamp = (text: string, max = 160) => {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/[\s,;:.\-–—]+\S*$/, '') + '…';
};

/** The key a page's share image is generated under: "/" is "index", "/blog/x/" is "blog/x". */
export const ogKey = (pathname: string) => pathname.replace(/^\/+|\/+$/g, '') || 'index';

/** Absolute URL of the share image generated for a page key (see src/pages/og). */
export const ogUrl = (key: string) => new URL(`/og/${key}.png`, site.url).href;

/** schema.org breadcrumb trail. The last item is the current page. */
export const breadcrumbs = (trail: [name: string, path: string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: new URL(path, site.url).href,
  })),
});
