import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://dani.md',
  integrations: [
    icon({
      include: {
        lucide: ['globe-2', 'book-open', 'mail'],
        'simple-icons': ['github', 'linkedin', 'instagram'],
      },
    }),
  ],
});
