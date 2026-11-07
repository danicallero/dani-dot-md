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

/** One piece of a project section, in reading order. Text supports [links](url) and `code`. */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'figure'; src: string; alt: string; caption: string; plain?: boolean };

/** A labelled part of the page, laid out like Overview and Details. */
export interface Section {
  label: string;
  blocks: Block[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  highlights: string[];
  /** Longer write-up under Overview, for projects with a story to tell. */
  sections?: Section[];
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
    "slug": "hackos",
    "title": "hackOS",
    "description": "The platform HackUDC runs on: applications, check-in, offline scanners, the judging queue and the venue screens on one database, replacing four tools.",
    "longDescription": "hackOS is the platform HackUDC runs on. Applications, check-in, meals, projects, judging rooms, announcements and the screens around the venue all share one database. Before, they were separate tools that shared nothing.\n\nI started it on July 3rd and it's public, under the AGPL. As I write this, on November 7th, it has 3,306 commits, 965 merged pull requests and about 330,000 lines of TypeScript. What it does on event day is in the [talk I gave at CoruñaWTF](/blog/organizing-an-event-for-600-people). This page is about why it exists, how it's put together and why I think the design holds up.",
    "highlights": [
      "Three apps and one database: a Fastify API with 20 modules, a Next.js web app and an Expo mobile app, all on Postgres",
      "Raw SQL and no ORM. Migrations are checksummed, so one that has been applied can never be edited",
      "Realtime through server-sent events over Valkey, plus a shared cache so a crowd of screens costs one query",
      "Scanners keep an encrypted roster and a durable queue of scans, and the server confirms every one",
      "A judging queue with explicit stages, where a team can never be called into two rooms at once",
      "Permissions by capability, not by role",
      "A design system tied to HackUDC's identity: one theme file holds the palette and fonts, so next year's edition is a theme change and not a restyle of every page",
      "Apple and Google Wallet passes, and Live Activities on the lock screen",
      "Live screens at the venue; a team can link its GitHub repo and the screens rank commits and pull requests",
      "Spanish, Galician and English throughout",
      "Data export and deletion, and a queryable audit trail"
    ],
    "sections": [
      {
        "label": "Why it exists",
        "blocks": [
          {
            "type": "figure",
            "src": "/projects/hackudc-app/media/scanner.webp",
            "alt": "The check-in app from HackUDC 2026: a phone camera view with a yellow frame around the QR code being scanned.",
            "caption": "The check-in app from HackUDC 2026, which hackOS replaces",
            "plain": true
          },
          {
            "type": "p",
            "text": "HackUDC ran on a pile of tools that didn't talk to each other. Directus held the public side: challenges, schedule, announcements and the sponsor logos. An enrollment manager handled applications and accreditation, a QR app did check-in, and FastTrack ran the judging. Projects came in through Devpost. In the talk I said five logins, and the plan I started from says four systems. Pick whichever number annoys you more."
          },
          {
            "type": "p",
            "text": "The number was never the problem. None of them shared data, so the same schedule and the same challenges got typed in more than one place. hackOS starts from one rule: its own database is the source of truth, and anything external only feeds it."
          },
          {
            "type": "figure",
            "src": "/projects/hackos/media/tools-to-platform.webp",
            "alt": "Diagram. On the left, the tools HackUDC ran on: Directus, an enrollment manager, a QR check-in app, FastTrack and Devpost. On the right, one box holding what replaced them: public pages and schedule, applications and accreditation, scanners that work offline, queue rooms and judging, and projects built in.",
            "caption": "What each of the old tools became"
          },
          {
            "type": "p",
            "text": "FastTrack is the one I know best, because I wrote it, in three nights, during the last edition. It held up, and it's trench code. The plan doesn't pretend otherwise: one line in the stories says \"FastTrack must improve\", and the schema carries comments about what it got wrong. It had a duplicate-sibling bug, where the same project could end up queued twice for a challenge, and the new schema rules that out with a unique constraint. And it couldn't tell you who had changed a score. Now every save is a row."
          },
          {
            "type": "figure",
            "src": "/projects/fasttrack/media/judge-view.webp",
            "alt": "FastTrack's room view: the queue flow with the team presenting, the standby teams and the upcoming queue, next to the scoring form.",
            "caption": "FastTrack's room view, from HackUDC 2026"
          }
        ]
      },
      {
        "label": "Plan first",
        "blocks": [
          {
            "type": "p",
            "text": "Before the first line of code there's a `plan/` folder, carried over from earlier attempts. The first commit is only that folder, and its message says \"from previous attempts\", so no, this wasn't the first try."
          },
          {
            "type": "p",
            "text": "In it are 59 user stories, numbered H1 to H60 (H6 was retired), and they're the source of truth. If another doc disagrees with them, the stories win. Next to them is a short list of rules that aren't up for debate:"
          },
          {
            "type": "list",
            "items": [
              "Permissions come from capabilities, not roles. A judge who is also competing doesn't switch accounts.",
              "A ticket and a badge are different things.",
              "A no-show is a human decision. Nothing expels a team silently.",
              "A team is never called into two rooms at once if it shares a member.",
              "Scanners survive bad wifi: a local queue, and retries that are safe to repeat."
            ]
          },
          {
            "type": "figure",
            "src": "/projects/hackos/media/now-roles.webp",
            "alt": "The roles screen: a list of roles on the left and, for the selected role, every capability with Deny, Inherit and Allow buttons.",
            "caption": "Roles in hackOS: for every capability, allow, deny or inherit",
            "plain": true
          },
          {
            "type": "p",
            "text": "The plan also fixes the order of work: identity and permissions first, then the queue and judging, which the stories call non-negotiable, then everything else, with the mobile app last. The mobile app started eleven days in."
          },
          {
            "type": "p",
            "text": "Every commit names the story it implements, like `feat(queue): call_next transition (H29, H30)`. Sixty different story numbers show up in the history."
          }
        ]
      },
      {
        "label": "How it works",
        "blocks": [
          {
            "type": "p",
            "text": "From the outside, hackOS is two apps and a lot of screens. People use a web app and a mobile app, and the TVs on the venue walls are just the web app on a big display. Behind them there's one API that owns every rule, and a worker that does the slow jobs in the background: sending email, publishing scheduled announcements, keeping the judging queues moving and syncing Wallet passes."
          },
          {
            "type": "p",
            "text": "Underneath is the part I care about most. Postgres remembers everything that matters. Valkey is fast and disposable: it carries the realtime nudges, a shared cache and the clock that wakes the worker up. MinIO keeps the files. The API and the worker are the same code started in two modes, so the code that queues a job and the code that runs it can't drift apart."
          },
          {
            "type": "figure",
            "src": "/projects/hackos/media/architecture.webp",
            "alt": "Diagram of the system in three layers. On top, the web app and the mobile app. In the middle, the API and the worker. At the bottom, inside a private network, Postgres as the only source of truth, Valkey for realtime nudges and the job clock, and MinIO for files.",
            "caption": "The whole system. The dark box is the only one that has to survive"
          },
          {
            "type": "p",
            "text": "Postgres and Valkey can't be reached from outside at all, and of MinIO only the folder with the sponsor logos is public. One deployment serves exactly one hackathon: a second event is a second, completely separate copy of the stack, with its own database and secrets. That also means there's no multi-tenant code to get wrong."
          }
        ]
      },
      {
        "label": "Built to hold up",
        "blocks": [
          {
            "type": "p",
            "text": "An event has a few moments where everything happens at once: registration opens, doors open, judging starts. These are the decisions I'd defend."
          },
          {
            "type": "p",
            "text": "**One source of truth.** Postgres is the only thing that has to survive. Valkey runs with persistence switched off on purpose: if it dies, the background jobs tick again and the screens ask the database for fresh data, and nothing is lost. Even the queue of emails waiting to go out is just rows in Postgres, with their status, attempts and next try. Valkey only supplies the clock, and a cache that is allowed to vanish."
          },
          {
            "type": "p",
            "text": "**Exactly one winner.** Two staff members press \"call next\" at the same moment. Only one of them gets the team. Every state change locks the rows it touches, so one transition wins and the other is told no. Some rules aren't even checked in code: the schema makes them impossible, like a project having two queue entries for the same challenge."
          },
          {
            "type": "figure",
            "src": "/projects/hackos/media/judging-queue.webp",
            "alt": "State diagram of the judging queue: a team goes from Waiting to Called to In the room to Presenting to Completed. It can be sent back from Called to Waiting, and taken out of the room back to Called. Disqualification is a person's decision.",
            "caption": "A team's path through judging. A person decides no-shows, never a timer"
          },
          {
            "type": "p",
            "text": "**Retries are safe.** Scanners keep working without a connection. A scan is saved on the device first, with an id of its own, and only then sent. It counts as done when the server confirms it has saved it. If the server doesn't answer, the scanner keeps the scan and tries again with the same id, and the server recognises the retry and returns the answer it already stored instead of counting it twice. If the server answers with an error (the record now conflicts with newer data, say), the operator sees why and can fix it."
          },
          {
            "type": "p",
            "text": "That id is an idempotency key, and it's on every mutation that matters, not only on scans. The server claims the key before it does the work, and the change, its audit entry and any outgoing notifications are committed in one transaction."
          },
          {
            "type": "figure",
            "src": "/projects/hackos/media/scan-journey.webp",
            "alt": "Flow diagram of a scan: it is made, saved on the device with its own id, then sent to the server with the id as a key. The server either acknowledges it, does not answer so the device retries with the same id, or rejects it and the operator sees the reason.",
            "caption": "The journey of a scan"
          },
          {
            "type": "p",
            "text": "**A nudge, not the data.** The venue screens never get data pushed at them. They get a nudge, a tiny \"the queue changed\" message, and then they ask for the new state themselves. When a hundred screens ask at once, only one of them actually queries Postgres. Every change throws away the cached copy of that data, which lives in Valkey and is shared by all the API instances, so the first request to arrive rebuilds it and the rest wait a moment and read the result. The nudge only goes out after the change has been committed, and it carries a counter per topic, so a screen that reconnects can tell it missed something and refetch everything."
          },
          {
            "type": "p",
            "text": "That only applies to what everyone sees the same: the walls, the public schedule, the sponsors. The cached copy is dropped before the nudge goes out, so a screen that reacts to it can't read the old one, and the live queue's copy also expires by itself after two seconds, as a backstop. Anything personal, like your own place in the queue, is never cached."
          },
          {
            "type": "figure",
            "src": "/projects/hackos/media/button-to-screen.webp",
            "alt": "Five steps from a button to a screen. Staff press call next. One database transaction locks the rows and writes the change, the audit entry and the emails. It commits. Valkey drops the cached copy and nudges every API instance. The first request reads Postgres and everyone else reads the new copy.",
            "caption": "From a button to a screen"
          },
          {
            "type": "p",
            "text": "**The staff always get through.** When registration opens, hundreds of participants hit the app at once while a handful of staff are trying to check people in. Requests are sorted into four lanes before they reach any code: queue operators, judges and accreditation staff first, then sponsors and judge collaboration, then the public screens, then everyone else. A few slots are reserved so participants can't use them all up, and when it's really crowded it's the lowest lane that gets a polite \"try again\"."
          },
          {
            "type": "p",
            "text": "**One Postgres, on purpose.** I kept a single Postgres primary as the deliberate bottleneck, because it keeps correctness simple, and the stateless API and worker are where the scaling happens. The connection budget fits in one line: an API pool of 24, a worker pool of 24 and 12 spare connections come to 60, under Postgres's default limit of 100."
          }
        ]
      },
      {
        "label": "How it's written",
        "blocks": [
          {
            "type": "p",
            "text": "Tests run against a real Postgres and a real Valkey, not mocks, and there are 485 test files. The docs travel with the code, in the same commit as the change they describe."
          },
          {
            "type": "p",
            "text": "I write it together with coding agents, Claude Code and Codex, and the repo is set up for them. `AGENTS.md` tells an agent what to read before it touches anything, and `CLAUDE.md` holds the rules above."
          },
          {
            "type": "p",
            "text": "There's also a file of lessons, with an entry for every time I had to correct a coding agent. It has 31 so far. I started keeping it after [Christian Palou and Xoel López](https://luma.com/olu663lb) explained the idea in their talk at Shipaton A Coruña."
          }
        ]
      },
      {
        "label": "How it went",
        "blocks": [
          {
            "type": "figure",
            "src": "/projects/hackos/media/commits-per-week.webp",
            "alt": "Bar chart of commits per week from July to November. Peaks of about 310 in mid July, 390 in late August and 350 and 310 in mid October, with a quiet stretch in August.",
            "caption": "Commits per week, July 3rd to November 7th"
          },
          {
            "type": "p",
            "text": "The first two days were the plan, the scaffold, the shared contracts (the list of capabilities and the realtime events), the database schema, the API core and a test harness. By the end of the second day, identity, notifications, the judging queue, applications and logistics all existed in a first version. The web app started on July 5th. The mobile app followed on July 14th, with push notifications, Apple Wallet and the offline scanners."
          },
          {
            "type": "p",
            "text": "August started slowly, with a quiet week in the middle, and ended with the biggest week of the whole project: scaling work for a 600-person event, TestFlight feedback on the schedule and, on August 26th, end-to-end tests for the event-day flows: check-in, scanners and the queue."
          },
          {
            "type": "p",
            "text": "On September 15th I reset the database history and made the repo public. There's a clean production baseline now, and the migrations start again at 0001. The 117 old ones live in a folder that is never applied."
          },
          {
            "type": "p",
            "text": "On October 2nd [Samuel Corsan](https://github.com/samuelcorsan) helped me set up a design system for the web app, connected to the look of HackUDC. The palette and the Rockwell and Inter fonts come from the HackUDC 2027 website, and they live in one theme file. He also standardised the icons and the filter menus. Samuel is a beast, and one of the people behind [HackSpain](https://hackspain.com), the 36-hour hackathon in Madrid that brought together 250 young builders this year."
          },
          {
            "type": "p",
            "text": "October is where most of the work is, and there's a simple reason. Over the long weekend I went to an offsite with some of the GPUL volunteers, at Anceu Coliving, to plan next year and to push HackUDC 2027 forward ([I wrote about it on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7515500225038270464/)). I had access to an extra Claude Max 20x subscription there, and people around to test the Android app on real phones, which I can't do on my own because I don't own an Android device. The busiest day of the whole project, October 11th with 170 commits, was in the middle of that weekend, and it's when Live Activities started."
          },
          {
            "type": "p",
            "text": "On October 13th Devpost was retired, and the next day projects became a native part of hackOS: my own submission flow, with the editor, the gallery and the winners, on web and mobile at once. After that came the cleaning: an audit for dead code, no more N+1 queries, the Sonar cleanups, an accessibility audit and, in the last two days, untangling the API into shared helpers."
          },
          {
            "type": "p",
            "text": "One more number: 1,023 of the commits are fixes and 635 are features. I'd rather not think about what that says."
          },
          {
            "type": "p",
            "text": "HackUDC 2027 is on February 26th to 28th. That's the real test."
          }
        ]
      }
    ],
    "tags": [
      "TypeScript",
      "Fastify",
      "Next.js",
      "Expo",
      "Postgres",
      "React Native",
      "Valkey",
      "BullMQ",
      "Tailwind CSS",
      "Docker"
    ],
    "github": "https://github.com/danicallero/hackOS",
    "gallery": [
      {
        "type": "image",
        "src": "/projects/hackos/media/now-cover.webp",
        "caption": "hackOS on the web and on two phones: the participant's queue and the staff scanner"
      },
      {
        "type": "image",
        "src": "/projects/hackos/media/now-judging.webp",
        "caption": "Judging on the web: the waiting room, the queue, the team presenting and the scoring form"
      },
      {
        "type": "image",
        "src": "/projects/hackos/media/now-queue.webp",
        "caption": "What a participant sees: their position in the queue and the room they will be called to"
      },
      {
        "type": "image",
        "src": "/projects/hackos/media/now-scanner.webp",
        "caption": "The staff scanner, set up to serve meals"
      },
      {
        "type": "image",
        "src": "/projects/hackos/media/now-needs-attention.webp",
        "caption": "A scan the server rejected stays in the device queue, with the reason, for the operator to retry"
      },
      {
        "type": "image",
        "src": "/projects/hackos/media/now-review.webp",
        "caption": "Reviewing an application: the CV, the answers, and the reviewer's score and notes side by side"
      },
      {
        "type": "image",
        "src": "/projects/hackos/media/now-live-activity.webp",
        "caption": "A Live Activity on the lock screen, following a meal as it happens"
      },
      {
        "type": "image",
        "src": "/projects/hackos/media/now-wallet-pass.webp",
        "caption": "The ticket as a Wallet pass"
      },
      {
        "type": "image",
        "src": "/projects/hackos/media/now-certificate.webp",
        "caption": "A certificate of attendance, with a QR code to verify it"
      },
      {
        "type": "image",
        "src": "/projects/hackos/media/now-enterprises.webp",
        "caption": "Sponsors: visibility, when they are revealed, their group and priority"
      },
      {
        "type": "image",
        "src": "/projects/hackos/media/now-schedule-admin.webp",
        "caption": "Managing the schedule: which items need a scan and which get a Live Activity"
      },
      {
        "type": "image",
        "src": "/projects/hackos/media/now-schedule-en.webp",
        "caption": "The schedule in the app, in English"
      },
      {
        "type": "image",
        "src": "/projects/hackos/media/now-schedule-es.webp",
        "caption": "The same schedule, in Spanish"
      }
    ],
    "year": 2026,
    "featured": true
  },
  {
    slug: 'hackudc-2027',
    title: 'HackUDC 2027 website and identity',
    description:
      'Website and visual identity for the fifth HackUDC, built around the lighthouse, gulls and streetlamps of A Coruña. I lead the design and web teams.',
    longDescription:
      "This year I lead both the design team and the web team for HackUDC, so the identity and the website for the fifth edition were made together. With my colleague Nuria García, I created the visual universe of the event: a theme built from things that are part of everyday life in A Coruña.\n\nThe website is where it all shows up. The Torre de Hércules stands over the numbers with its beam crossing the sea. A red streetlamp opens the about section. A seagull flies across the top of the page. The steps to take part sit on a Rosa dos Ventos, and the sponsors page is a building facade where each tier is a floor.\n\nThe brand is deliberately flat: navy, red, sky blue and cream, Rockwell for headlines and Inter for text. It is written down in a set of brand guidelines so sponsors and volunteers can use it without asking us.",
    highlights: [
      'Lead the design and web teams for the fifth edition, February 26th to 28th, 2027',
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
    year: 2026,
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
export const coverOf = (p: Project) =>
  p.gallery?.find((g) => g.type === 'image')?.src ??
  p.sections?.flatMap((s) => s.blocks).find((b) => b.type === 'figure')?.src;
