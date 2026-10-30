# Tyler Kirchner | Software Developer Portfolio

Source for [parsetk.github.io](https://parsetk.github.io): a single-page portfolio with project categories shown in a 3D carousel, a skills overview, an About timeline and contact links. Visitors can switch mode (dark or light), typeface and accent color from the palette button in the navigation.

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Lucide icons, self-hosted fonts from Fontsource. Tests use Vitest, Testing Library and axe. Formatting is Prettier and linting is ESLint. It deploys to GitHub Pages from GitHub Actions.

## Getting started

Needs Node 22 (the version CI uses).

```bash
npm ci
npm run dev
```

| Script            | What it does                                                   |
| ----------------- | -------------------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload                                     |
| `npm test`        | Runs every test once (`npm run test:watch` to keep it running) |
| `npm run lint`    | ESLint                                                         |
| `npm run format`  | Formats everything with Prettier (`format:check` only checks)  |
| `npm run build`   | Type-checks, then builds into `dist/` (also writes `404.html`) |
| `npm run preview` | Serves the production build locally                            |
| `npm run brand`   | Re-renders the favicon files and share image (see Images)      |

## Where things live

```text
src/
  Pages/         Home (the whole page) and NotFound
  Components/    Sections and shared pieces (Frame, Chip, Tabs, Reveal, ScrollCue, ...)
    carousel/    The 3D carousel and its pure math
    Style/       The style panel (mode, typeface, accent)
    lib/         Small hooks
  data/          What the page says: projects, skills, timeline, contact, section order
  style/         The registry of modes, typefaces and accents, and where the choice is saved
  background/    Star field and film grain
  test/          Test helpers (fake canvas, media queries, contrast)
public/          Files served as they are: icons, share image, robots.txt, sitemap.xml, résumé
scripts/brand/   Sources for the favicon and share image
vite-plugins/    The build step that writes 404.html
docs/            bug-log.md
```

## Changing the content

Content is data, kept apart from the components that show it.

| To change...            | Edit                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Projects and their tabs | `src/data/projects.ts` (`liveProjects`, `PROJECT_CATEGORIES`)                             |
| Skill groups            | `src/data/skills.ts`                                                                      |
| About timeline          | `src/data/timeline.ts`                                                                    |
| Contact links           | `src/data/contact.ts` (the structured data in `index.html` should list the same profiles) |
| Section order and nav   | `src/data/sections.ts` (a new section also needs a view in `SECTION_VIEWS` in `Home.tsx`) |
| Page title, description | `index.html` (a test keeps the share tags, canonical address and sitemap in step)         |

**Project thumbnails.** Put a 16:9 image in `public/projects/` (create the folder) and add `image: { src, alt }` and `videoUrl` to the project. The image then links to the video with a play badge. Alt text is required. Until then every card shows the same empty 16:9 slot, so real and "coming soon" cards stay the same shape.

**"Coming soon" cards.** Each tab is topped up to `CARDS_PER_CATEGORY` cards with placeholders. They disappear one by one as real projects are added; set it to `0` to show only real projects.

## Style options

Modes, typefaces and accents each live in one list in `src/style/registry.ts`. Adding an option is one entry; the panel, saving and the before-first-paint script pick it up.

- **Accent**: give it a dark and a light color. A test checks every accent against the page and card colors in both modes (4.5:1 minimum) and fails if one is too faint.
- **Typeface**: add a Fontsource package, then an entry whose `load` imports it. Fonts download only when chosen or when the panel opens.
- **Mode**: needs its color tokens in `src/index.css` as well. A test checks the defaults in the CSS against the registry.

The choice is saved in `localStorage` together with the values it resolved to, and `public/theme-init.js` replays them before the page paints, so there is no flash.

## Images

`public/favicon.svg` is the only hand-edited image source. `npm run brand` renders `og-image.png`, `apple-touch-icon.png` and `favicon.ico` from it and from `scripts/brand/share-card.html`. It needs Microsoft Edge or Chrome (set `BROWSER_PATH` for another browser), and on Windows it has been more reliable from PowerShell than from Git Bash. The generated files are committed, so CI does not need a browser.

## Accessibility

Built to work with a keyboard, a screen reader and reduced motion:

- Real links and buttons, a skip link, visible focus, 44px minimum targets, and menus and the carousel that hide what is out of reach (`inert`).
- Reduced motion is honored everywhere: no star twinkle or drift, a flat carousel, and no scroll reveals.
- Meaning never relies on color alone, and accent contrast is tested.
- Icon-only controls (the palette button, carousel arrows and dots, the GitHub icon on a card) show a small label on mouse hover and keyboard focus, and Escape hides it. The label is for the eye only: each control already has an accessible name, so it is not read twice. Touch screens have no hover, so they do not show it.
- Tests run axe against each section and the page.

## Quality checks and deployment

Every pull request runs formatting, lint, tests and a build ([`deploy.yml`](.github/workflows/deploy.yml)); a push to `master` deploys the result to GitHub Pages. Dependabot proposes updates weekly, grouping minor and patch ones (`.github/dependabot.yml`).

Because GitHub Pages answers an unknown address with `404.html`, the build writes a copy of the app there, so a mistyped address shows the styled not-found page with a real 404 status.

The built page carries a Content Security Policy in a meta tag (`vite-plugins/content-security-policy.ts`, build only, so the dev server is unaffected): scripts, styles, fonts and requests come only from the site itself, images also from `data:` for the grain texture. It means no inline `<script>`, `<style>` or `style="..."` in `index.html`, no `eval`, and no third-party scripts or fonts without changing that file first. Inline styles set from code (`element.style...`, React's `style` prop) are fine.

## Working on it

- Branch names start with `feature/`, `fix/`, `update/` or `doc/`; commit messages use `feat`, `fix`, `build`, `refactor`, `docs`, `ci` or `test`.
- Changes go through a pull request and are merged with a merge commit. `.git-blame-ignore-revs` hides the one-time Prettier reformat from `git blame` (run `git config blame.ignoreRevsFile .git-blame-ignore-revs` once; GitHub already does this).
- Resolved bugs are recorded in [`docs/bug-log.md`](docs/bug-log.md), in a small `doc/` pull request after the fixing pull request merges.
