# Feature log

Features and notable implementation changes that have shipped, newest first. Each entry has an ID (`FEAT-1` is the oldest, and the numbers go up in the order the work merged), the merge date (UTC), the pull request, what it is, why it was done that way and how it is built.

Add an entry in a small `doc/` pull request after the feature's pull request merges, so the PR number and date are final. A new entry takes the next number after the highest one in the log; an ID is never reused or renumbered. Bugs go in [`bug-log.md`](bug-log.md) and the one-line summary of every merged change goes in [`changelog.md`](changelog.md).

## FEAT-20: Five Python projects with demo videos in a pop-out player

- **Merged:** 2026-10-30, [PR #66](https://github.com/ParseTK/ParseTK.github.io/pull/66); [PR #67](https://github.com/ParseTK/ParseTK.github.io/pull/67) removed the PaintJob card
- **What:** the Python tab shows Password Validator, Planetary Weights, Real Estate Analyzer, Tax Year Validator and Numerology. Each card has a still from its demo video; pressing it opens the video in a pop-out.
- **Why:** self-hosted rather than YouTube. The five videos are 0.36 to 0.74 MB each (2.8 MB, compressed from 62 MB), so they start at once, need no third-party script and no change to the Content Security Policy.
- **How:** `VideoDialog` is a native `<dialog>` opened with `showModal`, which gives the focus trap, Escape and an unreachable page behind it. It is only rendered while open, so no video is fetched until a card is opened. Focus returns to the thumbnail button after the dialog is gone. Data lives in `src/data/projects.ts` (`image` is the still, `video` the hosted file; `videoUrl` still opens an external link). Media is in `public/projects/videos` and `public/projects/posters`. Project cards are now solid, because the 70% opaque frame let a neighbouring card's text show through.
- **Not done:** captions (the videos have no caption track); a check on a physical phone.
- **See also:** [FEAT-9](#feat-9-typed-project-data-and-category-tabs), [FEAT-10](#feat-10-circular-3d-project-carousel).

## FEAT-19: Plainer site wording

- **Merged:** 2026-10-30, [PR #63](https://github.com/ParseTK/ParseTK.github.io/pull/63), [PR #64](https://github.com/ParseTK/ParseTK.github.io/pull/64), [PR #65](https://github.com/ParseTK/ParseTK.github.io/pull/65)
- **What:** the hero paragraph became a welcome that says what is on the page. The About text leads with the education and internship, then how the owner works and who they are outside of code. The "what kind of developer I am" statement (clean code, test-driven development, continuous learning) moved to the Skills heading. The Languages chip `SQL (SQL Server)` became `SQL`.
- **Why:** the earlier wording read as stock copy, and tool names and jargon belonged in Skills rather than in About.
- **How:** copy only, in `HeroSection.tsx`, `AboutSection.tsx`, `SkillsSection.tsx` (through the `description` of `SectionHeading`) and `src/data/skills.ts`. The About timeline cards were left as they were.

## FEAT-18: Content Security Policy

- **Merged:** 2026-10-30, [PR #62](https://github.com/ParseTK/ParseTK.github.io/pull/62)
- **What:** the built page carries a Content Security Policy that allows scripts, styles, fonts and requests only from the site itself, images from the site and `data:` (for the grain texture), and nothing inline or `eval`-style.
- **Why:** GitHub Pages cannot send headers, so the policy is a `<meta>` tag. It limits what an injected script or style could do.
- **How:** `vite-plugins/content-security-policy.ts` adds the tag as the first thing in the head of the built page only, so the dev server (inline hot-reload scripts, a socket) is unaffected. `404.html` is a copy of the built page, so it has the tag too. Meta tags ignore `frame-ancestors`, so that directive is left out. Adding a third-party script, font or analytics later means editing the plugin first.
- **Checked:** in a built copy and on the live site: no violations while using the style panel, lazy fonts, carousel and video player; an injected inline script and an inline `style` attribute were blocked.

## FEAT-17: Ice as the default accent

- **Merged:** 2026-10-30, [PR #56](https://github.com/ParseTK/ParseTK.github.io/pull/56) and [PR #57](https://github.com/ParseTK/ParseTK.github.io/pull/57)
- **What:** a first-time visitor gets the Ice accent, and Ice is the first accent in the style panel. The favicon, touch icon and share card were recolored to match.
- **Why:** the default look should be the one chosen for the site.
- **How:** `DEFAULT_SELECTION.accent` and the order of `ACCENTS` in `src/style/registry.ts`; the fallback colors in `src/index.css` are Ice's, so there is no orange flash before the saved style loads (an existing test fails if the two drift). `public/favicon.svg` and `scripts/brand/share-card.html` were recolored and the PNG and ICO files re-rendered with `npm run brand`. Visitors who picked an accent keep it.

## FEAT-16: Tooltips on icon-only controls

- **Merged:** 2026-10-30, [PR #51](https://github.com/ParseTK/ParseTK.github.io/pull/51)
- **What:** controls that are only an icon (the style button, the carousel arrows and dots, the GitHub icon on a card) show a short label on hover and on keyboard focus.
- **Why:** an icon alone does not say what it does. Controls that already show text get no tooltip.
- **How:** a `Tooltip` component that is visual only (the control keeps its own accessible name), shown on mouse hover and keyboard focus, and dismissed with Escape from a window-level listener.

## FEAT-15: Left-aligned headings, About me, contact layout and section order

- **Merged:** 2026-10-30, [PR #50](https://github.com/ParseTK/ParseTK.github.io/pull/50)
- **What:** section headings are left aligned with a small orange label above (ABOUT ME, PROJECTS, TECHNICAL SKILLS, CONTACT). The section order is About, Projects, Skills, Contact, and the navigation and the hero's Scroll cue follow it. Contact lists LinkedIn and GitHub side by side, with no email address. The résumé download sits in the hero next to View My Projects.
- **Why:** matches the prototype, and keeps an email address off a public page.
- **How:** `SectionHeading` takes a `kicker`, `title` and optional `description`; `src/data/sections.ts` drives the page, the desktop nav, the phone menu and the Scroll cue, so they cannot drift apart; `src/data/contact.ts` and `src/data/resume.ts` hold the data.
- **See also:** [FEAT-12](#feat-12-section-order-scroll-and-top-cues-and-scroll-reveals).

## FEAT-14: Prettier and a real README

- **Merged:** 2026-10-30, [PR #45](https://github.com/ParseTK/ParseTK.github.io/pull/45), [PR #46](https://github.com/ParseTK/ParseTK.github.io/pull/46), [PR #47](https://github.com/ParseTK/ParseTK.github.io/pull/47)
- **What:** two unused packages were removed, the project was formatted once with Prettier (4 spaces, double quotes, semicolons, width 120), and the Vite template README was replaced.
- **Why:** consistent formatting, checked by CI, and a README that says how the project works.
- **How:** `.prettierrc.json`, a `format:check` step in the workflow, and `.git-blame-ignore-revs` so the one-time reformat is hidden from `git blame`.

## FEAT-13: Favicon, share image, search tags and a real 404 page

- **Merged:** 2026-10-30, [PR #44](https://github.com/ParseTK/ParseTK.github.io/pull/44)
- **What:** a TK monogram favicon and touch icon, a 1200x630 share image, canonical address, Open Graph and Twitter tags, a small `Person` data block, `robots.txt` and a sitemap, a styled not-found page for mistyped addresses, and a browser bar color that follows the mode.
- **Why:** a proper link preview and search listing, and no generic GitHub 404.
- **How:** brand images in `public/` are rendered from `scripts/brand/` by `npm run brand` (Edge or Chrome needed; CI does not run it); `vite-plugins/spa-fallback.ts` writes `404.html` as a copy of the built page; each mode in the registry has a `themeColor` that is saved with the style and replayed before first paint.
- **See also:** [BUG-13](bug-log.md#bug-13-generic-github-404-page-for-mistyped-addresses).

## FEAT-12: Section order, Scroll and Top cues, and scroll reveals

- **Merged:** 2026-10-30, [PR #43](https://github.com/ParseTK/ParseTK.github.io/pull/43)
- **What:** one registry sets the section order for the page and navigation. The hero's Scroll is a real link to the first section and a Top button sits at the very bottom. Headings and content fade up the first time they come into view.
- **Why:** navigation and page order should not drift apart, and a hidden or invisible control should not be reachable.
- **How:** `ScrollCue` is shared by both cues (a link down, a button up with a mirrored bounce); `Reveal` uses an `IntersectionObserver` and shows content at once when there is no observer or reduced motion is on, so content is never left hidden.

## FEAT-11: Shared frame, chip and heading, About timeline, contact update

- **Merged:** 2026-10-30, [PR #42](https://github.com/ParseTK/ParseTK.github.io/pull/42)
- **What:** Skills, About, Contact and the project cards use shared `Frame`, `Chip` and `SectionHeading` pieces. The three generic About cards became a timeline (Elms College, the internship, STCC). Discord was replaced by GitHub in Contact.
- **Why:** reuse rather than four hand-written copies, and a timeline says more than generic cards.
- **How:** the `frame` and `chip` utilities in `src/index.css`; timeline data in `src/data/timeline.ts`. No dates were added, because none were provided.

## FEAT-10: Circular 3D project carousel

- **Merged:** 2026-10-30, [PR #41](https://github.com/ParseTK/ParseTK.github.io/pull/41)
- **What:** each category tab shows its projects as a circular carousel: the active card in the centre, neighbours turned away behind it.
- **Why:** shows several projects in a small space, with a feel closer to the prototype than a grid.
- **How:** a generic `Carousel` (pure position math in `carousel/math.ts`, live pointer drag that settles on the nearest card with a velocity nudge, arrows, Left and Right keys, tap a side card to centre it, dots and an "n of N" status). A labelled region with a slide group per card; side cards are `inert` and hidden from assistive technology; page scrolling still works through vertical movement (`touch-action: pan-y`). Later changes: dots became real buttons ([BUG-14](bug-log.md#bug-14-carousel-shifted-sideways-when-changing-project-tabs)).

## FEAT-9: Typed project data and category tabs

- **Merged:** 2026-10-30, [PR #40](https://github.com/ParseTK/ParseTK.github.io/pull/40)
- **What:** projects live in one typed list with categories shown as tabs (Python, Applications, JavaScript, Java, C#, Scripts, Other). Each tab is topped up to five cards with "Coming soon" cards until real projects fill it.
- **Why:** adding a project is one entry, and a typo in a category fails to compile.
- **How:** `src/data/projects.ts` (`PROJECT_CATEGORIES`, `CARDS_PER_CATEGORY`, a required alt text for any image); a reusable `Tabs` component with proper tablist behavior (Left and Right wrap, Home and End, one tab in the tab order, the panel named by the selected tab).

## FEAT-8: Canvas stars, accent glows and film grain

- **Merged:** 2026-10-30, [PR #39](https://github.com/ParseTK/ParseTK.github.io/pull/39)
- **What:** a canvas sky replaces hundreds of star elements; two accent glows and a fine film grain sit behind the content.
- **Why:** a single canvas is lighter than hundreds of elements, and the glows and grain follow the chosen accent and mode.
- **How:** three star layers drift at different speeds; the sky is rebuilt only when the width changes (so a phone address bar does not reshuffle it); a mode's `starColor` is `null` for none (Light shows no stars); reduced motion draws one still sky. `Glow` is one reusable component; the grain is generated once on a canvas. Later changes: redraw rate, canvas size and the twinkle range ([BUG-6](bug-log.md#bug-6-stars-jump-while-scrolling-on-a-phone), [BUG-18](bug-log.md#bug-18-slow-response-to-clicks-inp-408-ms)).

## FEAT-7: Style panel

- **Merged:** 2026-10-30, [PR #38](https://github.com/ParseTK/ParseTK.github.io/pull/38)
- **What:** a palette button opens a panel where visitors choose a mode (dark or light), a typeface and an accent, each shown as a preview, with a reset.
- **Why:** replaces the sun and moon button with more choice, saved for the next visit.
- **How:** one typed registry (`src/style/registry.ts`) holds the modes, typefaces and accents, so adding an option is one entry. The panel uses real radio inputs; the choice and its resolved CSS variables are saved under `style` and replayed before first paint by `public/theme-init.js`. Fonts are self-hosted and load when needed. A popover on desktop and a full-screen sheet on phones; only one overlay is open at a time.

## FEAT-6: Shared overlay hook and external link component

- **Merged:** 2026-10-30, [PR #30](https://github.com/ParseTK/ParseTK.github.io/pull/30)
- **What:** `useOverlay` (Escape closes, focus returns, scroll locks) and `ExternalLink` (new tab, `noopener noreferrer`, a screen reader notice).
- **Why:** the style panel and the project cards needed the behavior the phone menu already had, and every new-tab link repeated the same attributes by hand. No change in behavior.

## FEAT-5: Dependency and tooling upgrades

- **Merged:** 2026-10-30, [PR #21](https://github.com/ParseTK/ParseTK.github.io/pull/21), [PR #32](https://github.com/ParseTK/ParseTK.github.io/pull/32), [PR #37](https://github.com/ParseTK/ParseTK.github.io/pull/37), and Dependabot's [#22](https://github.com/ParseTK/ParseTK.github.io/pull/22) to [#26](https://github.com/ParseTK/ParseTK.github.io/pull/26)
- **What:** dependencies updated until `npm audit` was clean; the GitHub Actions moved to their current versions; Vite 8 with the React plugin 6; ESLint 10 with react-hooks 7. TypeScript 7 and the Node 26 types are held back.
- **Why:** security fixes, and the pieces that must move together (Vite 8 and the React plugin) do.
- **How:** `.github/dependabot.yml` groups minor and patch updates weekly and ignores major updates for `typescript` and `@types/node` (TypeScript 7 is not supported by `typescript-eslint`, and CI runs Node 22). React 19.3 made the bundle about 13% larger; it was left.
- **See also:** [BUG-12](bug-log.md#bug-12-dependabot-major-upgrades-could-not-be-merged-one-by-one), [BUG-19](bug-log.md#bug-19-lucide-icon-upgrade-broke-the-build).

## FEAT-4: Automated tests and CI

- **Merged:** 2026-10-30, [PR #20](https://github.com/ParseTK/ParseTK.github.io/pull/20)
- **What:** 30 tests that describe how the site behaves, run by CI on every pull request.
- **Why:** a safety net before anything visual changed. The production bundle was identical before and after.
- **How:** Vitest, React Testing Library, jest-dom, jsdom and axe (all dev-only). They cover page structure, the phone menu, scroll cues, the theme, the stars, skills, links and images, and an accessibility check at desktop and phone width. The count has grown since (339 at the latest merge).

## FEAT-3: Full-width header with the theme toggle in the row

- **Merged:** 2026-10-29, [PR #12](https://github.com/ParseTK/ParseTK.github.io/pull/12)
- **What:** the header spans the full width with even side padding, and the theme toggle is part of the row instead of floating in a corner. The toggle was later replaced by the style panel ([FEAT-7](#feat-7-style-panel)).
- **Why:** on a 2000px-wide monitor the logo sat 257px from the left edge and the last link was 255px from the toggle, and on a phone the toggle floated over page text.

## FEAT-2: Skills as grouped tags, collapsible on phones

- **Merged:** 2026-10-29, [PR #7](https://github.com/ParseTK/ParseTK.github.io/pull/7)
- **What:** the percentage bars and filter became eight groups of plain tags (Languages, Frameworks & Runtimes, APIs, Data & Persistence, Testing & Delivery, Developer Tools, Game Development, Practices). On phones each group is a collapsible `<details>` with the first open.
- **Why:** the phone section was 4,044px tall before and 1,170px after (first group open), and the groups match the résumé.
- **How:** data in `src/data/skills.ts`, rendered by `SkillsSection`; the skills match the résumé.

## FEAT-1: Dark-default theme, accessibility baseline and automatic deploy

- **Merged:** 2026-10-28, [PR #1](https://github.com/ParseTK/ParseTK.github.io/pull/1), with the theme script moved to its own file in [PR #2](https://github.com/ParseTK/ParseTK.github.io/pull/2)
- **What:** dark by default, applied before first paint; a skip link and a `main` landmark; a keyboard and screen reader safe phone menu; visible focus; reduced-motion and forced-colors handling; and a GitHub Actions workflow that checks, builds and deploys to GitHub Pages.
- **Why:** the starting point for everything after it: contrast measured at 4.5:1 or better, and every push to `master` deploying the same way.
- **How:** `.github/workflows/deploy.yml` (pull requests run the checks, a push to `master` deploys); `public/theme-init.js` is a small blocking script that sets the theme before the page paints.
- **See also:** [BUG-1](bug-log.md#bug-1-flash-of-light-theme-and-light-default), [BUG-2](bug-log.md#bug-2-missing-theme-colors-dead-links-and-class-name-typos).
