# E-Africa Services: homepage (Next.js)

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

## Structure

```
src/
  app/
    layout.tsx        fonts (Montserrat, Inter, IBM Plex Mono, Caveat via next/font) + metadata
    page.tsx          the homepage: just a list of sections
    globals.css       tokens, buttons, shared primitives, responsive + reduced-motion rules
  components/
    sections/         one component + one CSS file per section
    ui/
      primitives.tsx  Button, MoreLink, Avatar, Brand, CheckDot, Kicker, DotChips
      Mascot.tsx      the original lion-cub mascot (inline SVG, blinking eyes)
  lib/
    content.ts        ALL copy and data. Edit text here, not in components.
    motion.ts         useInView / useInViewCallback / prefersReducedMotion
    confetti.ts       confetti(containerEl, { n, spread, base, range })
    tabs.ts           selectTab(id): switch the talent tabs from anywhere
public/
  brand/  partners/  people/   (people/*.svg are illustrated avatars; drop a .jpg in and update content.ts)
```

## Reusing components

Every section takes an optional `data` prop that defaults to the homepage content, so you can reuse it on another page with different copy:

```tsx
import Faq from '@/components/sections/Faq';
<Faq data={{ title: 'Talent FAQs', items: [['Do I pay a fee?', 'No upfront fees.']] }} />
```

Smaller pieces are exported too: `VettingCard`, `StageMascot` (HeroStage), `StatCard` (Stats), `BentoCard`, `RoleBlueprint`, `LiveClocks`, `LevelLadder`, `Receipt`, `ScaleTimeline`, `RotatingSeal` (Bento), `RoleCard` (TalentTabs), `Step`, `CallTile`, `TrioTile`, `DoneTile` (HowItWorks), `TestimonialCard`, `FooterPeek`.

## Motion

No animation libraries. CSS keyframes and transitions are triggered by IntersectionObserver hooks. Every effect respects `prefers-reduced-motion` and shows its final state instead.
