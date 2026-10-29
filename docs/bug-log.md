# Bug log

Resolved bugs only, newest first. Each entry has the merge date (UTC), the pull request that fixed it, what was seen, the cause, the fix and how it was checked.

Add an entry in a small `doc/` pull request after the fixing pull request merges, so the PR number and date are final. Describe the bug in the fixing pull request's body too.

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
