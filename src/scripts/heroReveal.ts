import { heroMotion } from '../data/site';

export const initHeroReveal = () => {
  const hero = document.querySelector('.hero-surface');
  const layer = hero?.querySelector('.hero-invert');
  if (!(hero instanceof HTMLElement) || !(layer instanceof HTMLElement)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  hero.dataset.interactive = 'true';
  let head = { x: hero.clientWidth / 2, y: hero.clientHeight / 2 };
  let tail = { ...head }, target = { ...head }, radius = 0, targetRadius = 0, frame = 0, previous = 0;
  const mobile = () => matchMedia(heroMotion.mobileBreakpointQuery).matches;
  const setTarget = (event: MouseEvent | PointerEvent) => {
    const rect = hero.getBoundingClientRect(); target = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const paint = () => {
    const dx = head.x - tail.x, dy = head.y - tail.y, distance = Math.hypot(dx, dy);
    if (radius < heroMotion.collapseThreshold) return layer.style.clipPath = `circle(0 at ${head.x}px ${head.y}px)`;
    if (distance < heroMotion.circleThreshold) return layer.style.clipPath = `circle(${radius}px at ${head.x}px ${head.y}px)`;
    const ux = dx / distance, uy = dy / distance, nx = -uy, ny = ux;
    const end = { x: head.x - ux * Math.min(distance, radius * heroMotion.maxTrailMultiplier), y: head.y - uy * Math.min(distance, radius * heroMotion.maxTrailMultiplier) };
    const points: string[] = [];
    for (let i = 0; i <= heroMotion.capSegments; i++) { const t = i / heroMotion.capSegments * Math.PI; points.push(`${head.x + nx * Math.cos(t) * radius + ux * Math.sin(t) * radius} ${head.y + ny * Math.cos(t) * radius + uy * Math.sin(t) * radius}`); }
    for (let i = 0; i <= heroMotion.capSegments; i++) { const t = i / heroMotion.capSegments * Math.PI; points.push(`${end.x - nx * Math.cos(t) * radius - ux * Math.sin(t) * radius} ${end.y - ny * Math.cos(t) * radius - uy * Math.sin(t) * radius}`); }
    layer.style.clipPath = `path('M ${points.join(' L ')} Z')`;
  };
  const animate = (time: number) => {
    const delta = Math.min(heroMotion.maxDeltaMs, time - previous || 16); previous = time;
    const tailEase = 1 - Math.exp(-delta / heroMotion.tailLerpMs), radiusEase = 1 - Math.exp(-delta / heroMotion.radiusLerpMs);
    head = target; tail.x += (head.x - tail.x) * tailEase; tail.y += (head.y - tail.y) * tailEase; radius += (targetRadius - radius) * radiusEase; paint();
    if (Math.abs(radius - targetRadius) > .5 || Math.hypot(head.x - tail.x, head.y - tail.y) > .35) frame = requestAnimationFrame(animate); else { frame = 0; previous = 0; }
  };
  const run = () => { if (!frame) frame = requestAnimationFrame(animate); };
  const enter = (event: MouseEvent | PointerEvent) => { setTarget(event); head = mobile() ? target : head; tail = { ...head }; radius = targetRadius = mobile() ? heroMotion.mobileRadius : heroMotion.desktopRadius; hero.dataset.hover = 'true'; paint(); run(); };
  const leave = () => { targetRadius = 0; run(); window.setTimeout(() => { if (targetRadius === 0) hero.dataset.hover = 'false'; }, 90); };
  hero.addEventListener('mouseenter', enter); hero.addEventListener('mousemove', (event) => { setTarget(event); run(); }); hero.addEventListener('mouseleave', leave);
};
