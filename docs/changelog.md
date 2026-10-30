# Changelog

Every change that reached the live site, newest first, grouped by the day it merged (UTC). The site deploys on every merge to `master`, so there are no version numbers. The format follows [Keep a Changelog](https://keepachangelog.com): **Added**, **Changed**, **Fixed**, **Removed** and **Security**.

Add the lines for a pull request in a small `doc/` pull request after it merges. One short line per change, with the pull request number. A line about a fix points to its `BUG-n` entry in [`bug-log.md`](bug-log.md) instead of repeating it.

## 2026-10-30

### Added

- Tests and a CI test run ([#20]).
- Style panel: mode, typeface and accent with previews ([#38]).
- Canvas stars, accent glows and film grain ([#39]).
- Typed project data and category tabs ([#40]).
- Circular 3D project carousel ([#41]).
- Shared frame, chip and heading, an About timeline ([#42]).
- Section registry, Scroll and Top cues, scroll reveals ([#43]).
- Favicon, share image, search tags, a styled 404 page and a browser bar color that follows the mode ([#44]).
- Prettier formatting and a real README ([#46], [#47]).
- Tooltips on icon-only controls ([#51]).
- Content Security Policy on the built page ([#62]).
- Five Python projects with demo videos in a pop-out player ([#66]).
- Bug log IDs, starting at `BUG-1` ([#61]).

### Changed

- Shared overlay hook and external link component, with no change in behavior ([#30]).
- Dependencies, Vite 8 with the React plugin 6, ESLint 10 and the GitHub Actions upgraded; TypeScript 7 and the Node 26 types held back ([#21], [#22], [#23], [#24], [#25], [#26], [#32], [#37]).
- Left-aligned headings, an About me section, side-by-side LinkedIn and GitHub in Contact, the résumé download in the hero, and the section order About, Projects, Skills, Contact ([#50]).
- Ice is the default accent and the first in the style panel; favicon, touch icon and share card recolored to match ([#56], [#57]).
- Hero welcome wording, About text and the Skills statement rewritten in plainer words; `SQL (SQL Server)` shown as `SQL` ([#63], [#64], [#65]).
- `lucide-react` 1.62, with the GitHub and LinkedIn logos drawn in the project ([#55]).
- Project cards are solid instead of 70% see-through ([#66]).

### Fixed

- Project tabs sat on the left instead of centred ([#52]; BUG-17).
- Slow response to clicks, INP 408 ms: stars redraw 15 times a second, the nav blurs only when scrolled, sections skip needless re-renders ([#53]; BUG-18).
- Lucide upgrade broke the build ([#55]; BUG-19).
- Buttons showed the plain arrow cursor ([#59]; BUG-20).
- Star twinkle, carousel shift on tab change, unclickable dots, mismatched cards and phone tabs ([#48]; BUG-14).
- Hero crushed on a sideways phone and unpressable arrows; the nav is always a bar ([#49]; BUG-15, BUG-16).
- Dependabot major upgrades that could not merge one by one ([#32]; BUG-12).
- Generic GitHub 404 page for mistyped addresses ([#44]; BUG-13).

### Removed

- Two unused packages ([#45]).
- The email address from Contact, and the PaintJob project ([#50], [#67]).

### Security

- Dependencies updated until `npm audit` reported no vulnerabilities ([#21]).
- Content Security Policy ([#62]).
- Repository settings (not a pull request): CodeQL scanning, Dependabot alerts and security updates, secret scanning with push protection, and a ruleset on `master` that requires a pull request and a passing `build` check and blocks force pushes and deletion.

### Docs

- Bug log entries for the day's fixes, and for the mailto fix from the day before ([#19], [#58], [#60], [#61]).

## 2026-10-29

### Added

- Skills as grouped tags, collapsible on phones ([#7]).
- Bug log ([#9], [#11], [#15], [#17]).

### Changed

- Full-width header with the theme toggle in the row ([#12]).
- The pre-paint theme script moved to `public/theme-init.js` ([#2]).
- Unneeded comments removed and the About section fixed ([#3], [#4]).

### Fixed

- Hero name spacing, a renamed repository link, line endings and the résumé link ([#5]; BUG-3, BUG-4, BUG-5).
- Email in Contact ([#6]) and the stray space after `mailto:` ([#18]; BUG-11).
- Stars jumping while scrolling on a phone ([#8]; BUG-6).
- Phone menu covering only the top of the screen after scrolling ([#10]; BUG-7).
- Scroll arrow cut off on Android at landing ([#13]; BUG-8).
- Nav lagging behind the page when switching theme ([#14]; BUG-9).
- Scroll hint staying visible after scrolling ([#16]; BUG-10).

## 2026-10-28

### Added

- Dark by default with a pre-paint theme script, a skip link, a `main` landmark, visible focus, reduced-motion handling and a GitHub Actions workflow that checks, builds and deploys to GitHub Pages ([#1]).

### Fixed

- The flash of the light theme, missing color tokens, dead project links and class-name typos ([#1]; BUG-1, BUG-2).

[#1]: https://github.com/ParseTK/ParseTK.github.io/pull/1
[#2]: https://github.com/ParseTK/ParseTK.github.io/pull/2
[#3]: https://github.com/ParseTK/ParseTK.github.io/pull/3
[#4]: https://github.com/ParseTK/ParseTK.github.io/pull/4
[#5]: https://github.com/ParseTK/ParseTK.github.io/pull/5
[#6]: https://github.com/ParseTK/ParseTK.github.io/pull/6
[#7]: https://github.com/ParseTK/ParseTK.github.io/pull/7
[#8]: https://github.com/ParseTK/ParseTK.github.io/pull/8
[#9]: https://github.com/ParseTK/ParseTK.github.io/pull/9
[#10]: https://github.com/ParseTK/ParseTK.github.io/pull/10
[#11]: https://github.com/ParseTK/ParseTK.github.io/pull/11
[#12]: https://github.com/ParseTK/ParseTK.github.io/pull/12
[#13]: https://github.com/ParseTK/ParseTK.github.io/pull/13
[#14]: https://github.com/ParseTK/ParseTK.github.io/pull/14
[#15]: https://github.com/ParseTK/ParseTK.github.io/pull/15
[#16]: https://github.com/ParseTK/ParseTK.github.io/pull/16
[#17]: https://github.com/ParseTK/ParseTK.github.io/pull/17
[#18]: https://github.com/ParseTK/ParseTK.github.io/pull/18
[#19]: https://github.com/ParseTK/ParseTK.github.io/pull/19
[#20]: https://github.com/ParseTK/ParseTK.github.io/pull/20
[#21]: https://github.com/ParseTK/ParseTK.github.io/pull/21
[#22]: https://github.com/ParseTK/ParseTK.github.io/pull/22
[#23]: https://github.com/ParseTK/ParseTK.github.io/pull/23
[#24]: https://github.com/ParseTK/ParseTK.github.io/pull/24
[#25]: https://github.com/ParseTK/ParseTK.github.io/pull/25
[#26]: https://github.com/ParseTK/ParseTK.github.io/pull/26
[#30]: https://github.com/ParseTK/ParseTK.github.io/pull/30
[#32]: https://github.com/ParseTK/ParseTK.github.io/pull/32
[#37]: https://github.com/ParseTK/ParseTK.github.io/pull/37
[#38]: https://github.com/ParseTK/ParseTK.github.io/pull/38
[#39]: https://github.com/ParseTK/ParseTK.github.io/pull/39
[#40]: https://github.com/ParseTK/ParseTK.github.io/pull/40
[#41]: https://github.com/ParseTK/ParseTK.github.io/pull/41
[#42]: https://github.com/ParseTK/ParseTK.github.io/pull/42
[#43]: https://github.com/ParseTK/ParseTK.github.io/pull/43
[#44]: https://github.com/ParseTK/ParseTK.github.io/pull/44
[#45]: https://github.com/ParseTK/ParseTK.github.io/pull/45
[#46]: https://github.com/ParseTK/ParseTK.github.io/pull/46
[#47]: https://github.com/ParseTK/ParseTK.github.io/pull/47
[#48]: https://github.com/ParseTK/ParseTK.github.io/pull/48
[#49]: https://github.com/ParseTK/ParseTK.github.io/pull/49
[#50]: https://github.com/ParseTK/ParseTK.github.io/pull/50
[#51]: https://github.com/ParseTK/ParseTK.github.io/pull/51
[#52]: https://github.com/ParseTK/ParseTK.github.io/pull/52
[#53]: https://github.com/ParseTK/ParseTK.github.io/pull/53
[#55]: https://github.com/ParseTK/ParseTK.github.io/pull/55
[#56]: https://github.com/ParseTK/ParseTK.github.io/pull/56
[#57]: https://github.com/ParseTK/ParseTK.github.io/pull/57
[#58]: https://github.com/ParseTK/ParseTK.github.io/pull/58
[#59]: https://github.com/ParseTK/ParseTK.github.io/pull/59
[#60]: https://github.com/ParseTK/ParseTK.github.io/pull/60
[#61]: https://github.com/ParseTK/ParseTK.github.io/pull/61
[#62]: https://github.com/ParseTK/ParseTK.github.io/pull/62
[#63]: https://github.com/ParseTK/ParseTK.github.io/pull/63
[#64]: https://github.com/ParseTK/ParseTK.github.io/pull/64
[#65]: https://github.com/ParseTK/ParseTK.github.io/pull/65
[#66]: https://github.com/ParseTK/ParseTK.github.io/pull/66
[#67]: https://github.com/ParseTK/ParseTK.github.io/pull/67
