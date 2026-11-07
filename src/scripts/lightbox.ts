export interface LightboxItem {
  type: string;
  src: string;
  caption?: string;
}

/**
 * Wires a <LightboxDialog> to a list of items and returns a handle to open it
 * at a given position. Shared by the per-gallery viewer and the article-wide one.
 */
export function setupLightbox(dialog: HTMLDialogElement, items: LightboxItem[]) {
  const stage = dialog.querySelector<HTMLElement>('[data-stage]')!;
  const counter = dialog.querySelector<HTMLElement>('[data-counter]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-caption]')!;
  let index = 0;

  const show = (i: number) => {
    index = (i + items.length) % items.length;
    const item = items[index];
    stage.querySelector('img, video')?.remove();
    const el = document.createElement(item.type === 'video' ? 'video' : 'img') as HTMLImageElement | HTMLVideoElement;
    el.src = item.src;
    if (el instanceof HTMLVideoElement) {
      el.controls = true;
      el.autoplay = true;
      el.muted = true;
      el.playsInline = true;
    } else {
      el.alt = item.caption ?? '';
    }
    stage.prepend(el);
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    caption.textContent = item.caption ?? '';
  };

  const single = items.length < 2;
  dialog.querySelectorAll<HTMLElement>('[data-prev], [data-next]').forEach((b) => (b.hidden = single));

  dialog.querySelector('[data-prev]')!.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-next]')!.addEventListener('click', () => show(index + 1));
  dialog.querySelector('[data-close]')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => stage.querySelector('video')?.pause());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (single) return;
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  return {
    open(i: number) {
      show(i);
      dialog.showModal();
      // showModal() focuses the first button (Close), which draws a focus ring on open.
      // Park focus on the dialog instead; Tab still reaches the buttons with a visible ring.
      dialog.focus({ preventScroll: true });
    },
  };
}
