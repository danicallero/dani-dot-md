import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Social share images (1200x630), drawn at build time with the same vocabulary
 * as the site: paper white, hairline rules, tracked small caps, the 3:2 picture
 * frame from the lists, boxed tags. Inter stands in for Helvetica, which can't
 * be embedded.
 *
 * Two layouts:
 * - with a picture: the picture in its 3:2 frame on the left, with its tags
 *   underneath, and the title on the right;
 * - without one: a big title and a line of description.
 */

export interface OgCard {
  /** Small tracked label top left, e.g. "Blog". */
  kicker: string;
  title: string;
  /** Longer line under the title. */
  subtitle?: string;
  /** Top right: a date or a year. */
  meta?: string;
  /** Path under /public of the picture shown in the frame. */
  image?: string;
  /** Boxed tags under the picture. */
  tags?: string[];
  /** Shown bottom right, e.g. "dani.md/projects/fasttrack". */
  url?: string;
}

const W = 1200;
const H = 630;
const PAD_X = 64;
const GAP = 56;
const FRAME_W = 470;
const FRAME_H = Math.round((FRAME_W * 2) / 3); // the 3:2 ratio of the list thumbnails
const INK = '#111111';
const GREY = '#6e6e6e';
const LINE = '#e4e4e4';
const CHIP = '#d4d4d4';

type Style = Record<string, string | number>;
type El = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Style, children?: unknown, props: Record<string, unknown> = {}): El => ({
  type,
  props: { style, children, ...props },
});

let fonts: { name: string; data: Buffer; weight: 400 | 500 | 700; style: 'normal' }[] | undefined;
async function loadFonts() {
  if (fonts) return fonts;
  const dir = join(process.cwd(), 'node_modules/@fontsource/inter/files');
  const weights = [400, 500, 700] as const;
  fonts = await Promise.all(
    weights.map(async (weight) => ({
      name: 'Inter',
      data: await readFile(join(dir, `inter-latin-${weight}-normal.woff`)),
      weight,
      style: 'normal' as const,
    })),
  );
  return fonts;
}

/** Crops the picture to its frame, in grey like the site's thumbnails, as a JPEG data URI (satori can't read WebP). */
async function picture(src: string, width: number, height: number) {
  const buf = await sharp(join(process.cwd(), 'public', src))
    .resize(width, height, { fit: 'cover', position: 'attention' })
    .grayscale()
    .jpeg({ quality: 88 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

/** Bigger titles for short text, smaller for long, so it always fits. */
function titleSize(text: string, narrow: boolean) {
  const n = text.length;
  if (narrow) return n <= 20 ? 72 : n <= 34 ? 58 : n <= 52 ? 48 : n <= 80 ? 40 : n <= 110 ? 34 : 30;
  return n <= 24 ? 96 : n <= 44 ? 80 : n <= 70 ? 64 : n <= 100 ? 54 : 46;
}

const wordmark = () =>
  el('div', { display: 'flex', fontSize: 30, letterSpacing: '0.01em' }, [
    el('span', { fontWeight: 700 }, 'dani'),
    el('span', { fontWeight: 400, color: GREY }, '.md'),
  ]);

const chip = (text: string) =>
  el(
    'div',
    {
      display: 'flex',
      padding: '6px 11px',
      border: `1px solid ${CHIP}`,
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    text,
  );

/** Small "+" registration marks at the corners of the frame: a drawing-board detail. */
const cornerMarks = () =>
  (
    [
      { top: -17, left: -17 },
      { top: -17, right: -17 },
      { bottom: -17, left: -17 },
      { bottom: -17, right: -17 },
    ] as Style[]
  ).map((pos) => el('div', { display: 'flex', position: 'absolute', fontSize: 16, lineHeight: 1, color: '#b3b3b3', ...pos }, '+'));

function frame(content: El[]) {
  return el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      width: W,
      height: H,
      padding: '46px 64px 42px',
      boxSizing: 'border-box',
      background: '#ffffff',
      fontFamily: 'Inter',
      color: INK,
    },
    content,
  );
}

export async function renderOg(card: OgCard): Promise<Buffer> {
  const withPicture = Boolean(card.image);

  const top = el(
    'div',
    {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 18,
      borderBottom: `1px solid ${INK}`,
      fontSize: 20,
      fontWeight: 500,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: GREY,
    },
    [el('div', { display: 'flex' }, card.kicker), card.meta ? el('div', { display: 'flex' }, card.meta) : null].filter(Boolean),
  );

  const bottom = el(
    'div',
    {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `1px solid ${LINE}`,
      paddingTop: 20,
    },
    [wordmark(), card.url ? el('div', { display: 'flex', fontSize: 20, color: GREY }, card.url) : null].filter(Boolean),
  );

  let main: El;
  if (withPicture) {
    const left = el('div', { display: 'flex', flexDirection: 'column', width: FRAME_W }, [
      el('div', { display: 'flex', position: 'relative', width: FRAME_W, height: FRAME_H }, [
        el('img', { width: FRAME_W, height: FRAME_H, border: `1px solid ${LINE}`, objectFit: 'cover' }, undefined, {
          src: await picture(card.image!, FRAME_W * 2, FRAME_H * 2),
          width: FRAME_W,
          height: FRAME_H,
        }),
        ...cornerMarks(),
      ]),
      card.tags && card.tags.length
        ? el('div', { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }, card.tags.slice(0, 5).map(chip))
        : null,
    ].filter(Boolean));

    const rightWidth = W - PAD_X * 2 - FRAME_W - GAP;
    const showSubtitle = Boolean(card.subtitle) && (card.title.length <= 60 || (card.subtitle?.length ?? 0) <= 40);
    const right = el('div', { display: 'flex', flexDirection: 'column', width: rightWidth, justifyContent: 'center' }, [
      el(
        'div',
        {
          display: 'flex',
          fontSize: titleSize(card.title, true),
          fontWeight: 500,
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          lineClamp: 5,
        },
        card.title,
      ),
      showSubtitle
        ? el('div', { display: 'flex', marginTop: 22, fontSize: 21, lineHeight: 1.4, color: GREY, lineClamp: 3 }, card.subtitle)
        : null,
    ].filter(Boolean));

    main = el('div', { display: 'flex', flex: 1, alignItems: 'center', gap: GAP, minHeight: 0 }, [left, right]);
  } else {
    main = el('div', { display: 'flex', flex: 1, alignItems: 'center', minHeight: 0 }, [
      el('div', { display: 'flex', flexDirection: 'column', width: W - PAD_X * 2, justifyContent: 'center' }, [
        el(
          'div',
          {
            display: 'flex',
            fontSize: titleSize(card.title, false),
            fontWeight: 500,
            lineHeight: 1.06,
            letterSpacing: '-0.025em',
            lineClamp: 4,
          },
          card.title,
        ),
        card.subtitle
          ? el('div', { display: 'flex', marginTop: 30, fontSize: 28, lineHeight: 1.4, color: GREY, maxWidth: 820, lineClamp: 3 }, card.subtitle)
          : null,
      ].filter(Boolean)),
    ]);
  }

  const tree = frame([top, main, bottom]);
  const svg = await satori(tree as never, { width: W, height: H, fonts: await loadFonts() });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
