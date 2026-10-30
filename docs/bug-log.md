# Bug log

Resolved bugs only, newest first. Each entry has the merge date (UTC), the pull request that fixed it, what was seen, the cause, the fix and how it was checked.

Add an entry in a small `doc/` pull request after the fixing pull request merges, so the PR number and date are final. Describe the bug in the fixing pull request's body too.

## Buttons showed the plain arrow cursor instead of the hand

- **Fixed:** 2026-10-30, [PR #59](https://github.com/ParseTK/ParseTK.github.io/pull/59)
- **Seen:** hovering the bouncing Scroll arrow showed the hand, but the Top arrow at the bottom showed the plain arrow cursor even though it could be pressed. The palette and phone menu buttons did the same.
- **Cause:** the Scroll cue is a link and the Top cue is a button. Tailwind's reset gives buttons the plain arrow cursor but leaves links with the hand. Measured on the live site: Scroll `pointer`, Top, palette and menu `default`.
- **Fix:** one base rule in `index.css` gives every enabled button (and `role="button"` element) `cursor: pointer`. Utility classes still win, so the carousel's grab cursors are unchanged, and disabled buttons keep the plain cursor.
- **Checked:** in the production build the computed cursor is `pointer` for Top, Scroll, palette, menu, a project tab and a carousel dot. A test checks the rule. The hand icon on a real mouse hover was not recorded at merge time.

## Lucide icon upgrade broke the build

- **Fixed:** 2026-10-30, [PR #55](https://github.com/ParseTK/ParseTK.github.io/pull/55), which replaced Dependabot's failing [PR #54](https://github.com/ParseTK/ParseTK.github.io/pull/54)
- **Seen:** Dependabot's bump of `lucide-react` from 0.544 to 1.62 failed the `build` check with 28 failing tests.
- **Cause:** lucide-react 1.x removed its brand logos, so `Github` and `Linkedin` were `undefined` and rendering the contact section and project cards threw. The other icons the site uses still exist.
- **Fix:** `lucide-react` 1.62 plus a small `BrandIcons.tsx` with the GitHub and LinkedIn logos as inline SVGs that take the same size and class props as a lucide icon. Nothing looks different.
- **Checked:** 311 tests (2 new), lint, types, format check, build and `npm audit` (0 vulnerabilities). #54 was closed after the merge.

## Slow response to clicks (INP 408 ms)

- **Fixed:** 2026-10-30, [PR #53](https://github.com/ParseTK/ParseTK.github.io/pull/53)
- **Seen:** Chrome's local Interaction to Next Paint was 408 ms ("needs improvement"). Clicks on the palette button and even on plain hero text took 224-408 ms.
- **Cause:** measured in a browser with no extensions, script time per click was small (5-9 ms for the palette button, none for plain text); the wait was for the next frame to be drawn. The star canvas redrew the full screen about 60 times a second forever, the nav blurred what was behind it on every frame, and opening a panel re-rendered every section of the page.
- **Fix:** the stars redraw about 15 times a second (scrolling still redraws at once), the star canvas is capped at about 3 million pixels, the nav blurs only once the page has scrolled under it, and the sections and background pieces are skipped when a panel opens (`memo`).
- **Checked:** on the same machine and the same six clicks, canvas redraws fell from 59.9 to 15 a second and clicks slower than 16 ms from 6 of 6 to 2 of 6. Undoing each change made its tests fail. After the deploy the site owner measured INP 48 ms, then 8 ms on a second run, with LCP 0.38 s and CLS 0.02.

## Project tabs sat on the left instead of centred

- **Fixed:** 2026-10-30, [PR #52](https://github.com/ParseTK/ParseTK.github.io/pull/52)
- **Seen:** after the left-aligned headings change, the project tabs (Python, Applications, JavaScript, ...) sat on the left while the carousel and its controls below them are centred.
- **Cause:** the tab row's centring was removed along with the heading's. The headings are meant to be left aligned; the tabs belong to the centred carousel.
- **Fix:** the tab row is centred at every width, and on a phone each wrapped line is centred on its own.
- **Checked:** in the production build the single row of seven tabs has 166px on each side on desktop; at 375px the three wrapped rows each have equal space left and right and nothing overflows sideways. Putting the left alignment back made a test fail.

## Hero crushed on a phone held sideways

- **Fixed:** 2026-10-30, [PR #49](https://github.com/ParseTK/ParseTK.github.io/pull/49)
- **Seen:** with the phone turned sideways, "Hello, I'm Tyler" ended up under the nav bar and the bouncing Scroll cue sat under the "View My Projects" button.
- **Cause:** the hero is exactly one screen tall and centres its content. A sideways phone is about 375px high, less than the content plus the nav bar and the cue, so everything overlapped. Measured at 812x375: the nav ended at y=86 but the heading started at y=72, and the cue (y=291-343) overlapped the button (y=274-310).
- **Fix:** the hero has top and bottom padding for the nav and the cue and still fills at least one screen. On a tall screen nothing changes; on a short one the hero grows and the page scrolls.
- **Checked:** at 812x375 the heading starts at y=112 (nav ends at 87) and the cue at y=382 (buttons end at 362). No horizontal overflow at 812x375, 375x812 and desktop. A physical phone check was not recorded at merge time.

## Back to Top and Scroll arrows could not be pressed

- **Fixed:** 2026-10-30, [PR #49](https://github.com/ParseTK/ParseTK.github.io/pull/49)
- **Seen:** only the "Top" text could be pressed, not its bouncing arrow. The hero's Scroll cue had the same problem.
- **Cause:** the arrow bounces and the button was barely bigger than the arrow. When the arrow moved out from under a still pointer between press and release, the two landed on different elements and the browser did not count a click on the button.
- **Fix:** the cue's padding is larger than the bounce (8px against the 5px the arrow moves), so the arrow can never leave the control.
- **Checked:** in the browser with the arrow frozen at the extreme of its bounce, it stays inside the control for both cues. A test fails if the old padding comes back. A physical touch check was not recorded at merge time.

## Carousel shifted sideways when changing project tabs

- **Fixed:** 2026-10-30, [PR #48](https://github.com/ParseTK/ParseTK.github.io/pull/48)
- **Seen:** choosing a project tab moved the whole carousel sideways (right when starting on Python, left when starting on Other).
- **Cause:** choosing a tab scrolled the clicked tab to the middle of the screen (`scrollIntoView`). The page container hid its sideways overflow (`overflow-x: hidden`), which scripts can still scroll, so the page itself slid. Measured: the container scrolled 256px and the carousel moved from x=48 to x=-208.
- **Fix:** tabs no longer scroll anything into view, and the page container clips (`overflow-x: clip`), which cannot be scrolled at all.
- **Checked:** going Python, Other, Python leaves the carousel at x=48 and the container scroll at 0. Putting back `overflow-x-hidden` or the `scrollIntoView` call each made a test fail. A phone check was not recorded at merge time.

## Generic GitHub 404 page for mistyped addresses

- **Fixed:** 2026-10-30, [PR #44](https://github.com/ParseTK/ParseTK.github.io/pull/44)
- **Seen:** a mistyped address showed GitHub Pages' own generic 404 page instead of the site's styled "Page not found" page.
- **Cause:** GitHub Pages serves its own 404 for any address the single-page app was not loaded on.
- **Fix:** the build writes `404.html` as an exact copy of the app page (`vite-plugins/spa-fallback.ts`), so an unknown address loads the app, which shows the styled not-found page with the real 404 status and its own tab title ("Page not found | Tyler Kirchner"). The plugin fails the build if there is nothing to copy.
- **Checked:** in the production build `404.html` is byte-identical to `index.html`, and `/404.html` shows the not-found page with its own title. Tests cover the plugin, the page and its title. The live behaviour on GitHub Pages was not recorded at merge time.

## Dependabot major upgrades could not be merged one by one

- **Fixed:** 2026-10-30, [PR #32](https://github.com/ParseTK/ParseTK.github.io/pull/32)
- **Seen:** Dependabot's separate pull requests for Vite 8 (#29, conflicting, CI failing) and the React plugin 6 (#27) could not be merged on their own, and the TypeScript 7 (#31) and Node types 26 (#28) pull requests kept coming back.
- **Cause:** the React plugin 6 requires Vite 8 as a peer dependency, so the two only work together. `typescript-eslint` supports TypeScript `>=4.8.4 <6.1.0`, so TypeScript 7 would break linting, and CI and deploy run Node 22, so the Node types should not jump to 26.
- **Fix:** Vite 7.3.7 to 8.3.5 and the React plugin 5.0.3 to 6.1.2 in one pull request, with no source or config changes. `.github/dependabot.yml` now ignores major updates for `typescript` and `@types/node`.
- **Checked:** tests, lint, `tsc -b && vite build`, `npm audit` (0 vulnerabilities) and `npm ci --dry-run` passed; the dev server started and the built site loaded in a browser with no new console errors. The pull request's CI result and a click-through of the live site after deploy were not recorded in its description.

## Email link had a space after mailto:

- **Fixed:** 2026-10-29, [PR #18](https://github.com/ParseTK/ParseTK.github.io/pull/18)
- **Seen:** the contact email link was `mailto: kirchnertyler@gmail.com`. Some mail apps open a draft addressed to a blank-prefixed address, or do not open a draft at all.
- **Cause:** a space is not valid in a `mailto:` URL.
- **Fix:** `mailto:kirchnertyler@gmail.com`. The visible text is unchanged.
- **Checked:** the built bundle contains the clean link and no spaced `mailto: `. Clicking it in a mail app on a phone or computer was not recorded at merge time.

## Scroll hint stayed visible after scrolling

- **Fixed:** 2026-10-29, [PR #16](https://github.com/ParseTK/ParseTK.github.io/pull/16)
- **Seen:** the bouncing "Scroll" text and arrow at the bottom of the hero stayed visible after the visitor had started scrolling.
- **Cause:** the hint was always rendered and nothing tracked scroll position for it.
- **Fix:** the hint fades out once the page is scrolled more than 40px and returns at the top. Scroll tracking moved into a shared `useScrolledPast` hook, also used by the navbar.
- **Checked:** visible at 0px and 20px, hidden at 60px and 900px, visible again back at the top, and the navbar background still switches on and off. Scroll events were dispatched by hand because the test browser does not fire them for programmatic scrolling. A physical phone check was not recorded at merge time.

## Nav lagged behind the page when switching theme

- **Fixed:** 2026-10-29, [PR #14](https://github.com/ParseTK/ParseTK.github.io/pull/14)
- **Seen:** switching between light and dark made the nav bar look slow to change, most noticeably when scrolled down.
- **Cause:** the page changed at inconsistent speeds. Section backgrounds, headings and cards changed instantly, but `body` (`transition-colors duration-300`) and the nav (`transition-all duration-300`) faded over 300ms. The nav only has a background once scrolled, so for about 300ms it sat in the old theme's color over an already-switched page.
- **Fix:** the theme toggle adds a temporary `theme-switching` class to `<html>` that disables transitions for that one switch, so the whole page changes in one step. The `body` fade was removed.
- **Checked:** scrolled to 1500px, the page background, nav background, section background, headings and logo colors were identical at 0ms, 60ms and 360ms after switching, in both directions. The fade itself was not watched, because the test browser does not run CSS transitions on a hidden pane. Physical phone and large monitor checks were not recorded at merge time.

## Scroll arrow cut off on Android at landing

- **Fixed:** 2026-10-29, [PR #13](https://github.com/ParseTK/ParseTK.github.io/pull/13)
- **Seen:** on an Android phone the bouncing scroll arrow at the bottom of the hero was partly hidden when landing on the page.
- **Cause:** the hero used `min-h-screen` (`100vh`). On Android Chrome `100vh` is the height with the address bar hidden. At landing the address bar is showing, so the visible area is shorter than the hero and the arrow, 32px above the hero's bottom edge, was cut off.
- **Fix:** `min-h-svh`, the small viewport height (address bar showing), so the hero fits the visible area at landing.
- **Checked:** the built CSS contains `min-height: 100svh`, and the hero equals the viewport height with the arrow fully visible at 375x700 and 1366x768. A desktop emulator has no address bar, so the cut-off itself could not be reproduced; a physical phone check was not recorded at merge time.

## Mobile menu covered only the top of the screen after scrolling

- **Fixed:** 2026-10-29, [PR #10](https://github.com/ParseTK/ParseTK.github.io/pull/10)
- **Seen:** on a phone, opening the hamburger menu after scrolling showed the menu links printed over the page text instead of a full black screen. At the top of the page it looked right.
- **Cause:** once scrolled, the nav gets `backdrop-blur`. A `position: fixed` element inside a blurred element is sized to that element, not the screen, so the overlay shrank to the nav bar's height (measured 812px at the top, 64px when scrolled).
- **Fix:** the menu is a sibling of the nav instead of a child, with a solid background. While open, the page content is inert, background scroll is locked, Escape closes it and returns focus to the menu button, and it closes if the window grows to desktop size.
- **Checked:** in a desktop browser with the nav blur active the overlay is the full 812px; keyboard, link click and resize behaviour tested. Physical phone and screen reader checks were not recorded at merge time.

## Stars jump while scrolling on a phone

- **Fixed:** 2026-10-29, [PR #8](https://github.com/ParseTK/ParseTK.github.io/pull/8)
- **Seen:** the star background visibly shifts while scrolling on mobile.
- **Cause:** `StarBackground` regenerated every star at a new random position on every `resize` event. Phone browsers fire `resize` when the address bar slides in or out during scrolling. The star layer was also `fixed inset-0`, so its height changed with the address bar.
- **Fix:** stars regenerate only when the window width changes, and the layer uses `h-lvh` so its height stays constant.
- **Checked:** repeated same-width resize events leave star positions unchanged; a real width change still reshuffles them. Confirmed on a physical Android phone by the site owner after the deploy.

## Hero name read as "TylerKirchner"

- **Fixed:** 2026-10-29, [PR #5](https://github.com/ParseTK/ParseTK.github.io/pull/5)
- **Seen:** the heading had no space between the first and last name, so screen readers and reader mode read it as one word.
- **Cause:** the two name spans were separated only by a CSS margin.
- **Fix:** a real space between the spans.
- **Checked:** the built page's heading text reads "Hello, I'm Tyler Kirchner".

## Résumé button linked to a missing file

- **Fixed:** 2026-10-29, [PR #5](https://github.com/ParseTK/ParseTK.github.io/pull/5)
- **Seen:** "Download CV" returned a 404 (`/cv.pdf`).
- **Fix:** the résumé PDF is in `public/` and the button links to it. The PDF's LinkedIn text and link were corrected at the same time.
- **Checked:** the link returns 200 as `application/pdf`.

## HomeScreen card linked to a renamed repository

- **Fixed:** 2026-10-29, [PR #5](https://github.com/ParseTK/ParseTK.github.io/pull/5)
- **Seen:** the link only worked through a GitHub redirect from the old repository name.
- **Fix:** link to `ParseTK/ParseTK.github.io`.

## Missing theme colors, dead links and class-name typos

- **Fixed:** 2026-10-28, [PR #1](https://github.com/ParseTK/ParseTK.github.io/pull/1)
- **Seen:** muted text, skill tracks and the name gradient looked wrong or did nothing, project links went nowhere, and several sections ignored their styling.
- **Cause:** the code used color tokens and utilities that were never defined (`secondary`, `muted-foreground`, `input`, `text-gradient`), project URLs started with `#`, and class names were misspelled (for example `conainer`, `rounder-md`, `max-2-2xl`).
- **Fix:** defined the tokens and utilities, corrected the URLs and class names.

## Flash of light theme and light default

- **Fixed:** 2026-10-28, [PR #1](https://github.com/ParseTK/ParseTK.github.io/pull/1); the script moved to its own file on 2026-10-29 in [PR #2](https://github.com/ParseTK/ParseTK.github.io/pull/2)
- **Seen:** the page defaulted to light, and switching to dark would flash light on load.
- **Fix:** dark is the default and a small blocking script sets the theme before first paint.
