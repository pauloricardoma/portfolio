# Handoff: PRMA Code — brand + site + portfolio redesign

## Overview
New brand mark for PRMA Code (software studio) and a redesign of https://prmacode.dev/ (home) and https://prmacode.dev/portfolio, applying the new identity.

## About the design files
Files in `design_files/` are **design references built in HTML** (prototypes of look and behavior), not production code. Recreate them in the existing prmacode.dev codebase (React) using its patterns. Open any `.dc.html` directly in a browser to view (they need `support.js` beside them).
- `PRMA Code Site.dc.html`: home
- `PRMA Code Portfolio.dc.html`: portfolio
- `PRMA Code Logo.dc.html`: logo exploration; the **"Final"** section at the top is the approved mark
- `PRMA Mark.dc.html`: mark component (approved variant = `cursor`)
- `PRMA Direction.dc.html`: logo application sheet (app icon, avatar, favicon, header, OG, business card)

## Fidelity
**High-fidelity.** Final colors, type, spacing and interactions. Recreate pixel-accurately.

## Brand mark — "P with cursor"
A rounded square (radius = 22% of size) with a monospace **P** followed by a terminal-style **underscore cursor** in orange. Meaning: the studio is always building something.
- Geometry (100×100 box): P stem x 25–32.5, y 37–81; bowl outer radius 13 (right edge ≈ x 53), counter radius 6; cursor rect x 61, y 70, 20×8. See `assets/logo-mark-*.svg`.
- Wordmark: "PRMA" Geist 600 + " Code" Geist 400, letter-spacing −0.035em. Gap between mark and wordmark ≈ 0.27× mark height.
- Colorways: dark box `#141413` with `#FAFAF8` P (on light backgrounds) · light box with ink P (on dark) · on orange: ink P with white cursor · one-color: everything in ink.
- Min size: 16px (favicon). The cursor stays orange in every colorway except one-color and on-orange.

## Design tokens
Colors
- Accent orange `#E8743B` (use for marks, cursors, buttons and underlines, not small text on light bg. Button text on orange is `#141413`)
- Light theme: bg `#FAFAF8`, ink `#141413`, muted `#5F5D58`, line `#E4E2DD`, card `#FFFFFF`
- Dark theme: bg `#141413`, ink `#FAFAF8`, muted `#A9A69F`, line `#2C2B29`, card `#1C1B1A`
- The contact section is always dark (`#141413`, body text `#C9C6BF`, label `#A9A69F`, button borders `#3A3936`)

Type: **Geist** (400/500/600) for UI, **Geist Mono** (500/600) for labels, chips and the email. Google Fonts.
- H1 hero: 600, `clamp(64px,13vw,168px)` (portfolio: `clamp(56px,10vw,136px)`), line-height 0.9, letter-spacing −0.055em. The second word is weight 400.
- H2 section: 600, 44px, lh 1.05, ls −0.035em
- H3: 600, 26–32px, ls −0.03em
- Body lead: 400, `clamp(18px,2vw,22px)`, lh 1.5, muted
- Body: 400, 17–18px, lh 1.55
- Eyebrow / section index: Geist Mono 500 13px, uppercase, ls .08em, muted (e.g. "01 / Products")
- Chips: Geist Mono 500 12–13px, padding 7–8px × 11–12px, radius 8px, 1px line border

Radius: 6 (small), 8 (chips, toggles), 10 (buttons), 12 (metric cards), 14–16 (cards), 20 (carousel stage), 999 (pills).
Layout: container max-width 1160px, horizontal padding 24px, section padding 96px vertical (hero 112–120px top). Sections are separated by a 1px `line` border.
Section grid: `repeat(auto-fit, minmax(min(100%,320px),1fr))` with a 48px gap. The title sits in column 1 and the content spans 2 columns.

## Screens

### Home (`PRMA Code Site.dc.html`)
1. **Header** (sticky, bg = page bg, bottom border): mark 30px + wordmark 18px · nav (Products, Services, Founder, Contact, Portfolio), Geist 14px muted · EN/PT segmented toggle (active = ink fill) · theme toggle button (32px tall, mono 12px, label "Dark"/"Light").
2. **Hero**: eyebrow "Software studio" with an 8px orange square · H1 "PRMA Code" + blinking orange cursor bar (0.32em × 0.09em) · lead copy · primary button "Talk about a project →" (orange, 48px tall, mailto) + secondary outlined button "See what we're building".
3. **01 / Products**: card (radius 16, padding 32) for "New app for gamers", with a "Coming soon" pill that has a small blinking cursor. Shows the description, criteria chips (Server, Rank, Role, Schedule, Playstyle) and an iOS / Android footer row.
4. **02 / Services · Client projects**: lead line. Below it, a 4-step strip (01 Planning, 02 Design, 03 Development, 04 App Store & Google Play) built as a 2px-gap grid on a `line` background (hairline dividers). Then the link "Talk about a project →" with a 2px orange underline.
5. **03 / Founder · Who's behind it**: name, bio, stack chips (React, React Native, TypeScript, Node.js), and the link "View portfolio →".
6. **04 / Contact** (dark band): H2 "Get in touch", copy, and the email `contato@prmacode.dev` in Geist Mono `clamp(24px,4vw,44px)` followed by a blinking cursor. The email turns orange on hover.
7. **Footer**: mark 22px + "© 2026 PRMA Code" · "CNPJ 45.056.853/0001-83".

### Portfolio (`PRMA Code Portfolio.dc.html`)
Same header (nav: Projects, Skills, Contact, PRMA Code ↗).
1. **Hero**: eyebrow "Paulo Ricardo Almeida · Founder, PRMA Code", H1 "Software Engineer" + cursor, lead, buttons "See projects ↓" / "Get in touch".
2. **01 / Projects: 3D device carousel**
   - Stage: height `clamp(420px,48vw,580px)`, radius 20, card bg, 1px border, `perspective:1800px`, a floor gradient on the bottom 38%.
   - Devices: a desktop monitor (16:10 screen, width `clamp(300px,40vw,520px)`, bezel 10px `#0D0D0C`, stand + base) and phones (9:19, width `clamp(140px,16vw,210px)`, with a pill notch). Each screen is a screenshot slot.
   - Positioning: every device has an offset o ∈ {−1, 0, 1} from the active one. Transform: `translateX(calc(-50% + o*spread)) translateZ(o≠0 ? -320px : 0) rotateY(o*-30deg) scale(o≠0 ? .78 : 1)`. Spread = `min(400px,36vw)` when the desktop is in front, otherwise `min(300px,28vw)`. Side devices have opacity .7 and `saturate(.6) brightness(.92)`.
   - Transition: 0.8s `cubic-bezier(.2,.8,.2,1)` on transform, opacity and filter.
   - Controls: counter "01 / 03" (mono) plus round 44px ← → buttons that loop · clicking a side device makes it active · ← / → keys work too · pill dots (active: 28px wide, orange; inactive: 6px, muted).
   - Under the stage, a details row for the active project: index · platform, name, kind, metric cards (value 28px/600 + label), description, stack chips.
   - Content: **Coordly**, desktop, "SaaS management platform", metrics 400k+ items rendered and ~50% less memory usage, stack React, TypeScript, Styled Components, React Query, Redux, Autodesk Viewer 3D. **Two mobile apps are placeholders**: take their names, descriptions and screenshots from the current site.
3. **02 / Skills · Stack**: 6 groups (Frontend, Mobile, Backend, 3D & Animation, Architecture, Integrations) in a hairline grid (`minmax(min(100%,300px),1fr)`), each with a title, a mono index and chips. Items are the same as the current site; "Virtualização" was changed to "Virtualization".
4. **03 / Contact** (dark band): "Let's talk" + cursor, copy, buttons Email (orange, mailto pauloricardo.m.almeida@gmail.com), GitHub ↗ and LinkedIn ↗ (outlined).
5. Footer: mark + "Paulo Ricardo Almeida © 2026" · "A PRMA Code profile".

## Interactions & behavior
- Blinking cursor: `@keyframes blink {0%,49%{opacity:1} 50%,100%{opacity:0}}`, 1.1s `steps(1)` infinite. Respect `prefers-reduced-motion` (show a static cursor).
- Theme toggle: switches the token set, with a 0.2s transition on background and color. The original site's custom-color picker can stay. If kept, it replaces only `#E8743B`.
- Hover: links turn orange. Carousel buttons get an orange border.
- Responsive: all grids wrap via auto-fit. The nav wraps. Below about 700px, consider collapsing the nav into the existing menu button.

## State
- `theme: 'light' | 'dark'` (persist it, as the current site does)
- Portfolio: `activeIndex` (wraps modulo the number of projects)

## Assets (`assets/`)
- `logo-mark-dark.svg` / `logo-mark-light.svg`: boxed mark
- `logo-mark-glyph-ink.svg` / `-white.svg`: P + cursor without the box
- `logo-horizontal-light-bg.svg` / `-dark-bg.svg`: mark + wordmark. The wordmark is live text in Geist, so **convert it to outlines** before using it outside the web.
- `favicon.svg`, `app-icon-1024.svg` (square, full-bleed, for iOS/Android masks), `avatar.svg` (orange circle for social media)
- `og-image.svg`: 1200×630. Export it to PNG and replace `/og-image.png`.
