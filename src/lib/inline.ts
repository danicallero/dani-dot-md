/**
 * A tiny inline-markdown renderer for text written in data files: [text](url) links, `code`
 * and **bold**. Everything else is escaped. The input is ours, never visitors', but escaping
 * keeps a stray "<" from breaking the page.
 */
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const inline = (text: string) =>
  escape(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) =>
      /^https?:/.test(href) ? `<a href="${href}" rel="noopener noreferrer" target="_blank">${label}</a>` : `<a href="${href}">${label}</a>`,
    );
