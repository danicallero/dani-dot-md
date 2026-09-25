import { themeStorageKey } from '../data/site';

type ThemeName = 'dark' | 'light';
type ThemeTransitionClass = 'theme-transition-expand' | 'theme-transition-retract';

interface ViewTransitionLike {
  ready: Promise<void>;
  finished: Promise<void>;
}

interface DocumentWithViewTransition extends Document {
  startViewTransition?: (updateCallback: () => void | Promise<void>) => ViewTransitionLike;
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getButtonCenter = (button: HTMLButtonElement) => {
  const rect = button.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

const getMaxRadius = (x: number, y: number) => Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

export const initThemeToggle = () => {
  const root = document.documentElement;
  const transitions = document as DocumentWithViewTransition;
  const button = document.querySelector('.theme-toggle');
  const currentTheme = (root.dataset.theme as ThemeName | undefined) || 'dark';
  root.dataset.theme = currentTheme;
  if (!(button instanceof HTMLButtonElement)) return;

  const setButtonLabel = (theme: ThemeName) => {
    const label = theme === 'dark' ? 'Use light mode' : 'Use dark mode';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  };

  const applyTheme = (theme: ThemeName) => {
    root.dataset.theme = theme;
    localStorage.setItem(themeStorageKey, theme);
    setButtonLabel(theme);
  };

  const clearTransitionClasses = () => root.classList.remove('theme-transition-expand', 'theme-transition-retract');

  setButtonLabel(currentTheme);

  button.addEventListener('click', async () => {
    const nextTheme: ThemeName = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (!transitions.startViewTransition || prefersReducedMotion()) return applyTheme(nextTheme);

    const { x, y } = getButtonCenter(button);
    const radius = getMaxRadius(x, y);
    const transitionClass: ThemeTransitionClass = nextTheme === 'dark' ? 'theme-transition-expand' : 'theme-transition-retract';
    clearTransitionClasses();
    root.style.setProperty('--theme-x', `${x}px`);
    root.style.setProperty('--theme-y', `${y}px`);
    root.style.setProperty('--theme-radius', `${radius}px`);
    root.classList.add(transitionClass);

    try {
      const transition = transitions.startViewTransition(() => applyTheme(nextTheme));
      await transition.ready;
      await transition.finished;
    } catch {
      applyTheme(nextTheme);
    } finally {
      clearTransitionClasses();
    }
  });
};
