🗂️ Proposed File & Folder Structure
bash
Copy
Edit
my-company-site/
├─ .env.local                # API keys (SendGrid, etc.)
├─ next.config.js
├─ tailwind.config.js
├─ package.json
├─ public/
│  ├─ images/                # Optimized hero & team photos
│  └─ favicon.ico
├─ content/                  # **Source-of-truth content**
│  ├─ home.md
│  ├─ about.md
│  ├─ services/
│  │   ├─ personal-dev.md
│  │   ├─ leadership-dev.md
│  │   └─ culture-strategy.md
│  ├─ events/
│  │   ├─ 2025-06-15-webinar.md
│  │   └─ …
│  ├─ resources/             # blog posts, case studies
│  └─ testimonials.json
├─ src/
│  ├─ pages/
│  │   ├─ index.tsx          # Home
│  │   ├─ about.tsx
│  │   ├─ services/index.tsx
│  │   ├─ events/index.tsx
│  │   ├─ resources/[slug].tsx
│  │   ├─ contact.tsx
│  │   └─ api/
│  │       └─ contact.ts     # Serverless email handler
│  ├─ components/
│  │   ├─ Layout.tsx         # Shell (header/footer)
│  │   ├─ Navbar.tsx
│  │   ├─ Hero.tsx
│  │   ├─ CTAButton.tsx
│  │   ├─ TestimonialSlider.tsx
│  │   ├─ EventCard.tsx
│  │   └─ …
│  ├─ lib/
│  │   ├─ markdown.ts        # MDX → HTML
│  │   ├─ events.ts          # fetch + sort events
│  │   └─ mailer.ts          # wrap SendGrid SDK
│  ├─ context/
│  │   └─ EventsContext.tsx  # global event list (optional)
│  ├─ hooks/
│  │   └─ useContactForm.ts
│  ├─ styles/
│  │   └─ globals.css
│  └─ types/
│      └─ index.d.ts
└─ README.md
What Each Part Does
Path	Responsibility	Runtime
content/**	Editable Markdown/MDX & JSON—no database bill	Build-time
src/pages/*.tsx	Top-level routes; Next.js turns files into pages	Client & server
src/pages/api/contact.ts	Tiny API route that receives form JSON, calls mailer.ts, returns 200/500	Serverless (Lambda/Edge)
components/**	Pure UI building blocks (stateless)	Client
lib/markdown.ts	Reads Markdown, adds remark-plugins, returns props for SSG.	Build-time
lib/events.ts	Loads event MD, filters upcoming vs past, caches result	Build-time & CSR
context/EventsContext.tsx	Stores filtered events so multiple pages don’t re-fetch	Client
hooks/useContactForm.ts	Handles form state, validation, async POST	Client
public/images	Optimized by Next/Image, served via CDN	Edge
api/contact → SendGrid	Sends Email → Contact mailbox / autoresponder	External SaaS

🏗️ How Everything Connects
mermaid
Copy
Edit
graph TD
  A[Browser] -- Static HTML/JS --> B(Vercel Edge CDN)
  B --> C[Next.js Pages]
  C -- MD/JSON import --> D[Content Files]
  C -- GET --> E[EventsContext]
  A -- POST /api/contact --> F[Next.js Serverless Fn]
  F -- Send Email --> G[SendGrid]
  C -- <iframe> / link --> H[Zoom/YT Live]
Build time (CI): Vercel pulls repo → runs next build → Markdown/JSON transformed → static pages + ISR.

Runtime: Mostly static; only the contact form hits a serverless function. No cold-start on Edge.

Webinar: Simply an <iframe> (YouTube Live) or a “Join Zoom” button with the meeting URL stored in each event MD file front-matter.

🗄️ State & Data Flow
State	Lives in	Lifecycle	Notes
Page content	Markdown ➜ compiled to props	Build-time static; revalidated on git push or CMS webhook (ISR)	Free, no DB
UI state (nav open, slider index)	React useState in each component	Client only	Ephemeral
Events list (upcoming/previous)	React Context fed by events.ts	Hydrated on first mount	Keeps navigation/snackbar instant
Contact form data	Local component state → POST body	Client → Serverless → Email	After send, no DB unless you add Airtable
