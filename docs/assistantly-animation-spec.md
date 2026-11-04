# Homepage animation and interaction spec (reverse-engineered mechanics)

Source: site.css (4,683 lines, heavily patched cascade), site.js (vanilla, IIFE modules), index.html, rendered DOM.
**The values below are the final effective ones.** The CSS redefines the same selectors 5–15 times, and later rules win. The desktop values are for ≥981px unless a breakpoint is given.
`(inferred)` marks anything not read directly from the source.

## 0. Stack and libraries
- **No libraries.** There is no GSAP, Lenis, Lottie, ScrollTrigger, Swiper, jQuery or Webflow runtime on the homepage. Everything is hand-written CSS keyframes and transitions, plus vanilla JS: 88 IntersectionObserver usages, `requestAnimationFrame` (count-ups only) and `setTimeout`/`setInterval`.
- Smooth scrolling is native only: `html{scroll-behavior:smooth; scroll-padding-top:calc(env(safe-area-inset-top,0px) + 104px)}` (final value).
- The site is a SPA-style shell (`.page[data-page="home"]`). Other pages are hidden `.page`s, and JS listens to `hashchange` to re-run reveals.
- `onboarding.js` intercepts CTA clicks to `app.supahumans.com/onboarding` and opens an iframe overlay:
  - backdrop: `rgba(14,42,37,.62)` + `backdrop-filter:blur(6px)`, animation `sh-embed-fade .18s ease-out` (opacity 0→1)
  - panel: `width:min(1180px,100%); height:min(604px,100%); border-radius:22px; box-shadow:0 32px 90px rgba(14,42,37,.38)`, animation `sh-embed-rise .24s cubic-bezier(.2,.7,.3,1)` (from `opacity:0; translateY(14px) scale(.985)`)
  - spinner: 34px, 3px border, `.7s linear` rotation

## 1. Global design tokens

### Colors (`:root`)
- Pines: `--pine:#183A33`, `--pine-soft:#22483F`, `--pine-deep:#0E2A25`, `--ink:#10201C`
- Limes: `--lime:#C6E79E`, `--lime-deep:#AEDA7E`, `--lime-soft:#E6F3D4`, `--lime-wash:#F1F7E8`
- Neutrals: `--body:#333333`, `--sage:#C9D2CE`, `--mist:#E7EAE8`, `--paper:#F9F9F9`, `--white:#FFF`, `--gold:#F4B73E` (stars). Muted label grey `#6B7672`; logo grey `#8A9490`.
- Semantic aliases: `--bg:white; --alt:paper; --card:white; --line:mist; --hair:rgba(16,32,28,.10); --fg:pine; --tx:body; --sub:pine-soft; --chip:lime-soft; --hd:var(--pine)` (heading color).
- Gradients:
  - `--grad-dark: linear-gradient(155deg,#20463E 0%,#0E2A25 100%)`
  - `--grad-lime: linear-gradient(120deg,#D8EEB8 0%,#B6DE86 100%)` (primary button)
  - `--grad-pine: radial-gradient(900px 420px at 15% 0%,rgba(34,72,63,.9),transparent 70%), linear-gradient(160deg,#22483F 0%,#183A33 45%,#0E2A25 100%)`. This is forced on `section.dark, .problem, .foot2` with `!important`.
- Light only: `html{color-scheme:only light!important}`. No dark mode.

### Fonts
All fonts are self-hosted woff2, declared via `@font-face` inside site.css. There are no Google Fonts and no `<link>`. All use `font-display:swap`.
- `--fd` (display): `'Neue Montreal'` at 500 and 300, with fallbacks `'PP Neue Montreal','General Sans',-apple-system,…`
- `--fb` (body): `'Inter'`, variable weight 300–500
- `--fm` (mono): `'IBM Plex Mono'` at 400 and 500
- `'Caveat'` 400: handwritten script, used only for `.pp-script`
- `'Inter Display'` 800 is declared but overridden later by `h1,h2,h3{font-family:var(--fd)!important;font-weight:500!important}`.

### Type scale (final)
- **body:** `font:300 20px/1.6 var(--fb); letter-spacing:-0.01em; -webkit-font-smoothing:antialiased; overflow-x:hidden`. The base was 18px; a late override sets 20px.
- **h1 (hero):** `clamp(40px,6.4vw,82px)/.98`, weight 500, `--fd`, `letter-spacing:-0.022em`, max-width 13ch. `-webkit-text-stroke` was added and then forced to 0.
- **h2 (all except `.mega`):** `clamp(34px,4.3vw,58px)/1.06; letter-spacing:-0.022em; color:pine`; white on `.dark`.
  - `.problem h2.xl`: `clamp(36px,4.8vw,62px)/1.08`, max-width 18ch
  - FAQ h2: `clamp(30px,3.8vw,52px)`, nowrap at ≥900px
- **h3:** `24px/1.25; letter-spacing:-0.02em`
- **Eyebrow** (`.kick`, `.kick.eb`, hero `.kick`, `.logos2 p`): `font:400 12px var(--fb); letter-spacing:.2em; uppercase; color:#333` (lime `#C6E79E` on dark). Margin-bottom 24px in the hero and 20px in the problem section.
- **Lede:**
  - `.hero .big.hp2`: `clamp(15px,1.15vw,17px)/1.5`, max-width 720px, margin-top 36px
  - `.hd .big.sp`: `300 clamp(15px,1.15vw,17px)/1.5 --fb`, nowrap at ≥760px
- **Labels** (`.lab`): `400 11px --fb; letter-spacing:.2em; uppercase; color:#6B7672`
- **Mono micro-labels:** `500 10.5px --fm; letter-spacing:.14em`

### Radii and shadows
- Radii: `--r:22px`, `--r2:28px`, `--pill:100px`. Cards 24px, the stage 32px, the wall panel 32px.
- `--sh: 0 24px 48px -30px rgba(16,32,28,.40)`
- `--sh-big: 0 54px 120px -60px rgba(16,32,28,.75)`
- Card shadow: `0 1px 0 rgba(16,32,28,.04), 0 30px 60px -42px rgba(16,32,28,.45)`
- Hover lift shadow: `0 34px 60px -36px rgba(16,32,28,.5)`
- `--ease: cubic-bezier(0.4,0,0.2,1)`. Spring overshoots used throughout: `cubic-bezier(.3,1.4,.5,1)`, `(.3,1.5,.5,1)` and `(.3,1.6,.5,1)`.
- Focus ring: `--focus: 0 0 0 3px #E6F3D4`.

### Layout
- `.w{max-width:1080px; margin:0 auto; padding:0 32px}` (20px gutter at ≤720px)
- `.w.wide` is 1200px. `.w.narrow` is 800px, but becomes 1080px when it contains `.faq`.
- `.sec{padding:128px 0}` (80px at ≤720px). `.sec.alt{background:#F9F9F9}`.
- `.hd{margin-bottom:64px; display:flex; flex-direction:column; gap:18px}`

## 2. Shared animation primitives (reused by many sections)

| Name | Definition | Used by |
|---|---|---|
| `ping` | `0%{scale(1);opacity:.7} 80%,100%{scale(3.2);opacity:0}`, `2–2.4s cubic-bezier(0,0,.2,1) infinite` on an `::after` clone of a dot | live dots (`.gm i`, `.gdot`, `.live i`, `.cdot`, `.ms.now`) |
| `bob` | `50%{translateY(-14px)}`, 3.4–3.6s ease-in-out infinite | mascot idle |
| `finIdle` | `0%,100%{translateY(0)} 50%{translateY(-6px)}`, 3.6s ease-in-out infinite | hero mascot after its intro |
| `pppop` | `0%{opacity:0; translateY(40%) scale(.3)} 60%{opacity:1} 100%{none}`, `.9s cubic-bezier(.3,1.5,.5,1)` | hero mascot pop-in |
| `uBuck` | `0%,100%{rotate(0)} 30%{translateY(-14px) rotate(-12deg)} 60%{translateY(-4px) rotate(6deg)}`, `.9s var(--ease)` ×1 | mascot "buck" |
| `cfly` (confetti) | `0%{opacity:1; translate(0,0) rotate(0) scale(.4)} 55%{opacity:1; translate(var(--x),var(--y)) rotate(var(--r)) scale(1)} 100%{opacity:0; translate(calc(var(--x)*1.15), calc(var(--y) + 140px)) rotate(calc(var(--r)*1.6)) scale(.9)}`, `var(--d) cubic-bezier(.15,.7,.3,1) forwards` | all confetti bursts |
| `.reveal` | `opacity:0; translateY(28px); transition: opacity .8s var(--ease), transform .8s var(--ease)`. `.reveal.vis` resets it to `opacity:1; transform:none`. | bento cards, talent panels |

### Confetti generator (JS `confetti(el, n=34)`)
- Container: `.cf{position:absolute; left:50%; top:38%; width:0; height:0; z-index:7; pointer-events:none}`.
- Particle size by type:
  - `i.sq`: 8×12, border-radius 2px
  - `i.ci`: 8×8 circle
  - `i.em`: 22px emoji
- Pseudocode:
  ```
  for i in 0..n-1:
    a = -π·(0.05 + 0.9·rand)           // upward fan
    r = 110 + rand·170
    if i % 5 == 0: emoji from [🦄✨💚🎉⭐🌟]
    else: sq|ci (50/50) with bg from [#C6E79E,#AEDA7E,#183A33,#22483F,#E6F3D4,#F4B73E]
    --x = cos(a)·r px;  --y = sin(a)·r px
    --r = ±540deg random;  --d = 1.2–1.9s random;  animation-delay = 0–0.12s random
  clear container after 2400ms
  ```
- Reduced motion: `.cf{display:none}`.

## 3. Nav (`header.gnav`)
- **Sticky, with frosted glass at all times.** There is no scroll-state JS and the nav never changes on scroll:
  - `position:sticky; top:0; z-index:50`
  - `background:color-mix(in srgb, #fff 80%, transparent)`
  - `backdrop-filter:saturate(1.8) blur(20px)`
  - `border-bottom:0` (overridden from a 1px hairline)
  - `padding-top:calc(env(safe-area-inset-top) + 26px)` (12px at ≤720px)
- Row `.nr`: flex, `height:56px`, gap 32px. Logo is 136px wide. Links `.gl a` are `400 14px --fd`, opacity .86, becoming 1 on hover. The current page is weight 500.
- **Industries dropdown** (`.ix-nav`, triggered by hover or `focus-within`):
  - menu: 560px, 2-column grid, `top:calc(100% + 16px)`, radius 20px, `box-shadow:0 30px 60px -30px rgba(16,32,28,.45)`
  - hidden state: `opacity:0; visibility:hidden; translate:-50% 6px`
  - open state: `opacity:1; visible; translate:-50% 0`
  - transition: `opacity .18s var(--ease), translate .18s var(--ease), visibility 0s .18s` (visibility delay is reset to 0s on open)
  - an 18px invisible `::before` hover-bridge covers the gap
  - item hover background is `--lime-wash`
  - JS sets `aria-expanded` on mouseenter/mouseleave and focus. Esc adds `.shut`, which forces it closed; clicking an item also adds `.shut`.
- **Right side:** "Sign in" text link (15px, opacity .85→1) plus the primary small pill CTA (`.btn.primary.sm.gcta`, `padding:10px 20px`), which carries the pulsing glow ring described in §4.
- **Mobile (≤860px):**
  - `.burger` is 44×44 with two 18×1.5px bars. Open state `[aria-expanded=true]` turns them into an X via `translateY(±3.75px) rotate(±45deg)`, `transition: transform .2s`.
  - `.gl` becomes an absolute dropdown (`top:100%`, white, 24px/500 links). It is toggled by `.open` with no animation.
  - The CTA is hidden.
  - JS: `burger.click → gl.classList.toggle('open'); set aria-expanded and aria-label`.

## 4. Buttons
**Base `.btn`:**
- `inline-flex; font:500 17px --fd; letter-spacing:-.01em; border-radius:100px; padding:14px 28px; border:1px solid transparent; position:relative; overflow:hidden; isolation:isolate; white-space:nowrap`
- `transition: transform .25s cubic-bezier(.3,1.4,.5,1), box-shadow .25s var(--ease), filter .2s`
- `:hover{transform:translateY(-2px); box-shadow:0 14px 28px -14px rgba(16,32,28,.45)}`
- `:active{transform:translateY(0) scale(.97); transition-duration:.08s}`

**Shine sweep** (every `.btn`, on hover):
- `::after{content:""; position:absolute; inset:0; z-index:-1; background:linear-gradient(110deg, transparent 35%, rgba(255,255,255,.55) 50%, transparent 65%) no-repeat; background-size:250% 100%; background-position:150% 0; transition:background-position .8s var(--ease)}`
- `:hover::after{background-position:-60% 0}`

**`.btn.primary` (lime pill with glowing ring):**
- `background:var(--grad-lime); color:#183A33; overflow:visible`, so the ring can escape the button. Hover: `filter:saturate(1.15) brightness(1.02)`.
- `::after` is clipped with `clip-path:inset(0 round 100px)` so the shine stays inside the pill.
- **Glow ring:** `::before{content:""; position:absolute; inset:0; border-radius:inherit; z-index:-2; animation:btnPulse 2.6s ease-out infinite}` with
  `@keyframes btnPulse{0%{box-shadow:0 0 0 0 rgba(174,218,126,.65)} 70%,100%{box-shadow:0 0 0 14px rgba(174,218,126,0)}}`
- Reduced motion: `::before{animation:none; opacity:0}`.

**Other variants:**
- `.btn.pinegrad` (hero CTA):
  - `background:--grad-dark; color:#fff; padding:16px 30px; gap:8px`
  - trailing `›` span (20px) moves `translateX(3px)` on hover over .2s
  - shine color `rgba(198,231,158,.28)`
  - hover shadow `0 18px 32px -16px rgba(16,32,28,.6)`
- `.btn.ghost`: transparent background, `border-color:#C9D2CE`, pine text.
- `.btn.dark`: pine background, white text, `padding:16px 32px`.
- `.btn.sm`: 14px font, `8px 16px` padding.
- **Text link `.more`:** `300 17px --fb; color:#333`. On hover the `.mt` text gets an underline (offset 4px, color `--lime-deep`) and the spans move `translateX(3px)` over `.18s var(--ease)`.

## 5. Hero (`section.hero`)
**Layout:**
- `padding-top:84px`, centered text.
- Content order: eyebrow → h1 with an underlined phrase → two-sentence lede (`.ln` spans shown inline) → role picker (`#hf` title 20px plus a row of `.chips` pills plus a `.fine` note) → `.ctas` holding a single `.btn.pinegrad`.
- `.pick{padding:44px 0 32px}`; `.hero .ctas{margin-top:22px; position:relative; z-index:6}`.

**Load cascade** (CSS only, under `prefers-reduced-motion: no-preference`):
- `.rise{animation:rise .9s var(--ease) both}`, `@keyframes rise{from{opacity:0; transform:translateY(18px)}}`
- Stagger: `.r1` 0s (eyebrow), `.r2` .08s (h1), `.r3` .16s (lede and picker), `.r4` .24s (CTA).

**Swoosh underline:** the `<em class="sw">` wraps the phrase with an inline SVG `viewBox="0 0 320 34" preserveAspectRatio="none"`.
- Path: `M4 22 C 70 8, 150 4, 230 12 S 300 26, 316 10`.
- `.swoosh{position:absolute; left:-2%; bottom:-.3em; width:104%; height:.26em; overflow:visible}`
- `path{fill:none; stroke:#AEDA7E; stroke-width:4; stroke-linecap:round; stroke-dasharray:420; stroke-dashoffset:420; animation:swoosh 1.8s .8s cubic-bezier(.65,0,.35,1) forwards}`, `@keyframes swoosh{to{stroke-dashoffset:0}}`.
- Reduced motion: dashoffset 0, no animation.

**Chips:**
- `500 14px --fd; padding:8px 16px; pill; 1px solid #E7EAE8; white`
- `transition: transform .25s cubic-bezier(.3,1.4,.5,1), background .2s, border-color .2s, box-shadow .25s`
- hover: `translateY(-2px); box-shadow:0 12px 24px -16px rgba(16,32,28,.45); background:#F1F7E8; border-color:#AEDA7E`
- active: `scale(.96)`

## 6. Hero visual stage (`.stage` inside `.w.wide`)
**Stage box:**
- `position:relative; height:428px; margin-top:108px; border-radius:32px; overflow:visible`. Children overflow above the top edge.
- `background:linear-gradient(180deg,#E7EAE8 0%,#F9F9F9 55%,#FFF 100%)`.
- `.grid`: absolute inset, inheriting the radius. Two 1px line gradients `rgba(24,58,51,.07)` at `background-size:56px 56px`, with `mask-image:radial-gradient(ellipse at center,#000 30%,transparent 75%)` so the grid fades at the edges.
- `.glow`: `left:0; top:58%; width:100%; height:520px; translateY(-50%); radial-gradient(closest-side, rgba(255,255,255,.9), transparent)`.

**Mascot (`.hero-uni.solo`, left side):**
- Placement: `width:300px; left:2%; bottom:30px` at ≥901px (260px between 901 and 1100px). Drop-shadow `0 18px 22px rgba(16,32,28,.16)`.
- `.floor` ellipse shadow: `radial-gradient(closest-side, rgba(16,32,28,.18), transparent)`, `bottom:-10px`. It is animated by `shadow 3.4s` (`50%{scaleX(.82); opacity:.7}`).
- JS sequence:
  ```
  onload: el.add('hxpre')                     // img opacity:0; translateY(30%) scale(.4)
  IO(threshold .3, once): after 500ms → remove hxpre, add hxpop
      // hxpop: animation pppop .9s cubic-bezier(.3,1.5,.5,1) both, then bob 3.6s ease-in-out .9s infinite
      after 450ms → confetti(el, 40)
  IO(threshold .4): on first intersect, after 900ms → act():
      add 'bucking' (uBuck .9s ×1, !important) + confetti(el, 38)
      after 950ms remove 'bucking';  after 1000ms add 'stayup' (finIdle 3.6s infinite, !important)
      if scrolled back out with boundingClientRect.top > 0 → re-arm (seen = false)
  ```
- A cursor tilt sets `--rt = ((clientX - left)/width - .3) * 8 deg` on mousemove (fine pointers only) and resets to 0 on leave. No CSS reads `--rt`, so **it is a dead no-op**. Implement it as `rotate(var(--rt))` if you want the tilt (inferred intent).

**Floating notes (`.note.n1/.n2/.n3`), glass chips with an avatar, name, role and tag:**
- Style:
  - `padding:9px 14px 9px 9px; border-radius:15px; gap:10px`
  - `background:color-mix(in srgb,#fff 82%,transparent); backdrop-filter:blur(18px)`
  - `box-shadow:var(--sh); border:1px solid #E7EAE8`
  - avatar 32px circle; name `500 14px`; role `300 12px`
  - `.tg` tag: `500 12px; padding:4px 10px; pill; background:#E7EAE8`
- Positions (≥981px):
  - n1 at `top:176px; left:calc(15% + 46px)`
  - n2 at `bottom:68px; left:calc(21% + 32px)`
  - n3 at `top:74px; left:29%` (26% at ≤1100px)
  - all at z-index 4–5
- Load: `animation:pop .6s var(--ease) both` with `@keyframes pop{from{opacity:0; transform:translateY(10px) scale(.92)}}`. Delays: n1 1.05s, n2 1.3s, n3 1.55s.
- Hidden at ≤980px.

**Profile card (`.hero-card > article.pc2.hero`), right side:**
- Placement: `.stage .hero-card{position:absolute; right:7%; top:-36px; width:440px; transform:scale(.76); transform-origin:100% 0; z-index:3}`. It sticks out above the stage. No load animation: `animation:none!important`. Hover lift is disabled inside the stage.
- Card: white, 1px `#E7EAE8` border, radius 24px, `padding:26px 28px 24px`, card shadow.
- Header: 52px rounded avatar (`.pav`, radius 18px), h3 22px, sub `300 14px`.
- Pill row:
  - `.d1` badge: `--grad-dark`, `400 11px` (`--fb` forced), `letter-spacing:.2em`, `padding:8px 12px`, radius 10px
  - `.gm` badge: `lime-wash` background, `1px rgba(174,218,126,.6)` border, `400 13px`, pill, with a pulsing 7px `--lime-deep` dot that pings over 2s
- **Bars** (`ul.bars`, 3 rows: label | track | level pill):
  - grid `104px 1fr 112px`, gap 12px
  - track `b`: `height:4px; background:repeating-linear-gradient(90deg, #E7EAE8 0 calc(10% - 2px), transparent calc(10% - 2px) 10%)`, a 10-segment dashed track
  - fill `i`: `width:var(--v)` (95%, 90%, 96%), pine, radius 4px
  - animation: `.pc2:not(.in) .bars i{width:0}` with `transition:width 1.1s var(--ease)`; rows 2 and 3 are delayed .12s and .24s
  - JS: `IO(threshold .35, once) → .pc2.add('in')`
  - level pills `em.lv` (`500 11.5px`, `padding:5px 10px`, pill, 6px dot via `::before`):
    - `.l0`: `--grad-dark` with a lime dot
    - `.l1`: lime-wash with a 1px `rgba(174,218,126,.7)` border and a `--lime-deep` dot
    - `.l2`: paper background
    - on `li:hover` the pill moves `translateY(-1px)` over .2s
  - dashed separators: `1px dashed #C9D2CE`
- "What she turned in" block (`.tin`, 16px text). The `.cset` operating-fit chips are hidden at ≥981px.
- **Intro pill** `.introp`:
  - `--grad-dark`, `300 14px`, `padding:8px 22px 8px 8px`, pill
  - `margin:24px -44px -46px 0`, so it breaks out of the card's bottom-right corner
  - shadow `0 20px 40px -20px rgba(16,32,28,.6)`
  - `.plb` play button: 36px lime circle with a CSS-triangle `::after` (`border-left:9px solid pine; border-top/bottom:7px transparent`)

**≤980px:** the stage becomes a flex column with `height:auto`. Card and mascot become `position:relative`, the transforms and animations are removed, and the notes are hidden. Mascot is 170px wide at ≤900px with `margin:-40px auto 0`.

## 7. Stats row (`section.nums > dl.sbox`)
- `margin-top:48px!important; padding:0 0 110px; z-index:3`.
- Grid: 5 columns, gap 12px, max-width 1000px. 3 columns at ≤980px, 2 at ≤600px (the hub card spans the full row).
- **Stat card:**
  - `white; 1px #E7EAE8; radius 16px; padding:18px 14px 16px; min-height:96px; centered`
  - `transition:border-color .25s, transform .3s var(--ease), box-shadow .3s var(--ease)`
  - hover: `border-color:#AEDA7E; translateY(-4px); box-shadow:0 22px 40px -30px rgba(16,32,28,.4)`
  - `dd` (shown first via `order:-1`): `500 clamp(24px,2.2vw,32px)/1 --fd; letter-spacing:-.025em; tabular-nums`
  - `dt`: `300 13px --fb`
- **Hub card** (`.stat.hub`): paper background. The `dd` is `clamp(17px,1.5vw,21px)` with an 8px `.gdot` that pings over 2.4s.
- **Count-up JS** (only on `dd[data-to]`; the others are static text):
  ```
  if IO && !reducedMotion: dd.text = '0' + suffix
  IO(threshold .6, once) → run(dd)
  run: dur = 1700ms, rAF loop: k = min(1, (t - t0)/dur); e = 1 - (1-k)^3   // easeOutCubic
       text = (round(to·e)).toLocaleString('en-US') + suffix
  stat.mouseenter → re-run (locked for 1800ms)
  ```

## 8. Logo strip (`.logos2`)
- `margin-top:150px`, centered. Caption is eyebrow style (`400 12px`, `.2em` tracking, uppercase) with a 36px bottom margin.
- Two `ul.lrow` rows (7 + 5 logos), each `flex-wrap; centered; gap:24px 44px; max-width:1240px`. Second row has `margin-top:14px`.
- Logos are **CSS masks**, so they recolor with no image swap:
  - `span.lg{background:#8A9490; mask-size:contain; mask-repeat:no-repeat; mask-position:center}` with an inline width, height and `mask-image:url(logo.png)`
  - `transition:background .25s, transform .3s var(--ease)`
  - `li:hover .lg{background:#183A33; translateY(-2px)}`
- **Idle float, not a marquee:**
  - `.lrow li{animation:lgFloat 6s ease-in-out infinite}`, `@keyframes lgFloat{0%,100%{translateY(0)} 50%{translateY(-3px)}}`
  - phase offsets: `:nth-child(2n)` −1.5s, `(3n)` −3s, `(5n)` −4.5s
  - the second row's duration is 7s
  - hover sets `animation-play-state:paused`
- ≤720px: a 3-column grid via `display:contents` on the rows (2 columns at ≤520px).

## 9. Dark "problem" section (`section.dark.problem`)
- `background:--grad-pine; padding:104px 0`, centered. Eyebrow in lime, h2.xl in white.
- `ol.pl`: `max-width:860px; margin-top:56px`. Each `li` is a grid `1fr 300px`, gap 48px, `padding:26px 0`, with a `border-top:1px solid rgba(255,255,255,.14)`.
  - left: h3 `clamp(20px,2vw,26px)` plus p `17px rgba(255,255,255,.72)`
  - right: `.ans`, an answer in lime `500 clamp(17px,1.6vw,20px) --fd` with an inline SVG check `.ck` (26px)
- **Reveal:** JS `IO(threshold .3, once) → li.add('in')`.
  - Row: `.rv-l{opacity:0; translateY(24px); transition:opacity .7s var(--ease), transform .7s var(--ease)}`; row 2 is delayed .12s and row 3 .24s.
  - Answer slides in from the right: `.ans{opacity:0; translateX(48px); transition:opacity .7s var(--ease), transform .8s cubic-bezier(.2,.9,.3,1.1)}`.
  - Check circle: `.ck circle{fill:lime; transform-origin:12px 12px; transform:scale(0); transition:transform .45s cubic-bezier(.3,1.6,.5,1)}`.
  - Check path draws on: `.ck path{stroke:pine; stroke-width:2.2; stroke-dasharray:20; stroke-dashoffset:20; transition:stroke-dashoffset .45s var(--ease)}`.

  | Row | `.ans` delay | circle delay | path delay |
  |---|---|---|---|
  | 1 | .25s | .7s | .95s |
  | 2 | .4s | .85s | 1.1s |
  | 3 | .55s | 1s | 1.25s |

## 10. Bento "standard" grid (`.bento.v2`)
- Header: `.hd.std` holds the eyebrow, an h2 split into two `.l1` block lines (nowrap at ≥900px) and a `.big.sp` subline.
- Grid: `repeat(6,1fr)`, gap 20px. Cards are `.b4` (span 4), `.b2` (span 2) and `.b6` (span 6). All span 6 at ≤960px.
  - Row 1: `b4 lead` (operating profile) + `b2` (clocks)
  - Row 2: `b2` (ladder), `b2` (receipt checklist), `b2` (90-day plan)
  - Row 3: `b6` (guarantee)
- Card `.b`: `background:#F9F9F9; border:1px solid #E7EAE8; border-radius:22px; padding:36px; gap:28px; flex column; overflow:hidden`. Body text `300 18px/1.55`. The widget sits at the bottom via `margin-top:auto`.
- Hover (all cards): `transition:transform .35s var(--ease), box-shadow .35s var(--ease)`; `:hover{translateY(-6px); box-shadow:0 34px 60px -36px rgba(16,32,28,.5)}`.
- **Reveal (two observers both add `.vis`):**
  1. Generic: on load JS adds `.reveal` with `transition-delay = min(siblingIndex,5)·70ms` (0, 70, 140, 210, 280, 350ms), then `IO(threshold .12, rootMargin '0px 0px -40px 0px', once) → .vis`.
  2. Bento-specific: `IO(threshold .35, once) → setTimeout(250ms) → .vis`.
  - The mini-widgets below all key off `.b.vis`. Reveal applies only when `!prefers-reduced-motion`.

### 10a. Operating-profile sliders (`.b4.lead .opm`)
- Inner card: white, 1px mist border, radius 18px, `padding:20px 22px 16px`, shadow `0 22px 44px -32px rgba(16,32,28,.45)`.
- Header row: "You" chip plus a face avatar, a title and a `.gm` "fit" pill. The `.opm-h`, `.opm-who`, `.opm-t`, `.me` and `.them` elements have no dedicated CSS beyond defaults (inferred: inline flex).
- `ul.axes`: 4 rows, gap 12px. Each row is a grid `84px 1fr 84px` with gap 12px, `300 12.5px`, and pole labels on both sides.
- Track `.ax`: `height:6px; radius:6px; background:#E7EAE8`.
  - `s` span between the two dots: `left:var(--l); right:var(--r); background:#C6E79E`
  - `s.sh` (shared-style hatch): `repeating-linear-gradient(90deg, rgba(174,218,126,.55) 0 4px, transparent 4px 7px)`
  - dots `i`: 14px, `left:var(--a)`, `translate(-50%,-50%)`, `box-shadow:0 0 0 3px #fff`
    - `.m` (you): pine
    - `.t` (them): `--lime-deep` fill with a 2px pine border
  - example values: `--a` 18/78, 24/70, 30/26, 20/24; `--l/--r` 18/22, 24/30, 26/70, 20/76
- **Animation:**
  - `.lead:not(.vis) .ax i, .lead:not(.vis) .ax s{left:50%!important}` and `.lead:not(.vis) .ax s{right:50%!important}`, so everything collapses to the center
  - `.ax i{transition:left 1s var(--ease)}` and `.ax s{transition:left 1s, right 1s var(--ease)}`
  - on `.vis` the dots slide apart to their positions and the range bar grows
- Legend `.opm-k`: `.k.m` and `.k.t` dots plus "fill / share" keys (inferred: the same styles as the slider dots and fills).

### 10b. Live clocks (`.b2 .wclock`)
- Box: white, radius 16px, `padding:14px 16px 6px`.
- `.live`: `500 10.5px --fm`, `.14em` tracking, uppercase, with a 7px `--lime-deep` dot that pings over 2.2s.
- Rows: grid `28px 1fr auto`, `padding:10px 0`, hairline top border.
  - `.cc` country code: `500 10px --fm`, mist background, radius 5px
  - `.cty` city: `300 14px`
  - `b` time: `500 20px --fd`, `-0.02em`, tabular-nums
- JS:
  ```
  tick(): for b in [data-tz]: b.text = new Date().toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit', timeZone:b.dataset.tz})
  tick(); setInterval(tick, 15000)
  ```
  Initial markup `--:--`. There is no seconds tick and no transition on change.
- An optional day/night icon `.dn` updates every 60s (day = hour 6–18 in the timezone). It exists in CSS/JS but is unused on the home page.

### 10c. Level bars / seniority ladder (`.b2 ol.ladder`)
- Flex, items aligned to the end (bottom), gap 6px, height 118px, `margin-top:auto`. Five `li` with heights 26%, 42%, 60%, 80% and 100%.
- Each `li` has `radius:10px 10px 4px 4px` and a bottom-centered label (`500 11px`).
  - `.off`: `repeating-linear-gradient(135deg, #E7EAE8 0 5px, transparent 5px 9px)`, 1px mist border, grey text `#8A9490`
  - `.on`: `--grad-dark`, white text
  - `.hi`: `linear-gradient(180deg, #22483F, #183A33)`
- Key `.ladder-k`: a 16×6 dark swatch plus a `400 12px` label, with `margin-top:-14px`.
- **Animation:** `li{transform-origin:bottom; transition:transform .8s var(--ease)}` and `.b:not(.vis) .ladder li{transform:scaleY(.15)}`. Stagger is 0, .06, .12, .18 and .24s, so the bars grow up in sequence.

### 10d. Checklist / receipt (`.b2 .rcpt`)
- White, radius 16px, `padding:14px 16px 8px`.
- Header `.rh`: flex space-between, with a `1px dashed #C9D2CE` bottom border. Title `500 13px --fd`; right label `400 10.5px --fm` uppercase with `.06em` tracking.
- Four `li`: 18px lime circle SVG with a pine check (stroke 2, round caps) followed by the item text in `300 14px`.
- **Static, no animation on home.** (inferred: for parity you can reuse the draw-on from §12: `stroke-dasharray:14`, dashoffset 14→0 over .5s, staggered .15s.)

### 10e. 90-day timeline (`.b2 .plan`)
- `padding:40px 4px 8px; position:relative; margin-top:auto`.
- Track `.pt`: 6px tall, mist background, radius 6px.
  - fill `i.pfill`: `width:33.3%; background:--grad-lime!important`
  - milestone dots `.ms`: `left:var(--x)` at 0, 15.5, 33.3, 66.6 and 100%; 12px white with a 2px pine border, centered with `translate(-50%,-50%)`
  - day labels `b` sit 16px below: `500 11px --fm`; edge labels are left- or right-aligned
  - current dot `.ms.now`: 16px `--lime-deep`, no border, with an `::after` that pings over 2.2s
- `.nowpill` above: `left:var(--x); translateX(-30%)`, `500 11px`, white on `--grad-dark`, pill, `padding:5px 10px`, with a rotated 8px square `::after` as the arrow (`#1c3e36`, `left:30%`, `bottom:-4px`).
- Phase legend `.plan-k`: flex space-between, `300 11.5px`, `margin-top:36px`, each phase with a 5px sage dot.
- **Animation:** `.pfill{transition:width 1.4s var(--ease)}` and `.b:not(.vis) .pfill{width:0}`, so the fill grows to 33.3%.

### 10f. Guarantee card with rotating circular text (`.b6.dark.guar`)
- Background: `radial-gradient(520px 320px at 82% 18%, rgba(198,231,158,.18), transparent 70%), radial-gradient(600px 400px at 0% 100%, rgba(14,42,37,.9), transparent 70%), linear-gradient(135deg, #22483F 0%, #183A33 50%, #0E2A25 100%)`.
- `padding:52px 56px; min-height:340px; flex-direction:row; align-items:center`. Text column max 520px. h3 is `clamp(28px,3.4vw,44px)/1.08` in white.
- `.gchips`: pill chips `400 13px`, white text on `rgba(255,255,255,.08)` with a 1px `rgba(255,255,255,.14)` border, `padding:7px 14px`, and a 6px lime dot.
- **Seal:**
  - `position:absolute; right:clamp(48px,9vw,140px); top:50%; translateY(-50%); width:220px; height:220px`
  - 190px at 961–1100px. At ≤960px it is centered at the bottom: `left:50%; bottom:28px; 170px`, with the card padding-bottom set to 220px.
  - SVG `viewBox 0 0 120 120` with a circle path `M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0` (r=46, circumference ≈ 289)
  - `<text><textPath href="#sealp" textLength="286" lengthAdjust="spacing">` holds the phrase plus a `·` separator, so it fills the circle
  - text style: `font:500 9.2px var(--fm); letter-spacing:.14em; fill:#C6E79E`
  - spin: `.seal svg{animation:spinSeal 32s linear infinite}`, `@keyframes spinSeal{to{transform:rotate(360deg)}}`
  - center `.sc`: `position:absolute; inset:46px; border-radius:50%; background:lime; color:pine; display:grid; place-items:center` with a static 74px icon (64px at 961–1100px, 54px at ≤960px)
- A mascot head `.gface` exists but is `display:none` on home.

## 11. "Meet the talent" tabs + cards (`section.sec.alt#ready`)
- Header `.hd.c.rdy`: centered, two-line h2.
- **Tablist `.seg`:**
  - `display:flex; flex-wrap:wrap; justify-content:center; gap:4px; padding:4px; background:#F1F3F2; border-radius:100px; margin:0 auto 48px; width:max-content`. Radius becomes 22px at ≤1080px.
  - buttons: `500 14px --fd; padding:9px 15px; pill; transparent`, with `transition:background .2s, box-shadow .2s, transform .2s`
  - hover: `background:rgba(255,255,255,.6)`; active: `scale(.96)`
  - selected `[aria-selected=true]`: `background:#fff; box-shadow:0 6px 16px -8px rgba(24,58,51,.35)`
  - there is no sliding indicator; the white pill simply moves to the selected tab
- **JS** (ARIA tabs with roving tabindex):
  ```
  sel(t): for each tab x: aria-selected = (x==t); tabIndex = on ? 0 : -1; panel(x).hidden = !on
  click → sel(t);  then after 30ms: panel.querySelectorAll('.pc2').add('in')
  keydown ArrowRight/ArrowLeft → wrap-around sel(next) + focus
  ```
- **Panel change animation:** each `.cards3` panel carries `.reveal` from the generic observer. A hidden panel never intersects, so the first time a panel is unhidden it fades up (`opacity 0→1`, `translateY 28px→0`, .8s `var(--ease)`, panel delay = min(idx,5)·70ms). Later switches are instant swaps.
- Layout hack: on desktop JS sets `margin-bottom = cssMB - round(offsetHeight·0.10)` on `.seg` and the panels (via ResizeObserver).
- **Panel `.cards3`:** grid of 3 columns (1 at ≤900px), gap 20px, stretch.
- **Card `.pc2.snip`:**
  - `padding:24px 24px 18px`, flex column
  - header: 56px avatar, h3 22px, role `300 14px`
  - `.xp` row: years text `300 14px #6B7672` + `.prv` "proven" pill (`500 13px`, lime-wash, an 18px pine circle with a lime check)
  - `.proof` box: paper, 1px mist, radius 14px, `padding:12px 14px`, fixed `height:178px`, text clamped to 5 lines
  - `.zg2` tag group: min-height 84px; `.ztag` is `500 12px`, `linear-gradient(120deg,#F1F7E8,#E6F3D4)`, 1px `rgba(174,218,126,.55)` border, `padding:5px 9px`, radius 6px, with a `#` `::before` in `--lime-deep`
  - `.lock` footer: `margin-top:auto`, `1px dashed #C9D2CE` top border, `300 13px`, lock icon
  - hover: `translateY(-6px)` plus the big shadow from §10
- Footer `.foot-r`: a centered `.btn.primary` plus `.fine`, `margin-top:56px`.

## 12. 3-step how-it-works (`ol.flow`)
- Grid of 3 columns, gap 28px (1 column with gap 44px at ≤860px).
- Connector: `.flow::before{position:absolute; top:96px; left:12%; right:12%; border-top:2px dashed #C9D2CE; z-index:0}` (hidden on mobile).
- Step `li.fs`: centered column.
  - number pill `.fn`: `500 11px --fm; .14em; lime-wash; 1px rgba(174,218,126,.6); padding:4px 10px; pill; margin-bottom:18px`
  - visual tile `.fv`: `height:120px; width:min(100%,280px); white; 1px mist; radius 18px; shadow 0 20px 40px -30px rgba(16,32,28,.45); margin-bottom:26px; transition:transform .35s, box-shadow .35s var(--ease)`
  - `.fs:hover .fv{translateY(-6px); box-shadow:0 30px 50px -30px rgba(16,32,28,.5)}`
  - then h3 (24px) and p (`300 clamp(17px,1.3vw,19px)`, max 28ch)
- **Step 1 `.fv.call`** (call widget):
  - pulsing 9px dot `.cdot` (ping, 2s), a label, and a mono "Free" tag
  - audio **waveform** `.wave`: flex, gap 3px, height 28px, seven `i` bars of 3px width (pine, radius 3px)
  - wave animation: `animation:wv 1.1s ease-in-out infinite`, `@keyframes wv{0%,100%{height:25%} 50%{height:100%}}`, per-bar delays 0, .1, .2 … .6s
- **Step 2 `.fv.trio`** (avatar fan):
  - three 46px avatars, radius 14px, 3px white border, overlapping `margin-left:-12px`
  - rest angles: `rotate(-8deg)`, `0`, `rotate(8deg)`, with `transition:transform .35s cubic-bezier(.3,1.4,.5,1)`
  - on `.fs:hover`: `rotate(-14deg) translate(-8px,-2px)` / `translateY(-6px)` / `rotate(14deg) translate(8px,-2px)` (the fan spreads)
  - below it, `.tpill`: dark gradient pill `500 12px` with a lime dot
- **Step 3 `.fv.done`** (checklist):
  - 2×2 grid of 17px lime-circle check icons with labels
  - check path `stroke-dasharray:14`, `transition:stroke-dashoffset .5s var(--ease)`; `.fs:not(.vis) .done path{stroke-dashoffset:14}`
  - stagger 0, .15, .3, .45s
- JS: `IO(threshold .4, once) → setTimeout(300ms) → li.fs.add('vis')`.
- Reduced motion: the wave and dot ping are disabled.
- After the flow: a centered `.more` link.

## 13. Fanned testimonial cards (`section.sec.wallsec`)
- `padding:72px 0`.
- Panel `.wpanel`: `radius 32px; background:linear-gradient(180deg,#E7EAE8 0%,#F9F9F9 60%,#FFF 100%); padding:44px 24px 80px; centered; overflow:hidden`.
- Content: 64px lime icon tile (radius 14px, `margin-bottom:26px`), then the `h2.mega` headline: `clamp(44px,7vw,100px)/.88; letter-spacing:-0.03em; max-width:13ch; pine`.
- **Fan `.wl-fan.home`:** `position:relative; height:400px; margin-top:6px; z-index:2`. Cards are absolutely positioned and rotated:
  - `.wl` base: white, radius 28px, `padding:28px`, shadow `0 30px 60px -36px rgba(16,32,28,.45)`, `transition:transform .3s var(--ease)`, `z-index:5` on hover
  - w1: `left:2%; top:58px; rotate(8deg); width:clamp(232px,27.6%,300px)`
  - w2: `left:20%; top:84px; rotate(-6deg)`, same width as w1
  - w3 (front, center): `left:50%; top:-8px; translateX(-50%); width:clamp(318px,40.4%,440px); padding:36px; z-index:3; box-shadow:var(--sh-big)`. Quote is `500 24px/1.3 --fd`.
  - w4: `right:2%; top:60px; rotate(7deg); width:clamp(238px,29.4%,320px)`
  - hover: keeps the card's rotation and adds `translateY(-8px)` (for w3: `translateX(-50%) translateY(-8px)`)
  - card content: figcaption (52px avatar, name `500 18px`, role nowrap with ellipsis), gold stars `#F4B73E` (18px, letter-spacing 2px), and a blockquote `400 18px/1.5` clamped to 4 lines
- **Reveal:** JS `IO(threshold .25, once) → section.add('in')`.
  - **Key trick:** the transitions use the individual `scale` and `translate` CSS properties. The rotation stays on `transform`, so the two compose without conflict.
  - `.mega`: `transition:opacity .9s var(--ease), translate .9s var(--ease)`; not-in state `opacity:0; translate:0 24px`.
  - Cards: `transition:opacity .7s var(--ease), scale .8s cubic-bezier(.3,1.4,.5,1), transform .3s var(--ease)`; not-in state `opacity:0; scale:.82`.
  - Card pop order: w3 .25s → w2 .4s → w4 .5s → w1 .6s.
  - Then an idle float: `.wallsec.in .wl{animation:wlFloat 6s ease-in-out infinite}` with `@keyframes wlFloat{0%,100%{translate:0 0} 50%{translate:0 -7px}}`.

    | Card | Delay | Duration |
    |---|---|---|
    | w1 | 1.2s | 6s |
    | w2 | 2.4s | 7s |
    | w3 | 1.6s | 6.5s |
    | w4 | 3s | 7.5s |

  - Stars: `inline-block; animation:starPop .6s cubic-bezier(.3,1.6,.5,1) both; delay:1s`, `@keyframes starPop{from{opacity:0; scale:.6}}`.
- Below the fan: a tagline (`400 21px`) and a `.btn.dark` button.
- ≤980px: a 2-column grid with mild tilts. w1 `rotate(-3deg)`, w2 `rotate(2deg) translateY(16px)`, w3 `rotate(-2deg)`, w4 `rotate(3deg) translateY(16px)`.
- ≤620px: a single column with no rotation.

## 14. Dark POP CTA with peeking mascot (`section.dark.pp-tease`)
- `position:relative; overflow:clip; text-align:center; padding:88px 0 236px; background:--grad-pine`.
- Content:
  - eyebrow `.pp-eb`: `500 12px/1.4 --fb; .2em; uppercase; lime; margin-bottom:18px`
  - h2: white, max 13ch, balanced wrapping
  - lede `.pp-lede`: `500 clamp(22px,2.4vw,30px)/1.25 --fd; -.02em; lime; max 30ch; margin-top:28px`
  - script line `.pp-script`: `400 clamp(26px,3vw,36px)/1.2 'Caveat'`, white, `margin-top:14px`
  - `.btn.primary` with the glow ring, `margin-top:34px`
- **Peeking mascot `.pp-up`:**
  - `position:absolute; left:50%; bottom:0; translateX(-50%); width:min(360px,70vw); padding-top:24px; pointer-events:none; z-index:1; --v:.4`
  - `img{transform:translateY(calc((1 - var(--v)) * 100%))}`, so only the top 40% shows above the section's bottom edge (the section clips the rest)
  - `transition:transform .9s cubic-bezier(.3,1.3,.5,1), opacity .35s`
  - `.pp-tease:hover .pp-up{--v:.42}`: it rises 2% on section hover
  - idle: `img{animation:ppbob 3.6s ease-in-out infinite}`, `@keyframes ppbob{0%,100%{translate:0 0} 50%{translate:0 -8px}}`. It uses `translate`, so it composes with the transform-based peek.
- The button links to a quiz page (out of scope).

## 15. Pricing cards (`.peq` equation)
- Header `.hd.c.prc`: two-line h2 and a `.big.sp` subline.
- Grid: `1fr 48px 1fr 48px 1fr`, stretch. It reads card **+** card **=** card. Operator `.pop` is `300 34px --fd` in pine. Single column at ≤900px.
- Card `.pq`:
  - `white; 1px #E7EAE8; radius 22px; padding:32px 30px; gap:12px; box-shadow:0 26px 50px -38px rgba(16,32,28,.45)`
  - `transition:transform .35s var(--ease), box-shadow .35s`; `:hover{translateY(-5px)}`
  - `.lab`: `500 12px; .18em; uppercase; pine`; h3 `clamp(20px,1.9vw,24px)`; p `300 18px`
- Result card `.pq.dk`: `--grad-dark`, no border, `box-shadow:0 34px 60px -34px rgba(16,32,28,.7)`, lime label, white text.
- `.prange` below:
  - `.pr1`: `500 clamp(20px,2.1vw,28px)/1.2 --fd`, pine
  - `.pr2`: `300 19px` plus an inline `.mt`/`.ma` link (underline on hover)
- No scroll reveal on home: `.pq` is not in the reveal list (inferred: optionally add `.reveal`).

## 16. FAQ accordion (`section.sec.alt > .faq`)
- Native `<details>/<summary>`, with no JS and no height animation. The answer appears instantly; only the icon animates.
- Container `margin-top:56px`. Each `details` has a `1px var(--hair)` bottom border (the first also has a top border).
- `summary`: `list-style:none; flex; space-between; gap:24px; padding:26px 0; font:500 20px/1.3 --fd; letter-spacing:-.02em`; the marker is hidden.
- Focus: `outline:2px solid #E6F3D4; outline-offset:4px; radius 8px`.
- **Plus/minus icon `.pm`:**
  - 22×22, two bars made by `::before` and `::after`: `16px × 2.5px`, `background:#7FB54E`, centered with `translate(-50%,-50%)`
  - `::after` starts at `rotate(90deg)`; `details[open] .pm::after` goes to `rotate(0)`, so the + morphs into a −
  - `transition:transform .25s var(--ease)`
- Answer `p`: `300 19px/1.6 --fb; max-width:70ch; padding:0 48px 28px 0`.
- (inferred) For a smoother version, animate `grid-template-rows: 0fr → 1fr`. The original does not do this.

## 17. Final CTA (`section.closer`) and peeking footer mascot with confetti
- `.closer`: plain white, centered column, `padding:96px 0 138px` (≥901px).
  - h2.xl `clamp(34px,4.3vw,58px)/1.06`
  - `.big`: `300 clamp(17px,1.3vw,19px)`, max 60ch, `margin:20px auto 28px`
  - `.ctas` (gap 24px): `.btn.primary` + `.btn.ghost`
  - `.fine` note (`letter-spacing:.03em`)
- **`#fpeek`:** the mascot lives inside `footer.foot2` (`position:relative; overflow:visible`) and peeks over the footer's top edge into the closer's bottom padding.
  - `position:absolute; bottom:100%; z-index:6; cursor:pointer; role=button; tabindex=0`
  - ≥901px: `width:280px; left:calc(50% + 180px)` (240px and `left:calc(50% + 124px)` at 901–1100px)
  - ≤900px: `width:220px`
  - `.fpeek-clip`: `aspect-ratio:500/335; overflow:visible; clip-path:inset(-80px -40px 0 -40px)`, which clips only the bottom edge so the body hides "below the footer line"
  - `.fpeek-clip .uni`: `position:absolute; width:100%; transform:translateY(100%); transition:transform .9s cubic-bezier(.3,1.35,.5,1)`; `.fpeek.up .uni{transform:translateY(0)}`; hover on `.up` does not move it further (overridden)
  - hooves overlay `.fp-hooves`: a second copy of the image clipped to two hoof regions (`clip-path:inset(89% 60.8% 0 19.2% round 0 0 38% 38%)` and `inset(89% 12.2% 0 67.4% …)`). It sits above the edge with `opacity:0 → 1` on `.up`, using `transition:opacity .25s .75s`, so it fades in after the rise. The hooves appear to grip the ledge.
  - speech bubble `.fpeek-bub`:
    - `500 15px --fd` (14px at ≥901px), pine on white, 1px mist border, `padding:10px 16px`
    - `box-shadow:0 18px 30px -18px rgba(16,32,28,.45)`
    - ≥901px: `left:calc(100% + 8px); top:44px`, with `border-radius:18px 18px 18px 4px` (tail at bottom-left) and `transform-origin:0 100%`
    - hidden state: `opacity:0; transform:translateY(8px) scale(.85)`
    - transition: `opacity .3s, transform .45s cubic-bezier(.3,1.6,.5,1)`
    - `.fpeek.talk` shows it with `opacity:1; transform:none`
- **JS:**
  ```
  IO(target = footer, threshold .15):
    first intersect → arrive(): add 'up'; after 850ms (0 if reduced motion) → burst(40) + say(lines[0])
    leaving with boundingClientRect.top > 0 (scrolled back up) → remove 'up','talk','tags'; re-arm
  click / Enter / Space → ensure 'up'; li = (li+1) % lines.length; burst(34); say(lines[li])
  say(t): bubble.text = t; add 'talk'; after 3400ms remove 'talk'
  burst(n): skip if reduced motion
    for i in 0..n-1:
      a = -π·(0.1 + 0.8·rand);  r = 80 + rand·170
      if i % 6 == 0: emoji [🦄✨🎉💚][i%4]
      else: (i odd ? 'sq' : 'ci') with colors [#C6E79E,#AEDA7E,#183A33,#E6F3D4,#FFFFFF][i%5]
      --x = cos(a)·r;  --y = sin(a)·r;  --r = rand(-270..270)deg;  --d = 1.1–1.8s
    // uses the same .cf / cfly keyframes; container at left:50%, top:40% of .fpeek
  ```
  There are 5 rotating bubble lines. Write your own copy.

## 18. Footer (`footer.foot2`)
- Background `--grad-pine`, text `rgba(255,255,255,.72)`, `padding-top:44px` (≥901px).
- `.ftop`: grid `1.1fr 2fr`, gap 56px, `padding-bottom:30px`, `1px rgba(255,255,255,.12)` bottom border.
- Brand column:
  - 200px logo
  - tagline: bold line `500 --fd` in white, plus a sub-line `16px/1.55`
  - `.flab`: `12px; .2em; uppercase; rgba(255,255,255,.6)`
- **Subscribe pill `.sub`:**
  - `white; radius 100px; padding:6px; max-width:440px`
  - input `300 17px`, transparent; a `.btn.primary` with the glow ring inside the pill
  - `:focus-within{box-shadow:0 0 0 3px rgba(198,231,158,.6)}`
  - message `.fmsg`: lime, `min-height:22px`
- Subscribe JS:
  ```
  validate with /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  disable the button; status text "Adding you…"
  POST JSON → success / error text; re-enable the button
  ```
- `.fcols`: 4 columns (2 at ≤960px).
  - h4: `12px; .2em; uppercase; rgba(255,255,255,.6); margin-bottom:16px`
  - links: `400 16px --fd`, white at opacity .92; hover → `#C6E79E`
- `.fbot`: flex, gap 40px, `padding:18px 0`, `400 15px`. Legal links `rgba(255,255,255,.72)` → white on hover. A LinkedIn icon is pushed right with `margin-left:auto` and turns lime on hover.

## 19. Reduced-motion handling
- **Global kill switch:** `@media (prefers-reduced-motion:reduce){ *{scroll-behavior:auto!important; transition:none!important; animation:none!important} }`.
- Most entrance animations (`rise`, `uniIn`, `pop`, `bob`, `hop`, `lgFloat`, `wlFloat`, `starPop`, bar, slider, ladder and pfill transitions, the problem-row reveal) are authored **inside** `@media (prefers-reduced-motion:no-preference)`, so under reduce the elements simply render in their final state.
- Explicit resets:
  - `.rv-l{opacity:1!important; transform:none!important}`
  - `.swoosh path{stroke-dashoffset:0}`
  - `.cf{display:none}` (no confetti)
  - `.seal svg{animation:none}`
  - `.wave i, .cdot::after{animation:none}`
  - `.pdot/.gm i/.btn.primary::before{animation:none; opacity:0}` (the glow ring is hidden)
  - `.hero-uni .uni.hx{opacity:1!important; transform:none!important}`
  - `.pp-up img{animation:none!important; transition:none!important}`
  - `.fpeek-clip .uni{transition:none}`
- JS guards: every reveal or animation module checks `matchMedia('(prefers-reduced-motion: reduce)')`. The generic `.reveal`, count-ups, hero `hxpre`, buck and confetti are skipped, and the fpeek bubble shows with 0 delay.
- Fallback: if IntersectionObserver is absent, final classes are added immediately.

## 20. Trigger summary (quick reference)

| Element | Trigger | Delay / stagger |
|---|---|---|
| Hero text `.rise` | load (CSS) | 0, .08, .16, .24s; .9s |
| Swoosh draw | load | .8s delay, 1.8s |
| Notes n1/n2/n3 | load | 1.05, 1.3, 1.55s; .6s |
| Hero mascot pop | IO .3 | +500ms; confetti +450ms |
| Hero mascot buck | IO .4 | +900ms; idle after +1000ms |
| Hero card bars | IO .35 → `.in` | 1.1s; .12s steps |
| Stat count-up | IO .6 | 1700ms easeOutCubic; replays on hover |
| Problem rows | IO .3 | see the table in §9 |
| Bento cards | IO .12 (−40px bottom) or IO .35 + 250ms | 70ms sibling stagger (max 350ms) |
| Clocks | setInterval | 15s |
| Talent tabs | click / arrow keys | bars `.in` +30ms |
| How-it-works | IO .4 | +300ms |
| Testimonial wall | IO .25 | w3 .25 → w2 .4 → w4 .5 → w1 .6s |
| Footer mascot | IO .15 on the footer | rise .9s, burst +850ms; resets when scrolled back above |
| Infinite loops | always | btnPulse 2.6s, ping 2–2.4s, lgFloat 6/7s, spinSeal 32s, wv 1.1s, wlFloat 6–7.5s, ppbob 3.6s, finIdle 3.6s |
