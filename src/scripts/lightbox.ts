export interface LightboxItem {
  type: string;
  src: string;
  caption?: string;
  width?: number;
  height?: number;
}

/** The page element a viewer item came from, so the image can travel to and from it. */
type SourceOf = (index: number) => HTMLElement | null | undefined;

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const onScreen = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
};

/** Gives an element the shared transition name and returns a function that puts back what was there. */
const tag = (el: HTMLElement) => {
  const name = el.style.viewTransitionName;
  const cls = el.style.getPropertyValue('view-transition-class');
  el.style.viewTransitionName = 'lb-media';
  el.style.setProperty('view-transition-class', 'entry');
  return () => {
    el.style.viewTransitionName = name;
    if (cls) el.style.setProperty('view-transition-class', cls);
    else el.style.removeProperty('view-transition-class');
  };
};

/**
 * Elements named for page-to-page transitions (the strip's first image, list thumbnails,
 * the portrait) would be lifted out of the page and painted above the viewer for the whole
 * animation. Switch their names off while it runs; the returned function puts them back.
 */
const quiet = () => {
  const named = Array.from(document.querySelectorAll<HTMLElement>('[style*="view-transition-name"]')).map((el) => ({
    el,
    name: el.style.viewTransitionName,
  }));
  named.forEach(({ el }) => (el.style.viewTransitionName = 'none'));
  return () => named.forEach(({ el, name }) => (el.style.viewTransitionName = name));
};

/**
 * Wires a <LightboxDialog> to a list of items and returns a handle to open it
 * at a given position. Shared by the per-gallery viewer and the article-wide one.
 *
 * Opening and closing use a same-document view transition: the image you
 * clicked grows into the viewer and shrinks back to its place. Where that isn't
 * possible (no support, reduced motion, source scrolled out of view) it just
 * opens and closes.
 */
export function setupLightbox(dialog: HTMLDialogElement, items: LightboxItem[], sourceOf?: SourceOf) {
  const stage = dialog.querySelector<HTMLElement>('[data-stage]')!;
  const counter = dialog.querySelector<HTMLElement>('[data-counter]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-caption]')!;
  let index = 0;
  let natural: { w: number; h: number } | null = null;

  const media = () => stage.querySelector<HTMLImageElement | HTMLVideoElement>('img, video');

  // Size the picture to the stage: as large as fits, never stretched. Its box is then
  // exactly the picture, which is what lets the transition morph cleanly.
  const fit = () => {
    const el = media();
    if (!el) return;
    if (!natural) {
      el.style.width = '100%';
      el.style.height = '100%';
      return;
    }
    const scale = Math.min(stage.clientWidth / natural.w, stage.clientHeight / natural.h);
    el.style.width = `${Math.round(natural.w * scale)}px`;
    el.style.height = `${Math.round(natural.h * scale)}px`;
  };

  const show = (i: number) => {
    index = (i + items.length) % items.length;
    const item = items[index];
    stage.querySelector('img, video')?.remove();
    const el = document.createElement(item.type === 'video' ? 'video' : 'img') as HTMLImageElement | HTMLVideoElement;
    el.src = item.src;

    // Dimensions: from the data, else from the element on the page, else once the file loads.
    const source = sourceOf?.(index);
    const w = item.width || (source instanceof HTMLImageElement ? source.naturalWidth : source instanceof HTMLVideoElement ? source.videoWidth : 0);
    const h = item.height || (source instanceof HTMLImageElement ? source.naturalHeight : source instanceof HTMLVideoElement ? source.videoHeight : 0);
    natural = w && h ? { w, h } : null;

    if (el instanceof HTMLVideoElement) {
      el.controls = true;
      el.autoplay = true;
      el.muted = true;
      el.playsInline = true;
      el.addEventListener('loadedmetadata', () => {
        if (el.videoWidth) natural = { w: el.videoWidth, h: el.videoHeight };
        fit();
      });
    } else {
      el.alt = item.caption ?? '';
      el.addEventListener('load', () => {
        natural = { w: el.naturalWidth, h: el.naturalHeight };
        fit();
      });
    }
    stage.prepend(el);
    fit();
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    caption.textContent = item.caption ?? '';
  };

  const single = items.length < 2;
  dialog.querySelectorAll<HTMLElement>('[data-prev], [data-next]').forEach((b) => (b.hidden = single));

  const reveal = (i: number) => {
    // showModal() focuses the first button (Close), which draws a focus ring on open.
    // Park focus on the dialog instead; Tab still reaches the buttons with a visible ring.
    dialog.showModal();
    show(i);
    dialog.focus({ preventScroll: true });
  };

  const run = (update: () => void, cleanup: () => void) => {
    const root = document.documentElement;
    root.dataset.vt = 'viewer';
    const t = document.startViewTransition(update);
    t.finished.finally(() => {
      delete root.dataset.vt;
      cleanup();
    });
  };

  const open = (i: number) => {
    const source = sourceOf?.(i);
    if (!document.startViewTransition || reducedMotion() || !source || !onScreen(source)) {
      reveal(i);
      return;
    }
    let tagged: (() => void) | undefined;
    const unquiet = quiet();
    const restoreSource = tag(source);
    run(
      () => {
        restoreSource();
        reveal(i);
        const m = media();
        if (m) tagged = tag(m);
      },
      () => {
        tagged?.();
        unquiet();
      },
    );
  };

  const close = () => {
    if (!dialog.open) return;
    const source = sourceOf?.(index);
    const m = media();
    if (!document.startViewTransition || reducedMotion() || !source || !m || !onScreen(source)) {
      dialog.close();
      return;
    }
    const unquiet = quiet();
    const restoreMedia = tag(m);
    let restoreSource: (() => void) | undefined;
    run(
      () => {
        restoreMedia();
        dialog.close();
        restoreSource = tag(source);
      },
      () => {
        restoreSource?.();
        unquiet();
      },
    );
  };

  dialog.querySelector('[data-prev]')!.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-next]')!.addEventListener('click', () => show(index + 1));
  dialog.querySelector('[data-close]')!.addEventListener('click', close);
  dialog.addEventListener('close', () => stage.querySelector('video')?.pause());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  // Escape goes through the same path, so it animates too.
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (single) return;
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  window.addEventListener('resize', () => dialog.open && fit());

  return { open };
}
