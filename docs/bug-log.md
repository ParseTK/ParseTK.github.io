# Bug log

One entry per bug: what the visitor saw, the cause, the fix and the pull request that fixed it. Newest first. Dates are the day the fix was merged (UTC).

Add an entry in the same pull request that fixes the bug, and describe the bug in the pull request body too. Open bugs go under "Open" until they are fixed.

## Open

| Reported | Bug | Notes |
|---|---|---|
| 2026-10-29 | The email link in the contact section is `mailto: kirchnertyler@gmail.com` with a space after `mailto:`. | Some mail apps open a draft addressed to a blank-prefixed address or fail. Fix is removing the space in `ContactSection.tsx`. |

## Fixed

### Stars jump while scrolling on a phone
- **Fixed:** 2026-10-29, [PR #8](https://github.com/ParseTK/ParseTK.github.io/pull/8) (open at time of writing; update the date when merged)
- **Seen:** the star background visibly shifts while scrolling on mobile.
- **Cause:** `StarBackground` regenerated every star at a new random position on every `resize` event. Phone browsers fire `resize` when the address bar slides in or out during scrolling. The star layer was also `fixed inset-0`, so its height changed with the address bar.
- **Fix:** stars regenerate only when the window width changes, and the layer uses `h-lvh` so its height stays constant.
- **Verified:** repeated same-width resize events leave star positions unchanged; a real width change still reshuffles them. Not yet confirmed on a physical phone.

### Hero name read as "TylerKirchner"
- **Fixed:** 2026-10-29, [PR #5](https://github.com/ParseTK/ParseTK.github.io/pull/5)
- **Seen:** the heading text had no space between the first and last name, so screen readers and reader mode read it as one word.
- **Cause:** the two name spans were separated only by a CSS margin.
- **Fix:** a real space between the spans.

### Résumé button linked to a missing file
- **Fixed:** 2026-10-29, [PR #5](https://github.com/ParseTK/ParseTK.github.io/pull/5)
- **Seen:** "Download CV" returned a 404 (`/cv.pdf`).
- **Fix:** the résumé PDF is in `public/` and the button links to it. The PDF's LinkedIn text and link were corrected at the same time.

### HomeScreen card linked to a renamed repository
- **Fixed:** 2026-10-29, [PR #5](https://github.com/ParseTK/ParseTK.github.io/pull/5)
- **Seen:** the link only worked through a GitHub redirect from the old repository name.
- **Fix:** link to `ParseTK/ParseTK.github.io`.

### Missing theme colors, dead links and class-name typos
- **Fixed:** 2026-10-28, [PR #1](https://github.com/ParseTK/ParseTK.github.io/pull/1)
- **Seen:** muted text, skill tracks and the name gradient looked wrong or did nothing; project links went nowhere; several sections ignored their styling.
- **Cause:** the code used color tokens and utilities that were never defined (`secondary`, `muted-foreground`, `input`, `text-gradient`), project URLs started with `#`, and class names were misspelled (for example `conainer`, `rounder-md`, `max-2-2xl`).
- **Fix:** defined the tokens and utilities, corrected the URLs and class names.

### Flash of light theme and wrong default
- **Fixed:** 2026-10-28, [PR #1](https://github.com/ParseTK/ParseTK.github.io/pull/1), with the script moved to its own file in [PR #2](https://github.com/ParseTK/ParseTK.github.io/pull/2)
- **Seen:** the page defaulted to light, and dark mode would have flashed light on load.
- **Fix:** dark is the default and a small blocking script sets the theme before first paint.
