// ─── How to add images / videos to a project gallery ────────────────────────
//
// 1. Drop your files into /public/projects/<slug>/media/
//    e.g. /public/projects/fasttrack/media/queue-screen.webp
//
// 2. Add a `gallery` array to the project object:
//
//    gallery: [
//      { type: 'image', src: '/projects/fasttrack/media/queue-screen.webp', caption: 'Queue view' },
//      { type: 'image', src: '/projects/fasttrack/media/admin-dashboard.webp' },
//      { type: 'video', src: '/projects/fasttrack/media/demo.mp4', caption: 'Demo clip' },
//    ],
//
// 3. For the demo video embed (YouTube / Loom), use `videoEmbedUrl` instead:
//    videoEmbedUrl: 'https://www.youtube.com/embed/VIDEO_ID',
//
// If neither field is set, those sections simply don't appear on the page.
// ─────────────────────────────────────────────────────────────────────────────

export interface GalleryItem {
  type: 'image' | 'video';
  src: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  highlights: string[];
  tags: string[];
  github?: string;
  url?: string;
  videoEmbedUrl?: string;
  gallery?: GalleryItem[];
  year: number;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'hackudc-2027',
    title: 'HackUDC 2027 website and identity',
    description:
      'Website and visual identity for the fifth HackUDC, built around the lighthouse, gulls and streetlamps of A Coruña. I lead the design and web teams.',
    longDescription:
      "This year I lead both the design team and the web team for HackUDC, so the identity and the website for the fifth edition were made together. With my colleague Nuria García, I created the visual universe of the event: a theme built from things that are part of everyday life in A Coruña.\n\nThe website is where it all shows up. The Torre de Hércules stands over the numbers with its beam crossing the sea. A red streetlamp opens the about section. A seagull flies across the top of the page. The steps to take part sit on a Rosa dos Ventos, and the sponsors page is a building facade where each tier is a floor.\n\nThe brand is deliberately flat: navy, red, sky blue and cream, Rockwell for headlines and Inter for text. It is written down in a set of brand guidelines so sponsors and volunteers can use it without asking us.",
    highlights: [
      'Lead the design and web teams for the fifth edition, 26-28 February 2027',
      'Created the theme and visual universe for the edition together with Nuria García, based on landmarks and daily scenes of A Coruña',
      'Hero with a flying seagull; Emilia, the standing gull, watches from the footer',
      'Statistics section staged as a lighthouse scene, with the beam and the sea',
      'Registration steps built around an illustrated Rosa dos Ventos',
      'Sponsors section as an illustrated building, one floor per tier (root, admin, user, collab), filled with live sponsor data',
      'Brand guidelines covering logo variants, colour, typography, voice and accessibility',
      'Header link into hackOS, the event platform behind check-in, scheduling and judging',
      'Showcase of the 2026 winning projects, synced from Devpost',
      'Available in Spanish, English and Galician, with all copy in a single typed file',
      'Respects reduced-motion preferences and keeps visible keyboard focus throughout',
    ],
    tags: ['Astro', 'Tailwind CSS', 'Brand design'],
    github: 'https://github.com/gpul-org/hackudc-2027',
    url: 'https://hackudc.com',
    gallery: [
      { type: 'image', src: '/projects/hackudc-2027/media/hero.webp', caption: 'Hero: logo, flying seagull and the hackOS login' },
      { type: 'image', src: '/projects/hackudc-2027/media/streetlamp.webp', caption: 'The red streetlamp over the numbers section, with the floating header' },
      { type: 'image', src: '/projects/hackudc-2027/media/lighthouse.webp', caption: 'Torre de Hércules, its beam and the numbers' },
      { type: 'image', src: '/projects/hackudc-2027/media/rosa-dos-ventos.webp', caption: 'Rosa dos Ventos behind the registration steps' },
      { type: 'image', src: '/projects/hackudc-2027/media/sponsors-building.webp', caption: 'Sponsors: each tier is a floor of the building' },
      { type: 'image', src: '/projects/hackudc-2027/media/footer-emilia.webp', caption: 'Emilia in the footer' },
    ],
    year: 2027,
    featured: true,
  },
  {
    slug: 'fasttrack',
    title: 'FastTrack',
    description:
      'Queue management for hackathon judging. 120 projects, 12 rooms, 500 people. Built in three days, held up on the day.',
    longDescription:
      'Every hackathon has the same Sunday problem: a hundred teams all need to present their projects to the judges, sometimes to multiple judges. Nobody knows where to go, and the result is chaos.\n\nFastTrack works like a deli counter. Teams get placed in a queue for all challenges they are competing in, watch their position update live, and show up when called. Judges control the pace from their own view, and the system ensures that teams are called in the correct order, and that no team is called at two places at once.\n\nI built the system in three days for HackUDC 2026, during the event itself. It ran over 120 projects across 12 rooms at once and held up under 500 concurrent users. By most architectural standards the code is rough — but it worked, which was the only thing that mattered that Sunday morning.',
    highlights: [
      'Built in three days during the event itself',
      'Over 120 projects judged across 12 rooms simultaneously',
      '500 concurrent users, all live-updating their queue positions and being called in the correct order',
      'Three roles: hackers join queues, judges call teams, admins configure everything',
      'Passwordless auth via email OTP for judges and admins, and simple code lookup for participants',
    ],
    tags: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/gpul-org/fasttrack',
    gallery: [
      { type: 'image', src: '/projects/fasttrack/media/position-view.webp', caption: 'Queue position view for teams' },
      { type: 'image', src: '/projects/fasttrack/media/judge-view.webp', caption: 'Judge panel' },
      { type: 'image', src: '/projects/fasttrack/media/tv-view.webp', caption: 'TV display' },
    ],
    year: 2026,
    featured: true,
  },
  {
    slug: 'hackudc-app',
    title: 'HackUDC Management App',
    description:
      'React Native app for HackUDC staff. Check-ins, food passes and attendance tracking, all from a phone on the event floor.',
    longDescription:
      "Most of the work at a hackathon isn't the code, it's the logistics: getting people through the door, feeding them, and knowing who's actually in the building at any given moment. HackUDC 2026 needed one tool for staff to do all of that from their phones, and this is it.\n\nIt's a React Native/Expo app talking to the event backend. Staff use it to look people up, scan badges, check attendees in and out, hand out meal passes and read live numbers off a dashboard. The whole thing is built to be used one-handed while standing at a busy door, and it holds a session for a full day without making anyone log in again.\n\nThe part I'm most proud of isn't visible in the app itself. I set up App Store Connect for our organization from scratch, fought hard against INFORMA D&B and Apple to get our non-profit status recognized for Apple Developer's fee waiver, and handled the provisioning profiles, app validation and distribution so staff could actually install a signed build on their iPhones. That side of shipping to iOS is fiddly and usually undocumented, and getting it working was most of the battle.",
    highlights: [
      'Set up App Store Connect for the organization and owned the full iOS deployment flow: provisioning profiles, validation and distribution of signed builds to staff devices',
      'Attendee directory with role badges (Hacker, Mentor, Sponsor, Staff), searchable by name, email or accreditation',
      'QR scanner to look someone up by either badge or event ticket and link their identity to an event badge on the spot',
      'Full participant profiles, including shirt size and dietary restrictions',
      'Check-in and check-out with timestamps',
      'Meal passes for all backend configured meals, each with its own validity window and per-person history',
      "Live meal dashboards: who's eaten, who's inside but hasn't eaten, and who isnt in-venue and hasn't eaten",
      'Event-wide stats (confirmed, checked-in, currently inside) refreshed live',
      'Keeps staff logged in all day with background token refresh, and recovers cleanly when the connection drops',
      'Connected to the event backend (github.com/appuchias/hackackathon)',
    ],
    tags: ['React Native', 'Expo', 'TypeScript'],
    github: 'https://github.com/danicallero/hackudc_front',
    gallery: [
      { type: 'image', src: '/projects/hackudc-app/media/statistics.webp', caption: 'Event statistics' },
      { type: 'video', src: '/projects/hackudc-app/media/temp-video-demo.mp4' },
      { type: 'image', src: '/projects/hackudc-app/media/scanner.webp', caption: 'QR scanner' },
      { type: 'image', src: '/projects/hackudc-app/media/people-list-view.webp', caption: 'Participants list' },
      { type: 'image', src: '/projects/hackudc-app/media/person-detail-view.webp', caption: 'Participant detail' },
      { type: 'image', src: '/projects/hackudc-app/media/presence-view.webp', caption: 'Presence tracking' },
      { type: 'image', src: '/projects/hackudc-app/media/meal-pass-stats.webp', caption: 'Meal pass stats' },
      { type: 'image', src: '/projects/hackudc-app/media/mealpass-repeated-redeem.webp', caption: 'Repeated redeem prevention' },
    ],
    year: 2026,
    featured: true,
  },
  {
    slug: 'pkpassbuilder',
    title: 'pkpassBuilder',
    description:
      'Python script that generates signed Apple Wallet passes from a JSON list of attendees. Built for HackUDC 2026 accreditations.',
    longDescription: "Creating Apple Wallet passes for an event is more annoying than it should be. You need an Apple Developer account, a Pass Type ID certificate plus Apple's WWDR intermediate certificate, and then the real headache: hand-building the exact JSON structure that makes every field render the way you want in Wallet.\n\npkpassBuilder takes a JSON attendee list and turns it into a folder of ready-to-distribute .pkpass files — one per person, each signed, each with its own QR code and personalised fields like name, role and accreditation code. The QR can be built from any field in the JSON, so it encodes an email, an accreditation ID, or a custom token depending on how your check-in works. Branding, colours and layout come from a single config file, and images are auto-resized to Apple's spec so nothing shows up pixelated.\n\nWhere it really earns its keep is the details most ticketing platforms get wrong. Passes expire the moment the event ends — no clutter left behind, unlike services such as Weezevent or promoters like Ataquilla that let passes linger in Wallet for months, sometimes over a year. Passes that share a Pass Type Identifier group together under one event instead of scattering among unrelated ones. And it wires up relevant-location and relevant-date fields, so the pass surfaces on the lockscreen exactly when and where the attendee needs it.",
    highlights: [
      "Reads a JSON attendee list and outputs signed .pkpass files",
      "QR code per attendee, generated from any field you choose (email, accreditation ID, custom token...)",
      "Event details, branding, colours and field layout configured from a single file",
      "Auto-resizes logo, icon and strip images to Apple's spec to prevent pixelated assets",
      "Passes expire correctly after the event ends, unlike some generators (e.g. Weezevent), or more serious ticketers (e.g. Ataquilla or taquillera El Corte Inglés) that leave them lingering in Wallet until manually deleted",
      "Passes for the same event group together in Wallet under one Pass Type Identifier",
      "Lockscreen suggestions triggered by both location and date/time",
      "Exports each QR code separately as a PNG alongside the pass for use in other contexts (e.g. printing or emailing)",
      "One command generates a full folder of ready-to-send passes and QR codes"
  ],
    tags: ['Python', 'PassKit'],
    github: 'https://github.com/danicallero/pkpassBuilder',
    gallery: [
      { type: 'image', src: '/projects/pkpassbuilder/media/apple-wallet-view.webp', caption: 'Generated pass in Apple Wallet' },
      { type: 'image', src: '/projects/pkpassbuilder/media/pass-details.webp', caption: 'Configurable pass details across Wallet fields' },
      { type: 'image', src: '/projects/pkpassbuilder/media/lockscreen-view.webp', caption: 'Lockscreen suggestion by location and date/time' },
    ],
    year: 2026,
    featured: true,
  },
  {
    slug: 'hackudc-2026',
    title: 'HackUDC 2026 website',
    description:
      'Contributed to the official site for HackUDC 2026, the open source hackathon organised by GPUL at the University of A Coruña. 450+ attendees.',
    longDescription:
      'The public site for HackUDC 2026, the weekend that united +500 people (combining participants, mentors, staff and sponsors) together at the University of A Coruña.\n\nBuilt by the GPUL team as an open source project. I contributed alongside the rest of the team.',
    highlights: [
      '450+ attendees at the event it promoted',
      'Archived at hackudc2026.gpul.org',
    ],
    tags: ['Astro', 'Tailwind CSS', 'TypeScript'],
    github: 'https://github.com/gpul-org/hackudc-2026',
    url: 'https://hackudc2026.gpul.org',
    gallery: [
      { type: 'image', src: '/projects/hackudc-2026/media/landing.webp', caption: 'Landing page' },
      { type: 'image', src: '/projects/hackudc-2026/media/gallery-component.webp', caption: 'Gallery component' },
    ],
    year: 2026,
    featured: false,
  },
];

/** First still image of a project, used as its thumbnail. */
export const coverOf = (p: Project) => p.gallery?.find((g) => g.type === 'image')?.src;
