Below is a granular, single-concern, test-driven backlog that an engineering-LLM (or junior dev) can tackle one ticket at a time.
Tasks are ordered so that each builds on the previous and can be merged/released independently.

🟦 Phase 0 — Local Environment
#	Task	Start	End / DoD	Test
0-1	Install prerequisites (Node ≥ 18, Git, VS Code)	Fresh laptop	node --version shows ≥18; git --version ok	CLI
0-2	Fork empty Git repo	GitHub UI	main branch exists with README stub	git clone works

🟦 Phase 1 — Repo & Toolchain
#	Task	Start	End / DoD	Test
1-1	Bootstrap Next.js + TS<br/>npx create-next-app@latest my-company-site --ts	Empty repo	App boots on npm run dev @localhost:3000	Browser “Welcome to Next.js”
1-2	Commit & push initial skeleton	Local changes	CI passes on GitHub (default tests)	GitHub build status ✓
1-3	Add Tailwind (npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p)	Default CSS	text-red-500 class renders red	Manual page check
1-4	Configure Prettier + ESLint (next lint)	Vanilla config	npm run lint returns 0	CLI
1-5	Add .env.local to .gitignore	Repo root	Secrets never show in git status	Inspect git

🟦 Phase 2 — Global Shell
#	Task	Start	End / DoD	Test
2-1	Create src/components/Layout.tsx with header+footer placeholders	pages/index.tsx	Page wraps in Layout	Visual
2-2	Wrap _app.tsx with Layout	Plain app	All routes share header/footer	Browser nav
2-3	Build Navbar.tsx with links: Home, About, Services, Events, Contact	Empty header	Clicking links changes route	Manual
2-4	Add mobile toggle (hamburger)	Desktop-only nav	Nav collapses ≤640 px	Resize window
2-5	Extract CTAButton.tsx reusable button	Repeated buttons	Component renders props label + href	Storybook snapshot (optional)

🟦 Phase 3 — Markdown Content Pipeline
#	Task	Start	End / DoD	Test
3-1	Add gray-matter + remark-html deps	None	Imports compile md->html without error	Node REPL quick test
3-2	Create lib/markdown.ts helper (getMarkdownBySlug)	Deps installed	Function returns {html,frontMatter}	Jest unit test
3-3	Add content/home.md with tagline & sections	Empty folder	File exists, CI passes	git ls-files
3-4	Convert Home page to SSG (getStaticProps uses markdown helper)	Hard-coded JSX	Home renders markdown body	Browser
3-5	Unit-test markdown helper (home.test.ts)	No test	npm test green	Jest

🟦 Phase 4 — Pages
#	Task	Start	End / DoD	Test
4-1	About page: add content/about.md and SSG page	Missing page	/about shows markdown content	Browser
4-2	Services md files (personal-dev.md, leadership-dev.md, culture-strategy.md)	None	Files compile without error	CLI
4-3	ServiceCard.tsx small card component	Inline HTML	Props-driven card renders title+excerpt	Storybook / Chromatic
4-4	Services index page loops over md front-matter → cards	Blank page	/services shows 3 cards	Browser
4-5	Testimonials JSON (content/testimonials.json) placeholder	None	Valid JSON lints	npm run lint
4-6	TestimonialSlider.tsx (simple tailwind flex + useState)	None	Arrows cycle through quotes	Manual
4-7	Embed TestimonialSlider on Home	Slider component	Home auto-rotates testimonials	Visual

🟦 Phase 5 — Events Module
#	Task	Start	End / DoD	Test
5-1	Add sample event md files in content/events/ (future & past)	Empty folder	Files parsed	CLI
5-2	lib/events.ts helper: load, sort, flag isUpcoming	No helper	Jest green (unit tests for categorization)	npm test
5-3	EventsContext.tsx (React context storing list)	None	Context provider compiles	Storybook smoke test
5-4	Events index page renders upcoming card + past archive	Blank page	/events displays sections	Browser
5-5	EventCard.tsx card with “Join Now” / “Watch Replay” button	Inline div	Card passes accessibility audit	Lighthouse

🟦 Phase 6 — Contact Flow
#	Task	Start	End / DoD	Test
6-1	Contact page form (Name, Email, Message) + useContactForm hook	Empty page	Form renders, local state updates on input	Browser
6-2	API route /api/contact.ts returns {success:true} stub	No backend	curl POST = 200 JSON	Terminal
6-3	Wire hook → POST to API, show toast on success	Stubbed API	Toast appears, network call 200	DevTools
6-4	Add @sendgrid/mail + lib/mailer.ts (reads env)	Stub email	Jest mocks SendGrid; handler returns 202	Unit test
6-5	Replace stub in /api/contact with real SendGrid call	Mock in place	Sends email to DEV inbox	Check mailbox
6-6	Integration test with supertest for API route	Tests missing	npm test passes	CI

🟦 Phase 7 — Media Embeds
#	Task	Start	End / DoD	Test
7-1	MeetingEmbed.tsx renders <iframe src={embedUrl}>	None	Component snapshot stable	Jest
7-2	Update event md front-matter (embedUrl)	No field	Parser returns field	Unit test
7-3	Render MeetingEmbed when isUpcoming event has embedUrl	Static link	Webinar iframe visible	Browser

🟦 Phase 8 — Assets & Polish
#	Task	Start	End / DoD	Test
8-1	Add hero image to /public/images	Placeholder	Next/Image displays optimized version	Lighthouse performance
8-2	Configure SEO <Head> component (title, meta, OG)	None	Meta tags visible in HTML	DevTools
8-3	Add Plausible script in _document.tsx (env keyed)	No analytics	Network shows Plausible request	DevTools
8-4	Audit with Lighthouse & fix a11y warnings	Potential issues	Score ≥90 on a11y	Lighthouse

🟦 Phase 9 — CI/CD & Hosting
#	Task	Start	End / DoD	Test
9-1	Connect repo to Vercel (Hobby)	No project	Preview URL builds successfully	Vercel dashboard ✓
9-2	Add env vars in Vercel (SENDGRID_API_KEY, CONTACT_TO)	None	Contact form works on preview link	Browser
9-3	Merge to main triggers prod deploy	Preview tested	https://your-site.vercel.app live	Browser global

🟦 Phase 10 — Docs & Handoff
#	Task	Start	End / DoD	Test
10-1	Update README.md with setup, test, deploy instructions	Stub README	New teammate can clone → npm run dev works	Peer review
10-2	Open GitHub Issues for future “nice-to-haves” (search, CMS)	None	Backlog visible	GitHub

