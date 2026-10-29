# Bug log

Resolved bugs only, newest first. Each entry has the merge date (UTC), the pull request that fixed it, what was seen, the cause, the fix and how it was checked.

Add an entry in a small `doc/` pull request after the fixing pull request merges, so the PR number and date are final. Describe the bug in the fixing pull request's body too.

## Stars jump while scrolling on a phone
- **Fixed:** 2026-10-29, [PR #8](https://github.com/ParseTK/ParseTK.github.io/pull/8)
- **Seen:** the star background visibly shifts while scrolling on mobile.
- **Cause:** `StarBackground` regenerated every star at a new random position on every `resize` event. Phone browsers fire `resize` when the address bar slides in or out during scrolling. The star layer was also `fixed inset-0`, so its height changed with the address bar.
- **Fix:** stars regenerate only when the window width changes, and the layer uses `h-lvh` so its height stays constant.
- **Checked:** repeated same-width resize events leave star positions unchanged; a real width change still reshuffles them. Not confirmed on a physical phone at merge time.

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
